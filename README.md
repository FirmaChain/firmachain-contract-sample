# firmachain-contract-sample

This project is a sample of the "Contract" module among the "FirmaChain" modules.
Examples are based on "TypeScript" & "JavaScript".

</br>

# How to build
## 1. Install
```bash
# Module Installation
npm install
```

</br>

## 2. Set config
### Create "config.ts" file.
```bash
cp config.sample.ts config.ts
```

### Set config variable
```bash
vim config.json

# Select the ecosystem of the Fermachine on which you want to run the sample.
# ex) Mainnet - FirmaConfig.MainnetConfig
# Testnet - FirmaConfig.TestNetConfig
# Devnet - FirmaConfig.DevNetConfig
export const ChainConfig = FirmaConfig.TestNetConfig;

# Enter the mnemonic of the wallet you have the fct.
export const Mnemonic = "ozone burst ... address";
```

</br>

## 3. Run test
```
npm test
```