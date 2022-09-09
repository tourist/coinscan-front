[![CircleCI](https://img.shields.io/circleci/build/github/tourist/coinscan-front/dev)](https://app.circleci.com/pipelines/github/tourist/coinscan-front)
[![codecov](https://codecov.io/gh/tourist/coinscan-front/branch/dev/graph/badge.svg)](https://codecov.io/gh/tourist/coinscan-front)


# Coinscan-front

**Coinscan-front** is frontend for [The Graph based backend](https://github.com/tourist/coinscan-champ "The Graph based backend") visualization of chosen contract token transfers flow on the blockchain. Think etherscan.io focused on single token with additional indicators.

You can deploy your own version both backend and frontend to track your choosen coin.

## Table of contents:
- [Inspiration](#inspiration)
- [Main features](#main-features)
- [Installation and customization](#installation-and-customization)
  - [1. Fork the repository](#1-fork-the-repository)
  - [2. Customize settings for your token](#2-customize-settings-for-your-token)
  - [3. Configure CI/CD (optional - for development)](#3-configure-cicd-optional---for-development)
  - [4. Configure Vercel hosting](#4-configure-vercel-hosting)
  - [5. Hosting outside Vercel](#5-hosting-outside-vercel)
- [Development](#development)
- [Limitations](#limitations)
- [LICENSE](#license)

## Inspiration

Using blockchain scanners like etherscan/polygonscan can give a bit of overview on wallet state/wallet's interactions but it's hard to extract more information about single token related transactions if wallet has other tokens or does a lot of transactions. By tracking single token in the specialized interface focused on wallet inflow/outflows we can identify better transfers happening around single contract and identify transfers that matter e.g. for keeping project transparent, speculate, check if tokenomics are correctly implemented.

## Main features



- Holders count history (per day/week/month)
- Top wallets list with indicators of latest inflow/outflow.
- Wallet netflow per day - quickly identify wallet transactions inflow/outflow.
- Wallet transactions filtered around single token (tracking single contract)
- Transaction impact indication via visual cue ("hottness") to quickly identify transactions that are important (big amount transfered)
- Total balance change since (1/7/30 days) as percentage change.
- Mark addresses as known and give them more human readable names.


*Example wallet details page*
![transactions](https://user-images.githubusercontent.com/356700/189219062-cb7eafb2-fb6d-44c8-80c7-569ec1d9f435.png)


*Example fragment of wallets list*
![wallets-indicators](https://user-images.githubusercontent.com/356700/189219860-61516ead-8167-444d-aa6f-5f45871eb93a.png)


## Installation and customization

If you want to track your custom token follow steps below.
This guide assumes backend for your token was already deployed on [The Graph](https://thegraph.com/en/) hosted service.

For backend installation steps refer to [backend repo](https://github.com/tourist/coinscan-champ "backend repo") (work in progress)

### 1. Fork the repository

### 2. Customize settings for your token

Settings for your token are available in [settings.json](settings.json).

Available settings:
- `tokenName` - used for title of the site
- `tokenTicker` - used for title of the site
- `totalSupply` - total supply of token without decimal places
- `decimalPlaces` - number of decimal places used by contract
- `graphqlUri` - address of graphql deployed for token on The Graph.
- `addresses` - list of identified addresses that you can name for human readable name on wallets/transaction lists
- `scannerAddressLink`: link to which interface will apend address of the wallet for links to external scanners (https://etherscan.io/, https://polygonscan.com/ etc.)
- `scannerTxnLink` - link to which interface will apend transaction hash for links to external scanners
- `globalHtmlTitleSuffix` - text used for suffix of meta title/description tags in HTML
 
> For `scannerAddressLink` and `scannerTxnLink` settings `/` is not added before appending address/txn so link in settings should contain it at the end if applicable to scanner site for example: `https://polygonscan.com/tx/` not `https://polygonscan.com/tx`)


### 3. Configure CI/CD (optional - for development)

Project uses CircleCi for running tests and deployment and Codecov for test coverage raports. You can omit this step and deploy for default usage without it by following steps in [configure Vercel hosting](#4-configure-vercel-hosting) or [hosting outside vercel](#5-hosting-outside-vercel) sections.

Configuring CI/CD is simple as following the basic guides for seting up github project for usage in [CircleCi](https://circleci.com/docs/github-integration "CircleCi") and [Codecov](https://docs.codecov.com/docs/quick-start "Codecov")

Additional step is needed for CircleCi. When you create project on CircleCi you need to  [configure environment variables](https://circleci.com/docs/env-vars#setting-an-environment-variable-in-a-project "configure environment variables") for Vercel automatic deployment on successful build.

- `VERCEL_ORG_ID`- found in Vercel account settings as `Your ID`
- `VERCEL_PROJECT_ID` - found in Vercel project's settings page
- `VERCEL_SCOPE` - for simple user that is a user's account name - Vercel account settings > General
- `VERCEL_TOKEN` - token found in Vercel account settings > Tokens

You can review CI/CD flow inside [.circleci/config.yml](.circleci/config.yml).


### 4. Configure Vercel hosting

Add forked repo as [vercel project](https://vercel.com/new "vercel project"). For details about vercel deployment refer to [docs](https://vercel.com/docs/concepts/projects/overview "docs")

Default automatic deploy on push on Vercel is disabled by default because of using CircleCi to deploy only on successful test passing.
You can bypass that behavior and use automatic deploys on push by:
1. deleting [vercel.json](vercel.json) from main directory
2. or by enabling GitHub integration by changing `github` settings inside the file to `true`

For details of this configuration setting check out [vercel docs](https://vercel.com/docs/project-configuration#git-configuration/github-enabled "vercel docs").


### 5. Hosting outside Vercel

For hosting outside vercel follow guide in [Next.js self-hosting docs](https://nextjs.org/docs/deployment#self-hosting "nextjs docs")

> If you use custom hosting you need to apply changes to CircleCi config to work with new deployment environment


## Development

Project is based on Next.js so all things from their [docs](https://nextjs.org/docs/getting-started) apply when you want to extend functionality e.g. create new sub-pages.

To check project locally:

`npm install` to install dependencies

`npm run dev` to run site on `localhost:3000`

Available npm scripts.

- `npm run dev` - development server
- `npm run build` - build project for deployment
- `npm run start` - run node.js server to host site / check build locally
- `npm run test` - run tests in watch mode while developing
- `npm run test:ci` - run tests as on CI (without watch mode) + generate junit coverage report.
- `npm run codegen`- runs codegen introspection on graphql endpoint to generate Typescript types based on available endpoints

> For types generation via codegen you need to point to your backend version in [codegen.yml](codegen.yml)


## Limitations

Coinscan suppose to be generic so you can handle broad spectrum of tokens. That means it handles only simple transfers event. Because of that generic nature there are some limitiations:

- Some contracts might have vesting implemented and tokens are generated during life of project - not full total supply is available at time. UX depends on total supply for calculations of e.g. percentage of total supply for wallets. Percentage is calculated based on end total supply. Relatively it does not matter for analyzing flows of tokens for most projects though.
- Issue with initial transaction causing 0x000....000 address to be top holder (in-progress backend issue)
- Project currently is limited to tracking one contract on single blockchain.
- Special features of tokens might need special implementation on both backend and frontend for better UX. For example transaction fee being burned might be tracked as separate transfer event despite being part of transaction entity in backend and would be displayed as separate transactions on frontend.

## LICENSE

[MIT](LICENSE)
