import { FirmaSDK, FirmaUtil } from "@firmachain/firma-js";
import { expect } from 'chai';

import { FIRMACHAIN_CONFIG, MNEMONIC } from "./config";

describe('[02. "File" for contract module on FirmaChain]', () => {
  const firma = new FirmaSDK(FIRMACHAIN_CONFIG);

  it('createContractFile - use default gas', async () => {
    const wallet = await firma.Wallet.fromMnemonic(MNEMONIC);
    const address = await wallet.getAddress();

    const timeStamp = Math.round(+new Date() / 1000);
    const fileHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf") + timeStamp;

    // Lets you add a user's wallet address associated with the contract.
    const ownerList = [address];

    const ipfsHash = await firma.Ipfs.addFile("./example/sample/contract_sample.pdf");
		const encryptHash = wallet.encryptData(ipfsHash);
    const jsonData = { storage: "ipfs", encryptIpfsHash: [encryptHash] };
    const metaDataJsonString = JSON.stringify(jsonData);

    const txResult = await firma.Contract.createContractFile(wallet, fileHash, timeStamp, ownerList, metaDataJsonString);
    expect(txResult.code).to.be.equal(0);
  });

  it('createContractFile - use calc gas', async () => {
    const wallet = await firma.Wallet.fromMnemonic(MNEMONIC);
    const address = await wallet.getAddress();

    const timeStamp = Math.round(+new Date() / 1000);
    const fileHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf") + timeStamp;

    // Lets you add a user's wallet address associated with the contract.
    const ownerList = [address];

    const ipfsHash = await firma.Ipfs.addFile("./example/sample/contract_sample.pdf");
		const encryptHash = wallet.encryptData(ipfsHash);
    const jsonData = { storage: "ipfs", encryptIpfsHash: [encryptHash] };
    const metaDataJsonString = JSON.stringify(jsonData);

    const gasEstimation = await firma.Contract.getGasEstimationCreateContractFile(wallet, fileHash, timeStamp, ownerList, metaDataJsonString);
    const txMisc = { gas: gasEstimation, fee: Math.ceil(gasEstimation * 0.1) };
    const txResult = await firma.Contract.createContractFile(wallet, fileHash, timeStamp, ownerList, metaDataJsonString, txMisc);
    expect(txResult.code).to.be.equal(0);
  });

  it('getContractFile', async () => {
    const fileHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf");
    const contractFile = await firma.Contract.getContractFile(fileHash);
    expect(contractFile.fileHash).to.be.equal(fileHash);
  });

  it.skip('getContractFileAll', async () => {
    const allContractFile = await firma.Contract.getContractFileAll();
    const totalCount = allContractFile.pagination.total;

    let contractDataList = allContractFile.dataList;
    let paginationKey = allContractFile.pagination.next_key;
    
    // Due to the large amount of logs recorded in the chain, there is a delay, so it is annotated.
    /*
    while (paginationKey !== null) {
      const nextContractFile = await firma.Contract.getContractFileAll(paginationKey);
      contractDataList.push(...nextContractFile.dataList);
      paginationKey = nextContractFile.pagination.next_key;
    }

    expect(contractDataList.length).to.be.equal(totalCount);
    */
  })
});