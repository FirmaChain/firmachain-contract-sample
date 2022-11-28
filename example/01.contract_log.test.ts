import { FirmaSDK, FirmaUtil } from "@firmachain/firma-js";
import { expect } from 'chai';

import { FIRMACHAIN_CONFIG, MNEMONIC } from "./config";

describe('[01. "Log" for contract module on FirmaChain]', () => {
  const firma = new FirmaSDK(FIRMACHAIN_CONFIG);
  let logId = "";

  it('addContractLog - use default gas', async () => {
    const wallet = await firma.Wallet.fromMnemonic(MNEMONIC);
    const address = await wallet.getAddress();

		const timeStamp = Math.round(+new Date() / 1000);
    const fileHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf") + timeStamp;
    const jsonData = {
      Encryption: { type: "JWT", alg: "HS256" },
      storage: { type: "ipfs", link: "download link" },
      contracts: [{
          target: "contractor1", email: "contractor1@gmail.com"
      }]
    }
    const jsonString = JSON.stringify(jsonData);

    const txResult = await firma.Contract.addContractLog(wallet, fileHash, timeStamp, "createContract", address, jsonString);
    expect(txResult.code).to.be.equal(0);
  });

  it('addContractLog - use calc gas', async () => {
    const wallet = await firma.Wallet.fromMnemonic(MNEMONIC);
    const address = await wallet.getAddress();

		const timeStamp = Math.round(+new Date() / 1000);
    const fileHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf") + timeStamp;
    const jsonString = JSON.stringify("{}");

    const gasEstimation = await firma.Contract.getGasEstimationAddContractLog(wallet, fileHash, timeStamp, "createContract", address, jsonString);
    const txMisc = { gas: gasEstimation, fee: Math.ceil(gasEstimation * 0.1) };
    const txResult = await firma.Contract.addContractLog(wallet, fileHash, timeStamp, "createContract", address, jsonString, txMisc);
    expect(txResult.code).to.be.equal(0);

    const contractList = await firma.Contract.getContractListFromHash(fileHash);
    logId = (contractList[contractList.length - 1]).toString();
  });

  it('getContractLog', async () => {
    // The default value for logId is 0. 'addContractLog - use calc gas' test is required to set logId.
    const singleContractLog = await firma.Contract.getContractLog(logId);
    expect(singleContractLog.id).to.be.equal(logId);
  });

  it.skip('getContractLogAll', async () => {
    const allContractLog = await firma.Contract.getContractLogAll();
    const totalCount = allContractLog.pagination.total;
    
    let contractDataList = allContractLog.dataList;
    let paginationKey = allContractLog.pagination.next_key;

    // Due to the large amount of logs recorded in the chain, there is a delay, so it is annotated.
    /*
    while (paginationKey !== null) {
      const nextContractLog = await firma.Contract.getContractLogAll(paginationKey);
      contractDataList.push(...nextContractLog.dataList);
      paginationKey = nextContractLog.pagination.next_key;
    }

    expect(contractDataList.length).to.be.equal(totalCount);
    */
  });

  it('getContractListFromHash', async () => {
    const contractHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.png");
    const contractList = await firma.Contract.getContractListFromHash(contractHash);

    // Check the log recorded in the hash.
    for (let i = 0; i < contractList.length; i++) {
      const currentLogId = contractList[i];

      try {
        const singleContractLog = await firma.Contract.getContractLog(currentLogId);
        
      } catch (e) {
        // 400 errors occur if the file hash is not in the chain.
        // console.log(e);
      }
    }
  });
});