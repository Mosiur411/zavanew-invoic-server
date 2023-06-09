const mongoose = require("mongoose");
const { SalesStatus, Distractions } = require("../utils/constants");
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
        saleing_Price: {
            type: Number,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            required: true,
            ref: 'User'
        },
        purchases_id: {
            type: mongoose.Schema.Types.ObjectId,
            trim: true,
            required: true,
            ref: 'Purchases'
        },
    }],
    payment: {
        type: String,
        trim: true,
        lowercase: true,
    },
    orderId: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        trim: true,
    },
    totalPrice: {
        type: Number,
        trim: true,
    },
    totalQuantity: {
        type: Number,
        trim: true,
    },
    checkNumber: {
        type: String,
        trim: true,
    },
    checkProviderName: {
        type: String,
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
    },
    status: {
        type: String,
        trim: true,
        required: true,
        default: SalesStatus?.Pending,
    },
    distractions: {
        type: String,
        trim: true,
        required: true,
        default: Distractions?.Offline,
    },

}, { timestamps: true })


module.exports = {
    OrderModel: mongoose.model('order', OrderSchema),
}