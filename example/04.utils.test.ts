import { FirmaSDK, FirmaUtil } from "@firmachain/firma-js";
import { expect } from 'chai';
import * as fs from 'fs';

import { FIRMACHAIN_CONFIG, MNEMONIC } from "./config";

/*
  Only Util sample code can be executed or omitted.
  default set to "describe('[04. Util for contract module]'..."

  1. Omitted
    describe.skip('[04. Util for contract module]'
  2. Only
    describe.only('[04. Util for contract module]'
*/
describe('[04. "Util" for contract module]', () => {
  const firma = new FirmaSDK(FIRMACHAIN_CONFIG);
  const sampleContractPDFHash = "da39330a6dfd90a91563603950f742240fa222580beecf36e141fe6410184e8b";
  const sampleContractPNGHash = "8435d9eafb94357fcad218fdcc48f0e5a57999f00fa17d449169366b9c78cecb";
  const sampleContractJSONHash = "596d5da5e2530cf590c3aa3ff40441ada4d3baa991d9d82ef8197429fd6ea590";
  const sampleTextHash = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";

  it('getFileHash', async () => {
    // use pdf
    const pdfFileHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.pdf");
    expect(pdfFileHash).to.be.equal(sampleContractPDFHash);

    // use png
    const pngFileHash = await FirmaUtil.getFileHash("./example/sample/contract_sample.png");
    expect(pngFileHash).to.be.equal(sampleContractPNGHash);
  });

  it('getFileHashFromBuffer', async () => {
    // just text
    const sampleText = "hello world";
    const buffer = new TextEncoder().encode(sampleText);
    const textHash = FirmaUtil.getFileHashFromBuffer(buffer);
    expect(textHash).to.be.equal(sampleTextHash);

    // json file
    const sampleJsonFile = fs.readFileSync("./example/sample/contract_sample.json");
    const jsonFileHash = FirmaUtil.getFileHashFromBuffer(sampleJsonFile);
    expect(jsonFileHash).to.be.equal(sampleContractJSONHash);
  });

  it('isContractOwner', async () => {
    const wallet = await firma.Wallet.fromMnemonic(MNEMONIC);
    const address = await wallet.getAddress();

    try {
      const isOwner = await firma.Contract.isContractOwner(sampleContractPDFHash, address);
      expect(isOwner).to.be.equal(true);
    } catch (e) {
      // 400 errors occur if the file hash is not in the chain.
      // console.log(e);
    }
  });
});