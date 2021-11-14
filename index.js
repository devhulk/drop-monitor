const { default: axios } = require("axios")




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

// 1f9202548139a0441973dd92264d1542f72112d2a8a6cc10482dd226
// policyID is 56 chars
const convert = (from, to) => str => Buffer.from(str, from).toString(to)
const utf8ToHex = convert('utf8', 'hex')
const hexToUtf8 = convert('hex', 'utf8')

axios.post('http://localhost:3572/v1/cardano/address/mints', request,{ headers: {'Content-Type': 'application/json'}})
                .then(response => {
                    const txs = response.data
                    let mintedTokens = txs.map((utxo) => {
                        if (utxo.amount.length >= 2) {
                            let txInput = utxo.amount[1]
                            let txOutput = utxo.amount[utxo.output_index]
                            let policyID = txOutput.unit.substring(0, 57)
                            console.log(policyID)
                            let tokenNameHex = txOutput.unit.substring(56)
                            console.log(tokenNameHex)
                            let tokenName = tokenNameHex.hexToUtf8('hex', 'utf8')
                            console.log(tokenName)

                            let reciever = utxo.address
                            if (reciever.address == options.address) {
                                utxo.sent = false
                            } else {
                                utxo.send = true
                            }
                        } 
                    })
                     console.log(mintedTokens)
                     return response.data
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


