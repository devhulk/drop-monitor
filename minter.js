const { default: axios } = require("axios")
import options from "./src/options"
import nft from './test/nft.json'

let getRandomNFT = JSON.parse(nft)

let metadata = getRandomNFT
let baseConfig = options("testTwo", metadata)
console.log(baseConfig)

let mint = (data) => {
    let promise = new Promise((resolve, reject) => {
        axios.post('http://localhost:3572/v1/cardano/mint/asset', JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
        .then((response) => {
            resolve(response.data)
        })
        .catch(e => reject(e))
    })

    return promise
    
}
        

mint(baseConfig)
.then((response) => {
    console.log(response)
})
.catch(e => console.log(e))
