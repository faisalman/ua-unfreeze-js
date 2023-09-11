# U(A)nfreeze.js
Unreduced, freeze-free version of your user-agent

```sh
npm i ua-unfreeze-js
```

## Methods

### * `unfreezeUA(): Promise<string>`

Unfreeze user-agent using client-hints data from window.navigator (client-side only)

### * `unfreezeUA(str: string, ch: UACHBrowser|UACHHeader):string`

Unfreeze user-agent using the supplied client-hints data

## Code Example

### In browser environment

```js
import { unfreezeUA } from 'ua-unfreeze-js';

/* 
    Suppose we're in a browser having this client hints data:
    
    {
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
    }

    With a frozen user-agent:
    
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Safari/537.36'
*/

// Now let's generate a complete user-agent:
unfreezeUA()
    .then(newUA => {
        console.log(newUA);
        // 'Mozilla/5.0 (Windows NT 11.0; ARM) AppleWebKit/537.36 (KHTML, like Gecko) New Browser/110.1.2.3 Chromium/110.1.2.3 Safari/537.36'
    });
```

Alternatively:

```js
import { unfreezeUA } from 'ua-unfreeze-js';

(async () => {
    const ua = navigator.userAgent;
    console.log(ua);
    // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Safari/537.36'

    const ch = await navigator.userAgentData.getHighEntropyValues(['fullVersionList','platform','platformVersion','architecture','mobile']);
    console.log(ch);
    /*
    {
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
    }
    */

    const newUA = unfreezeUA(ua, ch);
    console.log(newUA);
    // 'Mozilla/5.0 (Windows NT 11.0; ARM) AppleWebKit/537.36 (KHTML, like Gecko) New Browser/110.1.2.3 Chromium/110.1.2.3 Safari/537.36'
})();
```

### In server environment
```js
import http from 'http';
import { unfreezeUA } from 'ua-unfreeze-js';

http.createServer(function (req, res) {
    // get unfreezed user-agent
    const newUA = unfreezeUA(req.headers['user-agent'], req.headers);
    // write the result as response
    res.end(JSON.stringify(newUA, null, '  '));
})
.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
```

# License

MIT License

Copyright (c) 2023 Faisal Salman <<f@faisalman.com>>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.