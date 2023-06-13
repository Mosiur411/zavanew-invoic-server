const mongoose = require("mongoose")
const PurchasesSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Product'
    },
    cost: {
        type: Number,
        trim: true,
    },
    quantity: {
        type: Number,
        trim: true,
    },
    status: {
        type: Boolean,
        default: false,/* false */
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        required: true,
        ref: 'Employee'
    },

}, { timestamps: true })



module.exports = {
    PurchasesModel: mongoose.model('Purchases', PurchasesSchema),
}