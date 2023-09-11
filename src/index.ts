///////////////////////////////////////////////////
/*! U(A)nfreeze.js 0.1.0
    Unreduced, freeze-free version of your user-agent
    https://github.com/faisalman/ua-unfreeze-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
//////////////////////////////////////////////////

/// <reference types="user-agent-data-types" />

import { isFrozenUA } from 'ua-is-frozen';
import { UAClientHints } from 'ua-client-hints-js';

function isHeaders(obj: any): boolean {
    return Object.keys(obj).some(key => key.startsWith('sec-ch-ua'));
}

function getHeaders(obj: any): Record<string, string> {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => key.startsWith('sec-ch-ua'))) as Record<string, string>;
}

function merge(ua: string | undefined, ch: UADataValues | Record<string, string> | undefined): string {
    if (typeof ua !== 'string' || !ch) {
        return '';
    }
    if (isHeaders(ch)) {
        ch = new UAClientHints()
                    .setValuesFromHeaders(<Record<string, string>>ch)
                    .getValues();
    }
    switch (ch.platform) {
        case 'Windows':
            let [major, minor] = ch.platformVersion?.split('.').map(num => parseInt(num, 10)) || [0, 0];
            major = (major < 1) ? 6 : (major >= 13) ? 11 : 10;
            ua = ua .replace(/(?<OS>Windows NT) 10\.0/, `$<OS> ${major}.${minor ?? 0}`)
                    .replace(/; (?<ARCH>Win64; x64)/, 
                        (ch.architecture == 'arm') ? 
                            '; ARM' + (ch.bitness == '64' ? '64' : '') : 
                            (ch.wow64) ? 
                                '; WOW64' : 
                                (ch.architecture == 'x86' && ch.bitness != '64') ? 
                                    'x86' : '; $<ARCH>');
            break;
        case 'Android':
            ua = ua.replace(/(?<OS>Android) 10; K/, `$<OS> ${ch.platformVersion}; ${ch.model}`);
            break;
        case 'Linux':
        case 'Chrome OS':
            ua = ua.replace(/(?<ARCH>x86_64)/,
                    (ch.architecture == 'arm') ? 
                        ((ch.bitness == '64') ? 'arm64' : 'arm') :
                            (ch.architecture == 'x86' && ch.bitness != '64') ?
                                'x86' : '$<ARCH>');
            break;
        case 'macOS':
            ua = ua.replace(/(?<OS>Mac OS X) 10_15_7/, `$<OS> ${ch.platformVersion?.replace(/\./, '_')}`);
            break;
    }
    if (ch.fullVersionList || ch.brands) {
        ua = ua.replace(/Chrome\/\d+\.0\.0\.0 /, 
                    (<NavigatorUABrandVersion[]>(ch.fullVersionList || ch.brands))
                        .filter(browser => !/not.(a|your).br(owser|and)/i.test(browser.brand || ''))
                        .map(browser => {
                            const brand = browser.brand?.replace(/(google|microsoft) /i, '')
                                                        .replace(/(edg)e/i, '$1')
                                                        .replace(/(chrom)ium/i, '$1e');
                            return `${brand}/${browser.version} `;
                        })
                        .join(''));
    }
    if (ch.mobile || ch.formFactor?.includes('Mobile')) {
        ua = ua.replace(/( Safari\/537\.36)/, ' Mobile$1');
    }
    if (ch.model) {
        ua = ua.replace(/\) (AppleWebKit\/537\.36)/, `; ${ch.model}) $1`);
    }
    return ua;
}

export function unfreezeUA(ua?: string, ch?: UADataValues | Record<string, string>): Promise<string> | string {
    if (typeof ua !== 'string') {
        if (typeof window !== 'undefined') {
            ua = navigator.userAgent;
            if (isFrozenUA(ua) && navigator.userAgentData) {
                return navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness', 'formFactor', 'fullVersionList', 'model', 'platform', 'platformVersion', 'wow64']).then(ch => {
                    return merge(ua, ch);
                });
            }
            return ua;
        }
        if (ch && isHeaders(ch) && ch.hasOwnProperty('user-agent')) {
            return merge((<Record<string,string>>ch)['user-agent'], getHeaders(ch));
        }
        return '';
    }
    return isFrozenUA(ua) ? merge(ua, ch) : ua;
}