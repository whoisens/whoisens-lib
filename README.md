# WhoisENS API library

Lightweight library to working with ENS. Get owner/controller info,
date expiration, resolve name/addresses.

Works both on browser and Node.js.


### Install

```bash
npm i whoisens-lib
```


### Use


```javascript
// In case running on Node.js, install and export globally `fetch`
import fetch from 'node-fetch';
global.fetch = fetch;


// get name owner
const ens = new ENS();
await ens.init('whoisens.eth');
const result = await ens.getNameOwner();

// get registral owner (controller)
const result = await ens.getRegistrarOwner();

// get name expiration date
const result = await ens.getRegistrarExpired();

// resolve name or address
const resultAddress = await ens.getResolverAddress();

// get content hash
const resultContent = await ens.getContentHash();
```


### Build (for development)
```bash
npm ci
npm build:watch
```
