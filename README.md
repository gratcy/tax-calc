# Tax Calculator
API for Shopee Calculate Tax Order

[![Code Style](https://img.shields.io/badge/code%20style-standard-green.svg)](https://github.com/feross/standard)


[Installation](#installation) |
[API Documentation](#api-documentation) |
[Database Design](#database-design) |
[Production Environment](#production-environment) |
[License](#license)

<p>
  <img src="https://statik.tempo.co/data/2018/05/30/id_708937/708937_720.jpg" width="600">
  <blockquote>
  Project Setup
  </blockquote>
</p>


## API Documentation
API Documentation by Postman
[https://documenter.getpostman.com/view/537028/RzfnkSYc](https://documenter.getpostman.com/view/537028/RzfnkSYc)

## Database Design

<p>
  <img src="https://raw.github.com/gratcy/tax-calc/dev/diagram_db.png" width="600">
  <blockquote>
  Diagram Database Design
  </blockquote>
</p>

## Installation

### Prerequisites
- Node.js - Download and Install [Node.js](https://nodejs.org/en/) with [NVM](https://github.com/creationix/nvm) (Node Version Manager) - Simple bash script to manage multiple active node.js versions.
- MySQL - Download and Install [MySQL](https://www.mysql.com/downloads/) - Make sure it's running on the default port.

```
  $ git@github.com/gratcy/tax-calc.git
  $ cd tax-calc
  $ cp .env.sample .env
  $ npm install
  $ npm start
```

## Production Environment

To setup on production you just config all access to your service on [ecosystem.json](https://github.com/gratcy/tax-calc/blob/dev/ecosystem.json). We use [PM2](https://pm2.io/doc/en/runtime/overview) to deploy our apps to production from you local machine and we use `PM2 Runtime` to running process manager on production

**Start application for firstime on production server**

```
$ npm run start-production

```


**Deployment to production server**

Currently this deployment process still manually from your local machine. We use **PM2** `ecosystem.json` as configuration for deployment spesific server.

To start release/deploy your code to production, we need to merge all released code to branch `prod`. The first need to do before merging code to prod branch is to created [pull request](https://github.com/gratcy/tax-calc/pulls) on github from your featured branch to branch `dev` (after that make PR from dev to prod branch), or direct to branch `prod` if its an hotfix.

After all the code has been merge to branch prod, now you can run deploy script from your local machine/laptop by running script below:

```
$ npm run deploy-production

```

### License
----

[Beerware](https://en.wikipedia.org/wiki/Beerware "Beerware") © [Gratcy Palma P Hutapea]