const { default: axios } = require("axios")
import { response } from "express"
import options from "./options"
import send from '../test/send.json'
import metadata from '../test/nft.json'
require('dotenv').config()
let walletName = process.env.WALLET_NAME

let payment = send.payment
let mint = send.mint

let request = options(walletName, metadata, payment, mint)
console.log(request)

let sendNFT = (data) => {
    let promise = new Promise((resolve, reject) => {
        axios.post('http://localhost:3572/v1/cardano/mint/sendAsset', data, {headers: {'Content-Type': 'application/json'}})
        .then((response) => {
            resolve(response.data)
        })
        .catch(e => reject(e))
    })

    return promise
}

sendNFT(request)
.then((response) => {
    console.log(response)
})
.catch(e => console.log(e))
        


