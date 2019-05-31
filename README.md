# WhoisENS library

<p>
    <a href="https://www.npmjs.com/package/whoisens-lib">
        <img src="https://img.shields.io/npm/v/whoisens-lib.svg" alt="npm version">
    </a>
    <a href="https://travis-ci.org/whoisens/whoisens-lib">
        <img src="https://api.travis-ci.org/whoisens/whoisens-lib.svg?branch=master" alt="Build status">
    </a>
    <a href="https://david-dm.org/whoisens/whoisens-lib">
        <img src="https://david-dm.org/whoisens/whoisens-lib/status.svg" alt="dependencies status">
    </a>
    <a href="https://david-dm.org/whoisens/whoisens-lib?type=dev">
        <img src="https://david-dm.org/whoisens/whoisens-lib/dev-status.svg" alt="dependencies status">
    </a>
    <a href="https://packagephobia.now.sh/result?p=whoisens-lib">
        <img src="https://packagephobia.now.sh/badge?p=whoisens-lib" alt="install size">
    </a>
    <a href="https://github.com/whoisens/whoisens-lib/blob/master/LICENSE">
        <img src="https://img.shields.io/npm/l/whoisens-lib.svg" alt="license">
    </a>
</p>


Lightweight library with minimum dependencies to work with [ENS](https://ens.domains/) (Ethereum Name Service).

## Features
- get owner/controller information
- get name date expiration
- resolve name to addresses and address to name
- get contenthash (IPFS/Swarm) 

Works with both browser and Node.js.

Library used by [WhoisENS.org](https://whoisens.org)

> PLEASE NOTE: whoisens-lib doesn't work with old ENS registrar (names registered via auction).
These names [should be migrated to new ENS registrar by May 4, 2020](https://medium.com/the-ethereum-name-service/where-you-can-use-the-new-ens-registrar-d209833c6eda).

## Advantages

- advanced output. You can debug what contract was used, what method was called, what payload was passed and more other info
- `resolve` method accept and resolves both names and addresses. You don't need to check it manually
- content hash returns already decoded
- lightweight
- you can include it directly in your browser via `<script>`, for example you can't do it with Web3.js


## How it works?

![](./docs/ENS.png)

For more information, please read [ENS (Ethereum Name Service): How it works?](https://medium.com/@industral/ens-ethereum-name-service-how-it-works-cc57ed296473)

### Install

```bash
npm i whoisens-lib
```


### Example of use


```javascript
// In case running on Node.js, install and export globally `fetch`
import fetch from 'node-fetch';
global.fetch = fetch;

const networkName = 'mainnet';
const networkURL = 'https://eth.gateway.whoisens.org';
// const networkURL = `https://${networkName}.infura.io/v3/<YOUR_KEY_HERE>`;

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

### Include library

#### ECMAScript Modules (Node.js or webpack)

```javascript
import ENS, {ResolveType, EthAddressType, utils} from 'whoisens-lib';
```

It'll include default [ESM](https://nodejs.org/api/esm.html) module.

#### CommonJS (Node.js)

```javascript
const WhoisENS = require('whoisens-lib/cjs/index.js');

const ENS = WhoisENS.default;
const {ResolveType, EthAddressType, utils} = WhoisENS;
```

#### Script (browser)

```html
<script src="https://unpkg.com/whoisens-lib/dist/browser/main.js"></script>
<script>
  const ENS = WhoisENS.default;
  const {ResolveType, EthAddressType, utils} = WhoisENS;
</script>
```


#### REST API
If you don't willing to include any libraries, you can use [WhoisENS REST API](https://github.com/whoisens/whoisens-rest-api) directly.


### Build (development)

```bash
npm ci
npm build:watch
```


### Build (production)

Will produce `esm`, `cjs` and `bundle` modules.

```bash
npm run build
```


### Test

```bash
npm run test
```
