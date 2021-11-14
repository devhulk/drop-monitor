const { default: axios } = require("axios")
const { ReadPreferenceMode } = require("mongodb")

// create Wallet
let createWallet = () => {

}

// create transactions transaction/raw transactions/signed dirs
let createDirs = () => {

}

// create test mint command

let options = {
    address : "addr_test1vprnpeaw6h2yhcjl0m7pcs6235utpz7kh3vzxhqxd8gka8g4s66y9",
    config: "testnet",
    metadata: {
        asset_id: "anotherNFT1",
        asset_name: "NFT",
        ipfsLink: "ipfs://test",
        amount: "1",
        traits: []
    }
}

let request = JSON.stringify(options)


let response = axios.post('http://localhost:3572/v1/cardano/mint/asset', {'Content-Type': 'application/json', body: request})
                .then(response => console.log(response))
                .catch(e => console.log({response: e.response.data, status: e.response.status, headers: e.response.headers}))

console.log(response);


