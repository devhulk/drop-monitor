const { default: axios } = require("axios")
import options from "./src/options"

let metadata = {
            asset_id: "anotherNFT1",
            asset_name: "NFT",
            ipfsLink: "ipfs://test",
            amount: "1",
            traits: []
        }
        
let request = JSON.stringify(options("testTwo", metadata))
console.log(request)

getRandomPugly = () => {
    let promise = new Promise((resolve, reject) => {


    })

    return promise
}
