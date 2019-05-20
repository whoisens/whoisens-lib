# WhoisENS API library

<p>
  <a href="https://www.npmjs.com/package/whoisens-lib">
    <img src="https://img.shields.io/npm/v/whoisens-lib.svg" alt="npm version">
  </a>

  <a href="https://travis-ci.org/whoisens/whoisens-lib">
    <img src="https://api.travis-ci.org/whoisens/whoisens-lib.svg?branch=master" alt="Build status">
  </a>

  <a href="https://packagephobia.now.sh/result?p=whoisens-lib">
    <img src="https://packagephobia.now.sh/badge?p=whoisens-lib" alt="install size">
  </a>

  <a href="https://github.com/whoisens/whoisens-lib/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/whoisens-lib.svg" alt="license">
  </a>
</p>


Lightweight library with minimum dependencies to work with ENS. Get owner/controller info,
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


const networkName = 'mainnet';
const networkURL = `https://${networkName}.infura.io/v3/<YOUR_KEY_HERE>`;

// get name owner (registrar)
const ens = new ENS(networkName, networkURL);
await ens.init('whoisens.eth');
const result = await ens.getOwner();

// get name expiration date
const result = await ens.getExpirationDate();

// get controller
const result = await ens.getController();

// resolve name or address
const result = await ens.resolve();

// get content hash
const result = await ens.getContentHash();
```


### Build (for development)
```bash
npm ci
npm build:watch
```
