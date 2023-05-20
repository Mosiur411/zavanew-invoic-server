const mongoose = require("mongoose")
const OrderSchema = new mongoose.Schema({
    item: [{
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            required: true,
            ref: 'Product'
        },
        product_name: {
            type: String,
            trim: true,
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
        },
    }],
    payment: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    totalPrice: {
        type: Number,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Employee'
    },
    coustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Coustomer'
    }

}, { timestamps: true })
module.exports = {
    OrderModel: mongoose.model('order', OrderSchema),
}