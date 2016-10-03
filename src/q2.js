// assume Node v4+, express and a MongoDb database
import mongoose from 'mongoose'
import async from 'async'
import _ from 'lodash'
// assume schema files for collections have been written
import ProductSchema from './mySchemas/ProductSchema'
import OrderProductSchema from './mySchemas/OrderProductSchema'

// db connect
mongoose.connect('mongodb://localhost:27017/products_db')
mongoose.connection.on('error', (err) => { if (err) throw err })

/**
 * Express API endpoint to populate orders with matching product details
 * @route /api/orders
 * @request POST - application/x-www-form-urlencoded
 * @param {object} req - express request object
 * @param {object} res - express response object
 */
export default populateOrders = (req, res) => {

  // NOTE: assume a array named ordersArray is passed from the request body
  // eg. [{ productId: 845 }, { productId: 272 }]
  const ordersArray = req.body.ordersArray
  // Products collection schema instance
  const Products = mongoose.Model('Products', ProductSchema)
  // Don't use a schema instance for the bulk insert, always use a plain map object
  const OrderProduct = mongoose.model('OrderProduct', OrderProductSchema)

  // As NoSQL is not a relationship based database,
  // multiple asynchronous calls will need to be made
  // so use async module to support an asynchronous workflow for Node versions < v6.
  // NOTE: Although as of MongoDb v3.2 joins are supported via lookup,
  // see https://docs.mongodb.com/master/reference/operator/aggregation/lookup/#pipe._S_lookup
  async.waterfall([
    (done) => {
      // assign all products in collection to a list
      Products.find({}, (err, products) => {
        const productsList = []
        products.forEach((obj) => { productsList.push({ productId: obj.id, name: obj.name, price: obj.price }) })
        done(err, productsList)
      })
    },
    (productsList, done) => {
      // build orders array
      const orders = ordersArray.map((order) => productsList.find((product) => product.productId === order.productId))
      // limit to 100 at time via lodash chunks method
      const chunks = _.chunk(orders, 100)
      // loop through chunks
      for(let i = 0; i < chunks.length; i++) {
        // bulk insert
        OrderProduct.collection.insertMany(chunks[i], (err, docs) => {
          if (err) return res.status(500).send({ success: false, message: 'Error: ' + err })
          res.status(201).send({ success: true, result: docs.length + ' orders were successfully stored.' })
        })
      }
    }
  ], (err) => { if (err) { return res.status(500).send({ success: false, message: 'Error: ' + err }) } })

}
