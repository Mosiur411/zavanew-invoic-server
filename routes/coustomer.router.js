const { Router } = require('express')
const { addCoustomer, getCoustomer } = require('../controller/coustomer.controller')
const coustomerRoutes = Router()
coustomerRoutes.post('/', addCoustomer)
coustomerRoutes.get('/', getCoustomer)

module.exports = { coustomerRoutes }