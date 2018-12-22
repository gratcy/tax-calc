/* global describe it before */

const App = require('../app.js')
const supertest = require('supertest')
const CONFIG = require('../app/config/index')
const should = require('should')
const expect = require('chai').expect
const assert = require('assert')
const _ = require('lodash')

const server = supertest(App.server)


before((done) => {
  done()
})

describe('Index Page', () => {
  it('GET /v1/ should return 404 page', (done) => {
    server
      .post('/')
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        res.status.should.equal(404)
        done()
      })
  })
})

describe('Item Scenario', () => {
  const dataItem = {
    item_name: 'Susu Kaleng',
    tax_code: 1,
    price: 11500
  }

  it('POST /v1/item/create - Should 200 : Success Create Item', (done) => {
    server
      .post('/v1/item/create')
      .set('Authorization', 'X-SHOPEE-AUTH')
      .set('x-token-client', '123')
      .set('userid', '1')
      .send(dataItem)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('item_name')
        res.body.data.should.have.property('tax_code')
        res.body.data.should.have.property('price')
        global.itemId = res.body.data.id

        done()
      })
  })

  it('POST /v1/item/update/:itemId - Should 200 : Success Update Item', (done) => {
    dataItem.price = 11000
    server
      .post('/v1/item/update/' + itemId)
      .set('Authorization', 'X-SHOPEE-AUTH')
      .set('x-token-client', '123')
      .set('userid', '1')
      .send(dataItem)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('item_name')
        res.body.data.should.have.property('tax_code')
        res.body.data.should.have.property('price')
        global.itemId = res.body.data.id

        done()
      })
  })

  it('GET /v1/item/get - Should 200 : Success Get Items', (done) => {
    server
      .get('/v1/item/get')
      .set('Authorization', 'X-SHOPEE-AUTH')
      .set('x-token-client', '123')
      .set('userid', '1')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        expect(res.body.data).is.an('array')

        done()
      })
  })

  it('GET /v1/item/delete/:itemId - Should 200 : Success Delete Item', (done) => {
    server
      .get('/v1/item/delete/' + itemId)
      .set('Authorization', 'X-SHOPEE-AUTH')
      .set('x-token-client', '123')
      .set('userid', '1')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('status')
        res.body.data.status.should.equal('inactive')

        done()
      })
  })
})

describe('Checkout Scenario', () => {
  const dataOrder= {
    itemIds: [1, 2, 3]
  }

  it('POST /v1/order/checkout - Should 200 : Success Checkout Order', (done) => {
    server
      .post('/v1/order/checkout')
      .set('Authorization', 'X-SHOPEE-AUTH')
      .set('x-token-client', '123')
      .set('userid', '1')
      .send(dataOrder)
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('id')
        res.body.data.should.have.property('userId')
        res.body.data.should.have.property('grandTotal')
        res.body.data.should.have.property('status')
        res.body.data.should.have.property('items')
        global.orderId = res.body.data.id
        expect(res.body.data.items).is.an('array')

        done()
      })
  })

  it('GET /v1/order/get - Should 200 : Success Checkout Order', (done) => {
    server
      .get('/v1/order/get')
      .set('Authorization', 'X-SHOPEE-AUTH')
      .set('x-token-client', '123')
      .set('userid', '1')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        expect(res.body.data).is.an('array')

        done()
      })
  })

  it('GET /v1/order/detail/:orderId - Should 200 : Success Get Order Detail', (done) => {
    server
      .get('/v1/order/detail/' + orderId)
      .set('Authorization', 'X-SHOPEE-AUTH')
      .set('x-token-client', '123')
      .set('userid', '1')
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        res.status.should.equal(200)
        res.body.status.should.equal(200)
        res.body.data.should.have.property('userid')
        res.body.data.should.have.property('orderdate')
        res.body.data.should.have.property('duedate')
        res.body.data.should.have.property('grandTotal')
        res.body.data.should.have.property('items')
        expect(res.body.data.items).is.an('array')

        done()
      })
  })
})

after((done) => {
  App.server.close()
  done()
})
