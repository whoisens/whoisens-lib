export default class Config {
    private static instance: Config;

    public currentNetworkId: string;
    public currentNetworkURL: string;
    public contractAddress: string;

    private constructor() {
    }

    static getInstance() {
        if (!Config.instance) Config.instance = new Config();
        return Config.instance;
    }
}
