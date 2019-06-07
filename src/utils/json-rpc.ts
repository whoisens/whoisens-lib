import JSON_RPC, {IJSONRCPResponse} from 'json-rpc3';
import Config from '../lib/Config.js';

export default class JSONRPCRequest {
    private static instance: JSONRPCRequest;
    private readonly jsonRPC: JSON_RPC;

    private constructor() {
        this.jsonRPC = new JSON_RPC({
            url: Config.getInstance().currentNetworkURL
        });
    }

    static getInstance() {
        if (!JSONRPCRequest.instance) JSONRPCRequest.instance = new JSONRPCRequest();
        return JSONRPCRequest.instance;
    }

    /**
     * Make a JSON-RCP call
     * @link https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call
     * @link https://solidity.readthedocs.io/en/latest/abi-spec.html#examples
     */
    public async makeRequest({to, data}): Promise<IJSONRCPResponse> {
        return (await this.jsonRPC.calls({
            method: 'eth_call',
            params: [{
                to,
                data
            }, 'latest']
        })).get();
    }

    public async getNetworkID(): Promise<string> {
        return (await this.jsonRPC.calls({
            method: 'net_version',
            params: []
        })).get().result;
    }
}
