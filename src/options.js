require('dotenv').config()

let options = (walletName = "testOne", metadata = {}, payment = {}, mint = {}) => {
    let config = {
        address : process.env.MINT_WALLET,
        mintWalletAddr : process.env.MINT_WALLET,
        walletName : walletName,
        config: process.env.NODE_CONFIG,
        metadata,
        mint,
        payment
    }

    return config     

}

export default options
