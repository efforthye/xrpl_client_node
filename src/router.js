const express = require('express');
const xrpl = require('xrpl');

const router = express.Router();

// XRPL 클라이언트 초기화
const xrplClient = new xrpl.Client(process?.env?.XRPL_TEST_NETWORK);

router.post('/create/key', async (req, res) => {
    try {
        const wallet = await generateWallet(xrplClient); // 지갑 생성 함수 호출
        const {publicKey, privateKey, classicAddress, seed} = wallet;
        console.log({publicKey, privateKey, classicAddress, seed});
        return res.send({publicKey, privateKey, classicAddress, seed});
    } catch (error) {
        console.log(`/api/create/key catch error: ${error}`);
        return res.send(error).status(401);
    }
});

router.post('/create/nft', async (req, res)=>{
    try {
        const {address, seed} = req.body;
        console.log({address, seed});

        const wallet = xrpl.Wallet.fromSeed(seed);

        const tx = await mintNFT(xrplClient, address, wallet);
        console.log({tx});
        return res.send({tx});
    } catch (error) {
        console.log(`/api/create/nft catch error: ${error}`);
        return res.send(error).status(401);
    }
});

router.get('/nfts', async (req, res)=> {
    try {
        const {address} = req.query;
        const nfts = await getNFTs(xrplClient, address);
        return res.send({nfts});
    } catch (error) {
        console.log(`/api/nfts catch error: ${error}`);
        return res.send(error).status(401);
    }
});

module.exports = {
    router, xrplClient
}