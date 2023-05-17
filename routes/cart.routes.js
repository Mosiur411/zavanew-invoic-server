const { Router } = require('express')
const { addCart, getCart } = require('../controller/cart.controller')
const cartRoutes = Router()
cartRoutes.post('/', addCart)
cartRoutes.get('/', getCart)

module.exports = { cartRoutes }