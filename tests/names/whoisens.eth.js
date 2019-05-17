export default {
  "main_name": "whoisens.eth",
  "owner": "0xf304e02ae3b43806181d1d341f72f5b440e55ad9",
  "expires": 1588734843,

  "eth_names": [
    {
      "name": "whoisens.eth",
      "parent": "eth",
      "controller": "0xbe7eef087030eda4750fc50afe31a3adec7e5d09",
      "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3",
      "resolved_address": "0x5b854fc85bb7b2b3bdb78bd8dd85832121bd082c",
      "resolved_content": "ipfs://QmNxpPDsfY4vTm1VR1rzLJaZA7sfzyESdrPXNWbqqabW1a",
      "reverse_resolver": "0x5fbb459c49bb06083c33109fa4f14810ec2cf358",
      "reverse_resolved_address": "whoisens.eth"
    },
    {
      "name": "test.whoisens.eth",
      "parent": "whoisens.eth",
      "controller": "0xbe7eef087030eda4750fc50afe31a3adec7e5d09",
      "subdomains": ["test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10"]
    },
    {
      "name": "test1.test.whoisens.eth",
      "parent": "test.whoisens.eth",
      "controller": "0xbe7eef087030eda4750fc50afe31a3adec7e5d09"
    },
    {
      "name": "test2.test.whoisens.eth",
      "parent": "test.whoisens.eth",
      "controller": "0xff3e70307d0a0ce5e5e0d1d086163a87565e0d12",
      "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3"
    },
    {
      "name": "test3.test.whoisens.eth",
      "parent": "test.whoisens.eth",
      "controller": "0xff3e70307d0a0ce5e5e0d1d086163a87565e0d12",
      "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3",
      "resolved_address": "0x5b854fc85bb7b2b3bdb78bd8dd85832121bd082c",
      "reverse_resolver": "0x5fbb459c49bb06083c33109fa4f14810ec2cf358",
      "reverse_resolved_address": "whoisens.eth"
    },
    {
      "name": "test4.test.whoisens.eth",
      "parent": "test.whoisens.eth",
      "controller": "0xc16b6bef75de762deefaa2ebc5ed3d652f7b52e9",
      "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3",
      "resolved_content": "bzz://21ea8e816cb15185d992a53cfbfee66924d32fc42bbdce6ba12f17d7d4e8639f"
    },
    {
      "name": "test5.test.whoisens.eth",
      "parent": "test.whoisens.eth",
      "controller": "0xbe7eef087030eda4750fc50afe31a3adec7e5d09",
      "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3",
      "resolved_content": "ipfs://QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ"
    },
    // {
    //   "name": "test6.test.whoisens.eth",
    //   "parent": "test.whoisens.eth",
    //   "controller": "0xbe7eef087030eda4750fc50afe31a3adec7e5d09",
    //   "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3"
    // },
    // {
    //   "name": "test7.test.whoisens.eth",
    //   "parent": "test.whoisens.eth",
    //   "controller": "0xbe7eef087030eda4750fc50afe31a3adec7e5d09",
    //   "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3"
    // },
    {
      "name": "test8.test.whoisens.eth",
      "parent": "test.whoisens.eth",
      "controller": "0xbe7eef087030eda4750fc50afe31a3adec7e5d09",
      "forward_resolver": "0xd3ddccdd3b25a8a7423b5bee360a42146eb4baf3",
      "resolved_address": "0xc16b6bef75de762deefaa2ebc5ed3d652f7b52e9",
      "reverse_resolver": "0x5fbb459c49bb06083c33109fa4f14810ec2cf358",
      "reverse_resolved_address": "test8.test.whoisens.eth"
    }
  ]
}
