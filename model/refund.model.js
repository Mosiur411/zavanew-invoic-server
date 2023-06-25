const mongoose = require("mongoose")
const RefundSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Product'
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
    },
    purchases_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Purchases'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Employee'
    },
    sales_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'order'
    },
    quantity: {
        type: Number,
        trim: true,
    },
    cost: {
        type: Number,
        trim: true,
    },
    saleing_Price: {
        type: Number,
        trim: true,
    },
}, { timestamps: true })



module.exports = {
    RefundModel: mongoose.model('Refund', RefundSchema),
}