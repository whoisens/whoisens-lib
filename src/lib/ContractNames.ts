const map = {
    '0x314159265dd8dbb310642f98f50c066173c1259b': 'Eth Name Service',
    '0xfac7bea255a6990f749363002136af6556b31e04': 'Base Registrar Implementation',
    '0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3': 'Public Resolver',
    '0x5fbb459c49bb06083c33109fa4f14810ec2cf358': 'Public Reverse Resolver'
};

export default {
    map,

    getName(address) {
        if (address === '0x') return '';
        return '(' + (map[address] || 'Custom') + ')'
    }
}
