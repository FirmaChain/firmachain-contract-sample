import { FirmaSDK, FirmaUtil } from "@firmachain/firma-js";
import { expect } from 'chai';

import { FIRMACHAIN_CONFIG, MNEMONIC } from "./config";

describe('[03. "Bulk Insert" for contract module on FirmaChain]', () => {
  const firma = new FirmaSDK(FIRMACHAIN_CONFIG);

  // Scenario of contract in progress
  it('getUnsignedTxAddContractLog & calc gas & execute', async () => {
    const wallet = await firma.Wallet.fromMnemonic(MNEMONIC);
    const address = await wallet.getAddress();

    const contractHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf");
    const timeStamp = Math.round(+new Date() / 1000);
    const jsonString = JSON.stringify("{}");

    const createContractMsg = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, "createContract", address, jsonString);
    const inviteSignerMsg = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, "inviteSigner", address, jsonString);
    const cancelContractMsg = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, "cancelContract", address, jsonString);
    const destroyContractMsg = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, "destroyContract", address, jsonString);
    const messages = [createContractMsg, inviteSignerMsg, cancelContractMsg, destroyContractMsg];

    const gasEstimation = await firma.Contract.getGasEstimationSignAndBroadcast(wallet, messages);
    const txMisc = { gas: gasEstimation, fee: Math.ceil(gasEstimation * 0.1) };
    
		const txResult = await firma.Contract.signAndBroadcast(wallet, messages, txMisc);
    expect(txResult.code).to.be.equal(0);
  });

  // Same Contract Simultaneous Transfer Scenario
  it('getUnsignedTxCreateContractFile & calc gas & execute', async () => {
    const wallet = await firma.Wallet.fromMnemonic(MNEMONIC);
    const address = await wallet.getAddress();

    const signer1_Address = "firma1nssuz67am2uwc2hjgvphg0fmj3k9l6cx65ux9u";
    const signer2_Address = "firma134pp6s2nv7pl4mxu58aeufdd6fv5s2zujrrmsa";
    const signer3_Address = "firma1epg9kx7nqz32dykj23p6jreqfh5x0wdy5a43qc";

    const timeStamp = Math.round(+new Date() / 1000);
    const fileHash1 = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf") + timeStamp;
    const fileHash2 = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf") + (timeStamp + 1);
    const fileHash3 = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf") + (timeStamp + 2);
    const metaDataJsonString = JSON.stringify("{}");
    
    const signer1 = await firma.Contract.getUnsignedTxCreateContractFile(wallet, fileHash1, timeStamp, [address, signer1_Address], metaDataJsonString);
    const signer2 = await firma.Contract.getUnsignedTxCreateContractFile(wallet, fileHash2, timeStamp, [address, signer2_Address], metaDataJsonString);
    const signer3 = await firma.Contract.getUnsignedTxCreateContractFile(wallet, fileHash3, timeStamp, [address, signer3_Address], metaDataJsonString);
    const messages = [signer1, signer2, signer3];
    
    const gasEstimation = await firma.Contract.getGasEstimationSignAndBroadcast(wallet, messages);
    const txMisc = { gas: gasEstimation, fee: Math.ceil(gasEstimation * 0.1) };
    
		const txResult = await firma.Contract.signAndBroadcast(wallet, messages, txMisc);
    expect(txResult.code).to.be.equal(0);
  });
});