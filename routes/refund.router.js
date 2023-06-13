const { Router } = require('express')
const { addRefund, getRefund, updateRefund, deleteRefund } = require('../controller/refund/refund.controller')
const refundRoutes = Router()
refundRoutes.post('/', addRefund)
refundRoutes.get('/', getRefund)
refundRoutes.put('/', updateRefund)
refundRoutes.delete('/', deleteRefund)

module.exports = { refundRoutes }