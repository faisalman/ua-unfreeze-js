"use strict";
/*! U(A)nfreeze.js 0.1.0
    Unreduced, freeze-free version of your user-agent
    https://github.com/faisalman/ua-unfreeze-js
    Author: Faisal Salman <f@faisalman.com>
    MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.unfreezeUA = void 0;
const ua_is_frozen_1 = require("ua-is-frozen");
const ua_client_hints_js_1 = require("ua-client-hints-js");
function isHeaders(obj) {
    return Object.keys(obj).some(key => key.startsWith('sec-ch-ua'));
}
function getHeaders(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => key.startsWith('sec-ch-ua')));
}
function merge(ua, ch) {
    var _a, _b, _c;
    if (typeof ua !== 'string' || !ch) {
        return '';
    }
    if (isHeaders(ch)) {
        ch = new ua_client_hints_js_1.UAClientHints()
            .setValuesFromHeaders(ch)
            .getValues();
    }
    switch (ch.platform) {
        case 'Windows':
            let [major, minor] = ((_a = ch.platformVersion) === null || _a === void 0 ? void 0 : _a.split('.').map(num => parseInt(num, 10))) || [0, 0];
            major = (major < 1) ? 6 : (major >= 13) ? 11 : 10;
            ua = ua.replace(/(?<OS>Windows NT) 10\.0/, `$<OS> ${major}.${minor !== null && minor !== void 0 ? minor : 0}`)
                .replace(/; (?<ARCH>Win64; x64)/, (ch.architecture == 'arm') ?
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
            ua = ua.replace(/(?<ARCH>x86_64)/, (ch.architecture == 'arm') ?
                ((ch.bitness == '64') ? 'arm64' : 'arm') :
                (ch.architecture == 'x86' && ch.bitness != '64') ?
                    'x86' : '$<ARCH>');
            break;
        case 'macOS':
            ua = ua.replace(/(?<OS>Mac OS X) 10_15_7/, `$<OS> ${(_b = ch.platformVersion) === null || _b === void 0 ? void 0 : _b.replace(/\./, '_')}`);
            break;
    }
    if (ch.fullVersionList || ch.brands) {
        ua = ua.replace(/Chrome\/\d+\.0\.0\.0 /, (ch.fullVersionList || ch.brands)
            .filter(browser => !/not.(a|your).br(owser|and)/i.test(browser.brand || ''))
            .map(browser => {
            var _a;
            const brand = (_a = browser.brand) === null || _a === void 0 ? void 0 : _a.replace(/(google|microsoft) /i, '').replace(/(edg)e/i, '$1').replace(/(chrom)ium/i, '$1e');
            return `${brand}/${browser.version} `;
        })
            .join(''));
    }
    if (ch.mobile || ((_c = ch.formFactor) === null || _c === void 0 ? void 0 : _c.includes('Mobile'))) {
        ua = ua.replace(/( Safari\/537\.36)/, ' Mobile$1');
    }
    if (ch.model) {
        ua = ua.replace(/\) (AppleWebKit\/537\.36)/, `; ${ch.model}) $1`);
    }
    return ua;
}
function unfreezeUA(ua, ch) {
    if (typeof ua !== 'string') {
        if (typeof window !== 'undefined') {
            ua = navigator.userAgent;
            if ((0, ua_is_frozen_1.isFrozenUA)(ua) && navigator.userAgentData) {
                return navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness', 'formFactor', 'fullVersionList', 'model', 'platform', 'platformVersion', 'wow64']).then(ch => {
                    return merge(ua, ch);
                });
            }
            return ua;
        }
        if (ch && isHeaders(ch) && ch.hasOwnProperty('user-agent')) {
            return merge(ch['user-agent'], getHeaders(ch));
        }
        return '';
    }
    return (0, ua_is_frozen_1.isFrozenUA)(ua) ? merge(ua, ch) : ua;
}
exports.unfreezeUA = unfreezeUA;
