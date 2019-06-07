## [1.0.1] - 2019-06-07

### Added
- infura network test


## [1.0.0] - 2019-06-07

Breaking API changes (constructor parameters).

### Added
- unicode support
- new tests to handle non-existed names #21

### Changed
- constructor parameters. Now parameters is optional #13
Default network is https://eth.gateway.whoisens.org and networkId is taken from JSON-RPC call. 
- migrated to [JSON-RPC3](https://github.com/industral/JSON-RPC3)
- improved tests 
- moved common tests #22


## [1.0.0-beta.8] - 2019-05-31

### Added
- dependencies & devDependencies shields
- build dist for browsers `npm run build:browser`
- added test for browsers as well


### Changed
- updated dependencies
- separated browser and nodejs tests

### Fixed
- CommonJS doesn't work #14
- Add unit test in real browser #12


## [1.0.0-beta.7] - 2019-05-30

### Changed
- updated `whoisens-test-dataset`
- updated README 
- execute tests before npm publish


## [1.0.0-beta.6] - 2019-05-23

### Changed
- changed target from es2018 to es2017, so Edge understands it
- changed http to https


## [1.0.0-beta.5] - 2019-05-22

### Changed
- switched tests from infura to internal one http://eth.gateway.whoisens.org

## [1.0.0-beta.4] - 2019-05-21

### Added
- addressType to output


## [1.0.0-beta.3] - 2019-05-21

### Changed
- used external dataset
- returns errors if JSON RCP has one
- other small fixes


## [1.0.0-beta.2] - 2019-05-20

### Added

- ability to set custom network url endpoint #2
- integrated Travis CI


## [1.0.0-beta.1] - 2019-05-17

API is changed.

### Changed
- lot of code refactoring. API is changed.

### Added
- integration tests #1
- added support for subdomains #3
- new info in result object for JSON RCP, including contract address, method, payload, parameters, etc...
- support for ems and cjs
- documentation

## [0.0.7] - 2019-05-15

### Changed
- fixed TS errors


## [0.0.2] - 2019-05-15

### Changed
- code refactoring
- ESM compatible


## [0.0.1] - 2019-05-11

Initial version
