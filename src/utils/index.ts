import jsSHA3 from 'js-sha3';
import namehash from 'eth-ens-namehash';
import contentHash from 'content-hash/dist/index.js';
import {EthAddressType} from '../lib/types.js';

const CONTENT_HASH_CODEC_MAP = {
    'ipfs-ns': 'ipfs://',
    'swarm-ns': 'bzz://'
};

export default {
    getMethodID(methodSignature): string {
        return this.add0x(this.hash(methodSignature).slice(0, 8));
    },

    trimHex(hex: string): string {
        if (!hex) return;
        return hex.replace(/0x0+/g, '');
    },

    /**
     * Remove unneeded leading zeros.
     *
     * @param hex
     */
    normalizeHex(hex: string): string {
        if (!hex) return;
        if (hex === '0x') return hex;
        return this.add0x(this.trimHex(hex));
    },

    add0x(hex: string): string {
        return '0x' + hex;
    },

    remove0x(hex: string): string {
        if (!hex || !hex.startsWith('0x')) return;
        return hex.slice(2);
    },

    node(string: string): string {
        return namehash.hash(string);
    },

    hash(string: string): string {
        return jsSHA3.keccak256(string);
    },

    getLTDfromDomain(domain: string): string {
        return domain.split('.').pop();
    },

    getLabelsFromDomain(domain: string): string[] {
        return domain.split('.').slice(0, -1);
    },

    getAddressParent(name: string): string {
        return name.split('.').slice(1).join('.');
    },

    getNameMain(name: string): string {
        if (this.getAddressType(name) !== EthAddressType.name) throw `parameter should be a name, got: ${name}`;

        return name.split('.').slice(-2).join('.');
    },

    getAddressType(address: string): EthAddressType {
        if ((address.endsWith('.eth') && address.length >= 5) || address === 'eth') return EthAddressType.name;
        if ((address.startsWith('0x') && !address.endsWith('.addr.reverse')) && address.length === 42 && this.trimHex(address) || (address.endsWith('.addr.reverse') && !address.startsWith('0x'))) return EthAddressType.address;
        return EthAddressType.error;
    },

    // FIXME: need a library to convert it in correct way with no dependencies
    byteToString(str: string, truncate: boolean = false): string | undefined {
        if (!str) return;

        let output = str.slice(130, 130 + 76);
        if (truncate) output = output.replace(/00+/, '');

        return output;
    },

    decodeContentHash(string: string): object | undefined {
        if (!string) return;

        string = this.byteToString(string);
        if (!string) return;

        return {
            content: contentHash.decode(string),
            codec: contentHash.getCodec(string)
        }
    },

    getContentHashAsURL(contentHash): string | undefined {
        if (!contentHash) return;

        const codec = this.getContentHashCodec(contentHash.codec);
        return `${codec}${contentHash.content}`;
    },

    getContentHashCodec(codec): string | undefined {
        return CONTENT_HASH_CODEC_MAP[codec];
    },

    hexToAscii(hex): string | undefined {
        if (!hex) return;

        let value = '';
        let i = 0;

        if (hex.substring(0, 2) === '0x') i = 2;

        for (; i < hex.length; i += 2) {
            const code = parseInt(hex.substring(i, i + 2), 16);
            value += String.fromCharCode(code);
        }

        return value;
    },

    /**
     * Return address hex (0x....) from name.addr.reverse.
     * If address name is not in revert form, then just passing string is returning.
     */
    reverseAddressToHex(address: string): string {
        const reverseAddressEnding = '.addr.reverse';
        if (address && address.endsWith(reverseAddressEnding)) {
            return this.add0x(address.replace(reverseAddressEnding, ''));
        }

        return address;
    },

    isResult(str: string | number): boolean {
        return str && this.trimHex(str.toString()) && str !== '0x';
    }
}
