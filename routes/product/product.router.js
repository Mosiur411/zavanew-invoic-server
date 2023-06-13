const { Router } = require('express')
const { addProduct, getProduct, updateProduct, deleteProduct, addBulkProduct, addProductPurchases, addPurchases } = require('../../controller/product/product.controller')
const { upload } = require('../../middleware/files.middleware')
const productRoutes = Router()
productRoutes.post('/', addProduct)
productRoutes.get('/purchases', addProductPurchases)
productRoutes.post('/purchases', addPurchases)
productRoutes.post('/bulk', upload.single('product.csv'), addBulkProduct)
productRoutes.get('/', getProduct)
productRoutes.put('/', updateProduct)
productRoutes.delete('/', deleteProduct)

module.exports = {
    productRoutes
}