const express = require('express');
const axios = require('axios');
const ethers = require('ethers');
const { AxelarAssetTransfer, AxelarQueryAPI, Environment } = require("@axelar-network/axelarjs-sdk");

const { createPublicClient, http } = require("viem");
const { polygonZkEvmCardona } = require("viem/chains");

require('dotenv').config();
const { generateWallet, mintNFT, getNFTs } = require('./wallet');
const { router } = require('./router');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000; // 서버가 실행될 포트 번호

app.use('/api', router);

// Axelar SDK 초기화
const axelarAssetTransfer = new AxelarAssetTransfer({
    environment: Environment.TESTNET,
    auth: "local",
});
// Polygon(Mumbai) 테스트넷 프로바이더 초기화
const provider = new ethers.JsonRpcProvider(process.env.EVM_RPC_URL);

const alchemyClient = createPublicClient({
    chain: polygonZkEvmCardona,
    transport: http(process.env.ALCHEMY_API_URL),
});

async function checkBlock() {
    try {
      // 특정 블록 번호(123456n)의 블록 정보를 가져옴
      const block = await alchemyClient.getBlock({
        blockNumber: 123456n,
      });
      // 블록 정보를 콘솔에 출력
      console.log(block);
    } catch (error) {
      console.error("Error fetching block:", error);
    }
}

// 서버 실행
app.listen(port, async() => {
    console.log('XRP Ledger에 연결되었습니다.');
    checkBlock();
    console.log(`Server is running on http://localhost:${port}`);
});
