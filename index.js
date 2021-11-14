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


axios.post('http://localhost:3572/v1/cardano/mint/asset', {'Content-Type': 'application/json', body: request})
                .then(response => console.log(response))
                .catch((error) => {
                    if (error.response) {
                      // Request made and server responded
                      console.log(error.response.data);
                      console.log(error.response.status);
                      console.log(error.response.headers);
                    } else if (error.request) {
                      // The request was made but no response was received
                      console.log(error.request);
                    } else {
                      // Something happened in setting up the request that triggered an Error
                      console.log('Error', error.message);
                    }
                
                  });



