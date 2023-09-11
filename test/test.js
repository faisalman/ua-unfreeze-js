const { unfreezeUA } = require('../dist/cjs');
const assert = require('assert');

describe('unfreezeUA()', () => {
    describe('Returns unfrozen user-agent', () => {

        it('As a string when called with supplied args (ua, ch) in browser', () => {
            const ch = {
                fullVersionList: [
                    {
                        brand: 'New Browser',
                        version: '110.1.2.3'
                    },
                    {
                        brand: 'Chromium',
                        version: '110.1.2.3'
                    },
                    {
                        brand: 'Not(A:Brand',
                        version: '110'
                    }
                ],
                platform: 'Windows',
                platformVersion: '13.0.0',
                architecture: 'arm',
                mobile: false
            };
            const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Safari/537.36';
            const newUA = unfreezeUA(ua, ch);
            assert.equal(newUA, 'Mozilla/5.0 (Windows NT 11.0; ARM) AppleWebKit/537.36 (KHTML, like Gecko) New Browser/110.1.2.3 Chrome/110.1.2.3 Safari/537.36');
        });
        
        it('As a string when called with supplied args (ua, req.headers) in server', () => {
            const req = {
                headers : {
                    'sec-ch-ua' : '"Chrome"; v="74", ";Not)A=Browser"; v="13"',
                    'sec-ch-ua-full-version-list' : '"Microsoft Edge"; v="92.0.902.73", "Chromium"; v="92.0.4515.131", "?Not:A Browser"; v="3.1.2."',
                    'sec-ch-ua-arch' : '"arm"',
                    'sec-ch-ua-bitness' : '"64"',
                    'sec-ch-ua-mobile' : '?1',
                    'sec-ch-ua-model' : '"Pixel 99"',
                    'sec-ch-ua-platform' : '"Windows"',
                    'sec-ch-ua-platform-version' : '"13"',
                    'sec-ch-ua-wow64' : '?1',
                    'sec-ch-ua-form-factor' : '"Automotive"',
                    'user-agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.0.0 Safari/537.36',
                    'x-dummy' : '123'
                }
            }
            const newUA = unfreezeUA(req.headers['user-agent'], req.headers);
            assert.equal(newUA, 'Mozilla/5.0 (Windows NT 11.0; ARM64; Pixel 99) AppleWebKit/537.36 (KHTML, like Gecko) Edg/92.0.902.73 Chrome/92.0.4515.131 Mobile Safari/537.36');
        });
    });
});