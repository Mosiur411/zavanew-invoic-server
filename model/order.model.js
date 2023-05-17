const mongoose = require("mongoose")
const OrderSchema = new mongoose.Schema({
    item: [
        {
            type: mongoose.Schema.Types.Mixed,
            trim: true,
            required: true,
        }
    ],
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
        ref: 'User'
    }

}, { timestamps: true })
module.exports = {
    OrderModel: mongoose.model('order', OrderSchema),
}