const xrpl = require('xrpl');

// 지갑 생성
async function generateWallet(client) {
    try {
        await client.connect();

        // 랜덤한 새로운 지갑 생성
        const wallet = xrpl.Wallet.generate();
        console.log({wallet});

        // 테스트넷 XRP로 자금 조달
        const fund_result = await client.fundWallet(wallet);
        console.log('테스트 계정에 자금 조달 완료:', fund_result);

        console.log("지갑이 성공적으로 생성되었습니다!");
        console.log("주소: ", wallet.address);
        console.log("시드(Seed): ", wallet.seed);
        console.log("비밀키(Private Key): ", wallet.privateKey);
        console.log("공개키(Public Key): ", wallet.publicKey);

        await client.disconnect(); 
        
        return wallet;
    } catch (error) {
        console.log(`오류 발생: ${error}`);        
    }
}

const createNFTMetaData = () => {
    
}

// NFT 생성
async function mintNFT(client, address, wallet) {
    try {
        console.log({client, address, wallet});

        await client.connect();

        // NFTokenMint 트랜잭션 준비
        const transactionBlob = {
            TransactionType: 'NFTokenMint',
            Account: address,
            NFTokenTaxon: 0,  // NFT의 분류 (0은 기본값)
            Flags: 8,  // 발행자가 자신에게 발행 (2 = 모든 사람에게 발행 가능)
            URI: xrpl.convertStringToHex('https://example.com/nft-metadata.json') // NFT 메타데이터 URI
        };
        
        // 트랜잭션 서명 및 제출
        const tx = await client.submitAndWait(transactionBlob, { wallet });
        console.log('NFT 생성 트랜잭션 결과:', tx);

        await client.disconnect(); 

        return tx;
    } catch (error) {
        console.log(`오류 발생: ${error}`);  
    }
}


async function getNFTs(client, address) {
    try {
        await client.connect(); // 클라이언트 연결 확인
        console.log('XRP Ledger에 연결되었습니다.');

        // account_nfts 메서드를 사용하여 계정의 NFT 목록을 가져옴
        const nfts = await client.request({
            command: 'account_nfts',
            account: address,
        });

        await client.disconnect(); // 작업 완료 후 클라이언트 연결 해제

        console.log(`${address} 계정의 NFT 목록:`, nfts.result.account_nfts);
        return nfts.result.account_nfts;
    } catch (error) {
        console.log(`오류 발생: ${error}`);
    }
}
  

module.exports = {
    generateWallet, mintNFT, getNFTs
}