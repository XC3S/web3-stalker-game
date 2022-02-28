# Get it started

install dependencies (check .nvmrc for the recommended node version)
```
npm install
```

start a local development blockchain
```
npx hardhat node
```

deploy the contract to your dev-blockchain
```
npx hardhat run scripts/deploy.js --network localhost
```

start the frontend
```
npm start
```

also connect one of the tests accouts with your metamask wallet

# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/deploy.js
npx hardhat help
```
