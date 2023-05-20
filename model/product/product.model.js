
const mongoose = require("mongoose")


const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true,

    },
    upc: {
        type: String,
        trim: true,
        lowercase: true,
    },
    upcBox: {
        type: String,
        trim: true,
        lowercase: true,
    },
    cost: {
        type: Number,
        trim: true,
        lowercase: true,
    },
    price: {
        type: Number,
        trim: true,
    },
    quantity: {
        type: Number,
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
    ProductModel: mongoose.model('Product', ProductSchema),
}