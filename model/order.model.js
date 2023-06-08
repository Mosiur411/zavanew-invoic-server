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
    }],
    payment: {
        type: String,
        trim: true,
    },
    customId: {
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
    }

}, { timestamps: true })

// Pre-save middleware
OrderSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
        // Check for the last inserted document
        OrderSchema.findOne({}, {}, { sort: { customId: -1 } }, function (err, lastUser) {
            if (err) return next(err);
            // Increment the numeric part
            const numericPart = lastUser ? parseInt(lastUser.customId.substring(4)) + 1 : 1;
            doc.customId = 'zavawholesale' + numericPart;
            next();
        });
    } else {
        next();
    }
});


module.exports = {
    OrderModel: mongoose.model('order', OrderSchema),
}