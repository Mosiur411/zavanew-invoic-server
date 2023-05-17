const { Router } = require('express')
const { addOrder } = require('../controller/order.controller')
const oderRoutes = Router()
oderRoutes.post('/',addOrder)

module.exports = { oderRoutes }