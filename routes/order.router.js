const { Router } = require('express')
const { addOrder, getOrder, putOrder, getOrderInvoiceType, orderDelete, orderUpdateDelete } = require('../controller/order.controller')
const oderRoutes = Router()
oderRoutes.post('/', addOrder)
oderRoutes.get('/', getOrder)
oderRoutes.put('/', putOrder)
oderRoutes.delete('/', orderDelete)
/* invoic check and due or Cash*/
oderRoutes.get('/invoice', getOrderInvoiceType)

/* order items add and update or delete*/
oderRoutes.delete('/update/items', orderUpdateDelete)



module.exports = { oderRoutes }