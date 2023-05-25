const { Router } = require('express')
const { addCoustomer, getCoustomer, updateCoustomer, deleteCoustomer } = require('../controller/coustomer.controller')
const coustomerRoutes = Router()
coustomerRoutes.post('/', addCoustomer)
coustomerRoutes.get('/', getCoustomer)
coustomerRoutes.put('/', updateCoustomer)
coustomerRoutes.delete('/', deleteCoustomer)

module.exports = { coustomerRoutes }