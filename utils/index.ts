import jsSHA3 from 'js-sha3';
import namehash from 'eth-ens-namehash';
import contentHash from 'content-hash/dist/index.js';
import {EthNameType} from '../lib/ENS.js';

const CONTENT_HASH_CODEC_MAP = {
    'ipfs-ns': 'ipfs://',
    'swarm-ns': 'bzz://'
};

export default new class {
    public getMethodID(methodSignature): string {
        return `0x${this.hash(methodSignature).slice(0, 8)}`;
    }

    public trimHex(hex: string): string {
        if (!hex) return;
        return hex.replace(/0x0+/g, '');
    }

    /**
     * Remove unneeded leading zeros.
     *
     * @param hex
     */
    public normalizeHex(hex: string): string {
        if (!hex) return;
        if (hex === '0x') return hex;
        return this.add0x(this.trimHex(hex));
    }

    public add0x(hex: string): string {
        return '0x' + hex;
    }

    public remove0x(hex: string): string {
        if (!hex || !hex.startsWith('0x')) return;
        return hex.slice(2);
    }

    public node(string: string): string {
        return namehash.hash(string);
    }

    public hash(string: string): string {
        return jsSHA3.keccak256(string);
    }

    public getLTDfromDomain(domain: string): string {
        return domain.split('.').pop();
    }

    public getLabelsFromDomain(domain: string): string[] {
        return domain.split('.').slice(0, -1);
    }

    public getNameType(address: string): EthNameType {
        if (address.endsWith('.eth')) return EthNameType.name;
        if (address.startsWith('0x') || address.endsWith('.addr.reverse')) return EthNameType.address;
        return EthNameType.error;
    }

    // FIXME: need a library to convert it in correct way with no dependencies
    public byteToString(str: string, truncate: boolean = false): string {
        let output = str.slice(130, 130 + 76);
        if (truncate) output = output.replace(/00+/, '');

        return output;
    }

    public decodeContentHash(string: string): object | undefined {
        if (!string) return;

        //HACK: !
        string = this.byteToString(string);
        if (!string) return;

        return {
            content: contentHash.decode(string),
            codec: contentHash.getCodec(string)
        }
    }

    public getContentHashAsURL(contentHash): string | undefined {
        if (!contentHash) return;

        const codec = this.getContentHashCodec(contentHash.codec);
        return `${codec}${contentHash.content}`;
    }

    public getContentHashCodec(codec): string | undefined {
        return CONTENT_HASH_CODEC_MAP[codec];
    }

    //https://github.com/ethereum/web3.js/blob/1.0/packages/web3-utils/src/index.js#L117
    //FIXME: doesn't work as should be. Also need a library to correct convertion
    public hexToAscii(hex): string | undefined {
        if (!hex) return;

        let value = '';

        let i = 0;
        const l = hex.length;

        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i += 2) {
            const code = parseInt(hex.substr(i, 2), 16);
            value += String.fromCharCode(code);
        }

        return value;
    };

    public reverseAddressToHex(address: string): string {
        return '0x' + address.replace('.addr.reverse', '');
    }
}
