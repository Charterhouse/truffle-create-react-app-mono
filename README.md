# truffle-create-react-app-mono

This is a starter project based on [truffle-create-react-app](https://github.com/Charterhouse/truffle-create-react-app) for monorepos. The truffle-related assets
are now in the `truffle` directory, while the frontend app is on the top-level.

## Installation

```bash
$ yarn && (cd truffle && yarn)
```

## Creating local Ethereum network

From the terminal run:

```bash
$ cd truffle
$ yarn ganache-cli --account="0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3,10000000000000000000000" -p 8545
```

This will give you a running network, with sufficient ether (should be something around 10000).

Now lets deploy our contracts to the network. We will use `truffle console` instead of `truffle develop` because we already have network, we just want to deploy to it:

```bash
» cd truffle
» yarn truffle console
truffle(development)> migrate
Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x64e787312560e805ff4ce54b8859ce1c5d7f1d6c42e91a2988d51a8a6661b209
  Migrations: 0xf12b5dd4ead5f743c6baa640b0216200e89b60da
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying SimpleStorage...
  ... 0x12d977bd2a66476eec91c66c825a768748d659d584a867dceddefb111368c706
  SimpleStorage: 0x345ca3e014aaf5dca488057592ee47305d9b3e10
Saving artifacts...
truffle(development)>
```

## Running the front-end app

```bash
# Serves the front-end on http://localhost:3000
yarn start
```

## Running the tests

Truffle can run tests written in Solidity or JavaScript against your smart contracts. Here we use the latter approach.

```bash
# If inside the development console - use `yarn truffe develop` not `yarn truffle console`
migrate
test

# If outside the development console.
cd truffle
yarn test
```

To run the web-app tests:

```bash
# Change directory to the front-end folder
yarn test               # for watch mode
CI=TRUE yarn test       # for non-watch mode
```

## Project files

### src/App

`App` is where the actual navigation happens and where we load Web3.
In the `render` prop provided to `Web3` component, we check if `web3`, `accounts`, and `contract` are already loaded and if so, we perform the appropriate navigation depending on the current path.

### src/pages

This folder contains the pages having their own url. The name of each sub-directory corresponds to a separate route.

We use [react-router](https://reacttraining.com/react-router/web/) for routing.

#### home/Home.js

Initial home page corresponding to the `/` url.

#### accounts/Accounts.js

This is a page listing the accounts returned from Web3. The `Accounts` component is stateless and expects `location` object from the `Router` and `accounts` from Web3. Both are injected in `App.js` component.

#### dapp/DApp.js

The `DApp` components makes calls to the `contract` given in one of the props provided by `Web3` component.

### src/components

Components hold some shared presentational components that support navigation and a bit of styling. We wanted to avoid imposing any specific framework so at least we could remove some noise coming from styling issues by giving it their own abstractions.

We encourage you to try [glamorous](https://github.com/paypal/glamorous) for handling styling in React.

#### web3

Here, in the `Web3.js` file, we define our `Web3` component that follows *render props* pattern. As we can see, the `render` prop function receives an object with three attributes: `web3`, `accounts`, and `contract`.

#### navigation

Components used to render a small navigation menu on every page.

#### wrapper

A `Wrapper` components to provide uniform top-level positioning for each page.

### src/services/web3

`web3` provides utilities and a HOC to inject `web3` instance, `accounts`, and a `contract` as props.

#### getWeb3.js

This is a function for actually getting the Web3 object. [ToDo: explain web3 injection and the relevant .env file contents]

#### utils.js

The functions `getAccounts` and `getContractInstance` are placed in this file, and their purpose is simply explained by their respective names. Both of these functions require `web3` to be passed in and will resolve asynchronously.

If you want to get multiple contract instances, you may want to add an additional function based off of `getContractInstance`.

### src/contracts

A symlink to `../truffle/build/contracts` located in the Truffle project is placed here so that the React app can refer to the build artifacts from the Truffle project.

### .env

This file contains environment variables.

| ENV  | default value  | description |
|------|----------------|-------------|
| BROWSER | `google chrome` | the browser to be used by CRA |
| NODE_PATH | `src/`  | Default import path. It will let us to use import paths |
| REACT_APP_USE_INJECTED_WEB3 | `NO` | If set to `NO` the `web3` instance potentially injected in the browser (like _MetaMask_)will be ignored. Set it to `YES` to use `web3` object that was injected. |
| REACT_APP_WEB3_PROVIDER_URL | `http://localhost:8545` | The local provider URL. Relevant only when `REACT_APP_USE_INJECTED_WEB3` is set to `NO`. This is the default provider URL used by truffle development console. |
| REACT_APP_WEB3_PROVIDER_URL_PRODUCTION | `http://localhost:8545` | provider URL for the production - should point to a deployed Ethereum node |

Right out of the box, the app supports working with develop ethereum network. You can change this by modifying the `REACT_APP_WEB3_PROVIDER_URL` variable. If the `REACT_APP_WEB3_PROVIDER_URL` is not defined, the default `http://localhost:8545` will be used. The value of `REACT_APP_WEB3_PROVIDER_URL` will also be used in production. If you want to use different url for local development and for production (and still in both cases be different from `http://localhost:8545`), then you can use `REACT_APP_WEB3_PROVIDER_URL_PRODUCTION`. In case both `REACT_APP_WEB3_PROVIDER_URL` and `REACT_APP_WEB3_PROVIDER_URL_PRODUCTION` are missing then `http://localhost:8545` will be used for both development and production.

## conventions

We promote using named exports rather than default export. For a reasoning you may check out [Why we have banned default exports in Javascript and you should do the same](https://blog.neufund.org/why-we-have-banned-default-exports-and-you-should-do-the-same-d51fdc2cf2ad).

Then to make module imports more communicative, and to improve encapsulation, we use `index.js` file in every folder. This file might be considered a public API for your component.

You may also consider using a `package.json` file instead `index.js`. We found `index.js` to be slightly more flexible for that purpose.

Such a `package.json` would contain only one attribute pointing out to the main file in your component, e.g.:

```json
{
  "main": "Accounts.js"
}
```
