const { default: axios } = require("axios")
import options from "./src/options"
import send from './test/send.json'

let payment = send.payment
let mint = send.mint

let request = JSON.stringify(options("testTwo",  payment, mint))

let sendNFT = (request) => {
    let promise = new Promise((resolve, reject) => {
        axios.post('http://localhost:3572/v1/cardano/mint/sendAsset', request, {'Content-Type': 'application/json'})
        .then((response) => {
            let data = JSON.stringify(response.data)
            resolve(data)
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
        


