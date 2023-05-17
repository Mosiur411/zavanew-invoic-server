
const mongoose = require("mongoose")
const CartSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        trim: true,
    },
    price: {
        type: Number,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'User'
    }

}, { timestamps: true })
module.exports = {
    CartModel: mongoose.model('cart', CartSchema),
}