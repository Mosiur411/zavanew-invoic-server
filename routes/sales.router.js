const { Router } = require('express')
const { getSales } = require('../controller/sales.controller')
const salesRoutes = Router()
salesRoutes.get('/', getSales)
//salesRoutes.put('/', putOrder)


module.exports = { salesRoutes }