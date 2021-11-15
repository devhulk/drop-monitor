require('dotenv').config()

let options = (walletName = "testOne", metadata = {}, payment = {}, mint = {}) => {
    let config = {
        address : process.env.TEST_MINT_WALLET,
        mintWalletAddr : process.env.TEST_MINT_WALLET,
        walletName : walletName,
        config: process.env.NODE_CONFIG,
        metadata,
        mint,
        payment
    }

    console.log(config)
    return config     

}

export default options
