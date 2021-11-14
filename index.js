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

let sent = []
let minted = []
let paymentsReceived = []
let invalidPayments = []

let dropMonitor = {} 

let getCurrentUTXOs = axios.post('http://localhost:3572/v1/cardano/address/mints', request,{ headers: {'Content-Type': 'application/json'}})
                .then(response => {
                    const txs = JSON.parse(response.data)
                    let myTXs = txs.map((utxo) => {
                        if (utxo.amount.length >= 2) {
                            let address = utxo.address
                            let txInput = utxo.amount[1]
                            let txHash = utxo["txHash"]
                            let txOutput = utxo.amount[utxo.output_index]
                            let txix = `${txHash}#${utxo.output_index}` 
                            let policyID = txInput.unit.substring(0, 56)
                            let tokenNameHex = txInput.unit.substring(56)
                            let tokenName = hexToUtf8(tokenNameHex)
                            let mint =  {address, txHash, recieved : txInput, unspent: {output: txOutput.quantity, txix}, policyID, tokenName, sentStatus: ""}

                            if (address != options.address) {
                                mint.sentStatus = true
                                sent.push(mint)
                            } else {
                                mint.sentStatus = false
                                minted.push(mint)
                            }
                            return mint

                        } else {

                            let address = utxo.address
                            let txHash = utxo["txHash"]
                            let txInput = utxo.amount[0]
                            let txix = `${txHash}#${utxo.output_index}` 
                            let customerAddress = utxo.inputAddress
                            let payment = txInput.quantity / 1000000

                            if (payment >= 20) {
                                let validPayment = {txHash, customerAddress, payment, recievingAddress: utxo.address, lovelace: txInput.quantity, txix}
                                paymentsReceived.push(validPayment)
                                return validPayment

                            } else {
                                let invalidPayment = {txHash, address, customerAddress, status: "Payment below 20ADA"}
                                invalidPayments.push(invalidPayment) 
                                return invalidPayment 
                            }
                        } 
                    })
                    dropMonitor.payments = paymentsReceived
                    dropMonitor.minted = minted
                    dropMonitor.sent = sent
                    dropMonitor.failedPurchases = invalidPayments
                    return myTXs
                    //  return response.data
                })
                .catch((error) => {
                    console.log(error)
                  });



let insertMinted = (minted) => {
    let promise = new Promise((resolve, reject) => {
    let all = minted.map((mint) => {
    return axios.post('http://localhost:3572/v1/cardano/minted', JSON.stringify(mint),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            // resolve(response.data)
            return response.data
        })
        .catch((error) => {
            // reject(error)
            return error
        });
    })

    Promise.all(all)
    .then((results) => {
        resolve(results)
    })
    .catch((errors) => {
        reject(errors)
    })


})

    return promise
}

getCurrentUTXOs.then(() => {
    insertMinted(dropMonitor.sent)
    .then(results => {
        console.log(JSON.stringify(results))
    })
    .catch((e) => console.log(e))
})
.catch((e) => console.log(e))


// axios.get('http://localhost:3572/v1/cardano/address/mints')
//                 .then(response => {
//                     console.log(response.data)
//                 })
//                 .catch((error) => {
//                     console.log(error.toJSON())
//                   });


