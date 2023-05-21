const { Router } = require('express')
const { addCart, getCart, deleteCart, updateCart } = require('../controller/cart.controller')
const cartRoutes = Router()
cartRoutes.post('/', addCart)
cartRoutes.get('/', getCart)
cartRoutes.put('/', updateCart)
cartRoutes.delete('/', deleteCart)

module.exports = { cartRoutes }