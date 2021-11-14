const { default: axios } = require("axios")
const req = require("express/lib/request")
const { ReadPreferenceMode } = require("mongodb")

// create Wallet
let createWallet = () => {

}

// create transactions transaction/raw transactions/signed dirs
let createDirs = () => {

}

// create test mint command
const walletName = "test1"
// address : "addr_test1vprnpeaw6h2yhcjl0m7pcs6235utpz7kh3vzxhqxd8gka8g4s66y9",
// mintWalletAddr : "addr_test1vprnpeaw6h2yhcjl0m7pcs6235utpz7kh3vzxhqxd8gka8g4s66y9",

let options = {
    address : "addr_test1vpfvdy0rvkawm6zz4l3y5fykyagp5r7g300xv7dhrkxs4aq8mt5vq",
    mintWalletAddr : "addr_test1vpfvdy0rvkawm6zz4l3y5fykyagp5r7g300xv7dhrkxs4aq8mt5vq",
    walletName : walletName,
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


// axios.post('http://localhost:3572/v1/cardano/mint/asset',request ,{ headers: {'Content-Type': 'application/json'}})
//                 .then(response => {
//                     console.log(response.data)
//                 })
//                 .catch((error) => {
//                     console.log(error.toJSON())
//                   });

axios.post('http://localhost:3572/v1/cardano/address/mints', request,{ headers: {'Content-Type': 'application/json'}})
                .then(response => {
                    console.log(response.data)
                })
                .catch((error) => {
                    console.log(error.toJSON())
                  });

// axios.get('http://localhost:3572/v1/cardano/address/mints')
//                 .then(response => {
//                     console.log(response.data)
//                 })
//                 .catch((error) => {
//                     console.log(error.toJSON())
//                   });


