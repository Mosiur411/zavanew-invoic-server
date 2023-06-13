const { Router } = require('express')
const { addOrder, getOrder, putOrder, getOrderInvoiceType } = require('../controller/order.controller')
const oderRoutes = Router()
oderRoutes.post('/', addOrder)
oderRoutes.get('/', getOrder)
oderRoutes.put('/', putOrder)


/* invoic check and due or Cash*/
oderRoutes.get('/invoice', getOrderInvoiceType)

module.exports = { oderRoutes }