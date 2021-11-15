const { default: axios } = require("axios")




// create Wallet
let createWallet = () => {

}

// create transactions transaction/raw transactions/signed dirs
let createDirs = () => {

}

// create test mint command
const walletName = "testOne"
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
                            let unspent = {output: txOutput.quantity, txix} 

                            let mint =  {address, recieved : txInput, unspent, policyID, tokenName, sentStatus: ""}
                            mint["_id"] = txHash

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
                            let txOutput = utxo.amount[utxo.output_index]
                            let unspent = {output: txOutput.quantity, txix} 

                            if (payment >= 20) {
                                let validPayment = {txHash, customerAddress, payment, recievingAddress: utxo.address, lovelace: txInput.quantity, txix, unspent}
                                validPayment["_id"] = txHash
                                paymentsReceived.push(validPayment)
                                return validPayment

                            } else {
                                let invalidPayment = {txHash, address, customerAddress, status: "Payment below 20ADA", unspent}
                                invalidPayment["_id"] = txHash
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



let updateMinted = (minted) => {
    let promise = new Promise((resolve, reject) => {
    axios.post('http://localhost:3572/v1/cardano/minted', JSON.stringify(minted),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            resolve(response.data)
        })
        .catch(e => resolve(e))
    })

    return promise
}

let updatePayments = (payments) => {
    let promise = new Promise((resolve, reject) => {
    axios.post('http://localhost:3572/v1/cardano/payments', JSON.stringify(payments),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            resolve(response.data)
        })
        .catch(e => resolve(e))
    })

    return promise

}

let updateSent = (sent) => {
    let promise = new Promise((resolve, reject) => {
    axios.post('http://localhost:3572/v1/cardano/orders/sent', JSON.stringify(sent),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            resolve(response.data)
        })
        .catch(e => resolve(e))
    })

    return promise

}

let runResults = {} 
let count = 0

const run = () => {
    runResults = {} 
    count++
    
    getCurrentUTXOs
        .then(() => {
            updateMinted(dropMonitor.minted)
            .then(results => {
            runResults.minted = results 
            })
            .catch((e) => console.log(e))
        .then(() => {
                updatePayments(dropMonitor.payments)
                .then(results => {
                    runResults.payments = results 
                })
                .catch((e) => console.log(e))
            })
            .catch((e) => console.log(e))
        .then(() => {
                updateSent(dropMonitor.sent)
                .then(results => {
                    runResults.sent = results 
                })
                .catch((e) => console.log(e))
            })
            .catch((e) => console.log(e))
        })
        .catch((e) => console.log(e))

}

let monitor = (interval) => {
    console.log('listening for on chain updates at ', interval, ' second intervals...')
    setInterval(run, interval*1000)
}

monitor(15)


