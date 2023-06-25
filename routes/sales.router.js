const { Router } = require('express')
const { getSales, SalesStatusHandel, SingleSales } = require('../controller/sales.controller')
const salesRoutes = Router()
salesRoutes.get('/', getSales)
salesRoutes.put('/status', SalesStatusHandel)
salesRoutes.get('/single', SingleSales)
//salesRoutes.put('/', putOrder)


module.exports = { salesRoutes }