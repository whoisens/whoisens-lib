export default class Config {
    private static instance: Config;

    private currentNetwork: string;
    private currentNetworkURL: string;

    private constructor() {
    }

    static getInstance() {
        if (!Config.instance) Config.instance = new Config();
        return Config.instance;
    }

    public getCurrentNetwork(): string {
        return this.currentNetwork;
    }

    public getCurrentNetworkURL(): string {
        return this.currentNetworkURL;
    }

    public setCurrentNetwork(currentNetwork: string): void {
        this.currentNetwork = currentNetwork;
    }

    public setCurrentNetworkURL(currentNetworkURL: string): void {
        this.currentNetworkURL = currentNetworkURL;
    }
}
