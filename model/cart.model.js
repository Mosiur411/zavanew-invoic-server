
const mongoose = require("mongoose")
const CartSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Product'
    },
    purchases_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Purchases'
    },
    product_name: {
        type: String,
        trim: true,
    },
    quantity: {
        type: Number,
        trim: true,
    },
    saleing_Price: {
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