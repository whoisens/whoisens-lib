import {IJSONRCPResponseResult, IJSONRCPResponse} from '../lib/types.js';

export default {
    /**
     * Make a JSON-RCP call
     * @link https://infura.io/docs/ethereum/json-rpc/eth_call
     * @link https://solidity.readthedocs.io/en/latest/abi-spec.html#examples
     * @link https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
     */
    async makeRequest({url, to, data}): Promise<IJSONRCPResponseResult> {
        const id = new Date().valueOf();
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id,
                method: 'eth_call',
                params: [{
                    to,
                    data
                }, 'latest']
            })
        });

        return {
            id,
            data: <IJSONRCPResponse>(await request.json())
        };
    }
}
