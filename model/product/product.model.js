
const mongoose = require("mongoose")


const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        trim: true,
        required: true,
    },
    upc: {
        type: String,
        trim: true,
    },
    upcBox: {
        type: String,
        trim: true,
    },
    cost: {
        type: Number,
        trim: true,
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