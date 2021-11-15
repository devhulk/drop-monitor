require('dotenv').config()

let options = (walletName = "testOne", metadata = {}, payment = {}, mint = {}) => {
    return {
        address : process.env.TEST_MINT_WALLET,
        mintWalletAddr : process.env.TEST_MINT_WALLET,
        walletName : walletName,
        config: process.env.NODE_CONFIG,
        metadata,
        mint,
        payment
    }

}

export default options
