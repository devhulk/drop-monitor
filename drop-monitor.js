const { default: axios } = require("axios")
const { response } = require("express")
const { default: options } = require("./src/options")
require('dotenv').config()
let walletName = process.env.WALLET_NAME

let metadata = {
            asset_id: "anotherNFT1",
            asset_name: "NFT",
            ipfsLink: "ipfs://test",
            amount: "1",
            traits: []
        }

        
let request = JSON.stringify(options(walletName, metadata))

const convert = (from, to) => str => Buffer.from(str, from).toString(to)
const utf8ToHex = convert('utf8', 'hex')
const hexToUtf8 = convert('hex', 'utf8')

let sent = []
let minted = []
let paymentsReceived = []
let validUTXOs = []

let dropMonitor = {} 

let getCurrentUTXOs = axios.post('http://localhost:3572/v1/cardano/address/utxos', request,{ headers: {'Content-Type': 'application/json'}})
                .then(response => {
                    console.log(response.data)
                    // const txs = JSON.parse(response.data)
                    // let myTXs = txs.map((utxo) => {
                    //     if (utxo.amount.length >= 2) {
                    //         let address = utxo.address
                    //         let customerAddress = utxo.inputAddress
                    //         let txInput = utxo.amount[1]
                    //         let txHash = utxo["txHash"]
                    //         let txOutput = utxo.amount[utxo.output_index]
                    //         let txix = `${txHash}#${utxo.output_index}` 
                    //         let policyID = txInput.unit.substring(0, 56)
                    //         let tokenNameHex = txInput.unit.substring(56)
                    //         let tokenName = hexToUtf8(tokenNameHex)
                    //         let unspent = {output: txOutput.quantity, txix} 

                    //         let mint =  {address, inputAddress: customerAddress, recieved : txInput, unspent, policyID, tokenName, sentStatus: ""}
                    //         mint["_id"] = txHash

                    //         if (address != utxo.inputAddress) {
                    //             mint.sentStatus = true
                    //             sent.push(mint)
                    //         } else {
                    //             mint.sentStatus = false
                    //             minted.push(mint)
                    //         }
                    //         return mint

                    //     } else {

                    //         let address = utxo.address
                    //         let txHash = utxo["txHash"]
                    //         let txInput = utxo.amount[0]
                    //         let txix = `${txHash}#${utxo.output_index}` 
                    //         let customerAddress = utxo.inputAddress
                    //         let payment = txInput.quantity / 1000000
                    //         let txOutput = utxo.amount[utxo.output_index]
                    //         let unspent = {output: txOutput.quantity, txix} 

                    //         if (payment >= 20) {
                    //             let validPayment = {txHash, customerAddress, payment, recievingAddress: utxo.address, lovelace: txInput.quantity, txix, unspent}
                    //             validPayment["_id"] = txHash
                    //             paymentsReceived.push(validPayment)
                    //             return validPayment

                    //         } else {
                    //             let invalidPayment = {txHash, address, customerAddress, status: "Payment below 20ADA", unspent}
                    //             invalidPayment["_id"] = txHash
                    //             validUTXOs.push(invalidPayment) 
                    //             return invalidPayment 
                    //         }
                    //     } 
                    // })
                    // dropMonitor.payments = paymentsReceived 
                    // dropMonitor.minted =  minted
                    // dropMonitor.sent =  sent
                    // dropMonitor.validUTXOs = sent
                    // return myTXs
                     return response.data
                })
                .catch(function (error) {
                    if (error.response) {
                      // The request was made and the server responded with a status code
                      // that falls out of the range of 2xx
                      reject(error.response)
                    }
                  });



let updateMinted = (minted) => {
    let promise = new Promise((resolve, reject) => {
    axios.post('http://localhost:3572/v1/cardano/minted', JSON.stringify(minted),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            resolve(response.data)
        })
        .catch(e => reject(e))
    })

    return promise
}

let updatePayments = (payments) => {
    let promise = new Promise((resolve, reject) => {
    axios.post('http://localhost:3572/v1/cardano/payments', JSON.stringify(payments),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            resolve(response.data)
        })
        .catch(e => reject(e))
    })

    return promise

}

let updateSent = (sent) => {
    let promise = new Promise((resolve, reject) => {
    axios.post('http://localhost:3572/v1/cardano/orders/sent', JSON.stringify(sent),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            resolve(response.data)
        })
        .catch(e => reject(e))
    })

    return promise

}

let updateUTXOS = (sent) => {
    let promise = new Promise((resolve, reject) => {
    axios.post('http://localhost:3572/v1/cardano/utxos/unused', JSON.stringify(sent),{ headers: {'Content-Type': 'application/json'}})
        .then(response => {
            resolve(response.data)
        })
        .catch(e => reject(e))
    })

    return promise

}

const run = () => {
    
    getCurrentUTXOs
        .then((utxos) => {
            console.log(JSON.parse(utxos))
        //         updatePayments(dropMonitor.payments)
        //         .then(results => {
        //             runResults.payments = results 
        //         })
        //         .catch((e) => console.log(e))
        // .then(() => {
        //         updateMinted(dropMonitor.minted)
        //         .then(results => {
        //         runResults.minted = results 
        //         })
        //         .catch((e) => console.log(e))
        //     })
        //     .catch((e) => console.log(e))
        // .then(() => {
        //         updateSent(dropMonitor.sent)
        //         .then(results => {
        //             runResults.sent = results 
        //         })
        //         .catch((e) => console.log(e))
        //     })
        //     .catch((e) => console.log(e))
        })
        .catch((e) => e)
        // console.log(runResults)

}

let monitor = () => {
    run()
    // console.log('listening for on chain updates at ', interval, ' second intervals...')
    // setInterval(run, interval*1000)
}

monitor()

// monitor(15)


