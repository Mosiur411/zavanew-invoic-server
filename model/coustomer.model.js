const mongoose = require("mongoose")
const { validateEmail } = require("../utils/validators")
const CoustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    comphonyName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: validateEmail,
            message: props => `${props.value} is not a valid email`
        },
    },
    phone: {
        type: Number,
        trim: true,
    },
    etin: {
        type: String,
        trim: true,
        unique: true,
    },
    resale: {
        type: String,
        trim: true,
        unique: true,
    },
    tobacco: {
        type: String,
        trim: true,
        unique: true,
    },
    country: {
        type: String,
        trim: true,
        required: true,
    },
    city: {
        type: String,
        trim: true,
        required: true,
    },
    state: {
        type: String,
        trim: true,
    },
    zip_code: {
        type: String,
        trim: true,
    },


    address: {
        type: String,
        trim: true,
        required: true,
    }
}, { timestamps: true })

module.exports = {
    CoustomerModel: mongoose.model('Coustomer', CoustomerSchema),
}