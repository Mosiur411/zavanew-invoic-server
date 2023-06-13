const { Router } = require('express')
const { addShrinkage, getShrinkage, updateShrinkage, deleteShrinkage } = require('../controller/shrinkage/shrinkage.controller')
const shrinkageRoutes = Router()
shrinkageRoutes.post('/', addShrinkage)
shrinkageRoutes.get('/', getShrinkage)
shrinkageRoutes.put('/', updateShrinkage)
shrinkageRoutes.delete('/', deleteShrinkage)

module.exports = { shrinkageRoutes }