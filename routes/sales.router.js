const { Router } = require('express')
const { getSales, SalesStatusHandel, SingleSales, SalesPaymentHandel } = require('../controller/sales.controller')
const salesRoutes = Router()
salesRoutes.get('/', getSales)
salesRoutes.put('/status', SalesStatusHandel)
salesRoutes.put('/payment', SalesPaymentHandel)
salesRoutes.get('/single', SingleSales)
//salesRoutes.put('/', putOrder)


module.exports = { salesRoutes }