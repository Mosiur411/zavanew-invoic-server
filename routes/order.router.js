const { Router } = require('express')
const { addOrder, getOrder } = require('../controller/order.controller')
const oderRoutes = Router()
oderRoutes.post('/', addOrder)
oderRoutes.get('/', getOrder)

module.exports = { oderRoutes }