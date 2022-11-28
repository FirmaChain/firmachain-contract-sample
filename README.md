# firmachain-contract-sample

![image](https://user-images.githubusercontent.com/93503020/204201541-74318d20-55ee-472b-8f7f-871d442734de.png)

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
