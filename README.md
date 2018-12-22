# Tax Calculator
API for Shopee Calculate Tax Order

[![Code Style](https://img.shields.io/badge/code%20style-standard-green.svg)](https://github.com/feross/standard)


[Installation](#installation) |
[API Documentation](#api-documentation) |
[Database Design](#database-design) |
[Deployment Setup](#deployment-setup) |
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

## Deployment Setup
In production mode, you dont need to clone this repo manually. Because already setup in docker. Just follow below instructions.

### Prerequisites
- Install Docker [https://download.docker.com/](https://download.docker.com/)
- git clone git@github.com:gratcy/docker-setup.git
- docker-compose build
- docker-compose -d up
- Setting your host 127.0.0.1 to [http://api.shopee.local/](http://api.shopee.local/) by default in ./nginx/api-shopee.conf

### License
----

[Beerware](https://en.wikipedia.org/wiki/Beerware "Beerware") © [Gratcy Palma P Hutapea]