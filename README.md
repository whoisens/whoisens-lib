# WhoisENS.org lib


### Install


```bash
npm ci
npm build:watch
```


### Use


```javascript
// In case running on Node.js, not browser, install and export globally `fetch`
import fetch from 'node-fetch';
global.fetch = fetch;


// get name owner
const ens = new ENS();
await ens.init('whoisens.eth');
const result =  await ens.getNameOwner();


// get registral owner (controller)
const result = await ens.getRegistrarOwner();


// get name expiration date
const result = await ens.getRegistrarExpired();

// resolve name or address
const resultAddress = await ens.getResolverAddress();

// get content hash
const resultContent = await ens.getContentHash();
```
