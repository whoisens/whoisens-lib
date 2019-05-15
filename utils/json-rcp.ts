import config from '../config.json';


export default {
    /**
     * Make a JSON-RCP call
     * @link https://infura.io/docs/ethereum/json-rpc/eth_call
     * @link https://solidity.readthedocs.io/en/latest/abi-spec.html#examples
     * @link https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
     * @param networkName
     */
    async call({networkName = config.defaultNetworkName as string, to, data}) {
        const url = `https://${networkName}.infura.io/v3/${config.infuraClientID}`;

        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'jsonrpc': '2.0',
                'id': new Date().valueOf(),
                'method': 'eth_call',
                'params': [{
                    to,
                    data
                }, 'latest']
            })
        });

        return await request.json();
    }
}
