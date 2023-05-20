const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { ProductModel } = require("../model/product/product.model");
const { CartModel } = require("../model/cart.model");
const { OrderModel } = require("../model/order.model");

const getRrecord = async (req, res) => {
    try {
        const product = await ProductModel.aggregate([
            {
                $group: {
                    _id: 1,
                    price: {
                        $sum: '$price'
                    },
                    quantity: {
                        $sum: '$quantity'
                    },
                    cost: {
                        $sum:{ $multiply: ["$quantity", "$cost"] }
                    },
                }
            },
            {
                $project: {
                    cost: true,
                    price: true,
                    quantity: true
                }
            }
        ])
        const sale = await OrderModel.aggregate([
            {
                $unwind: "$item"
            },
            {
                $group: {
                    _id: 1,
                    quantity: {
                        $sum: "$item.quantity"
                    },
                    total: { $sum: "$item.price" }
                }
            },
            {
                $project: {
                    quantity: true,
                    total: true,
                }
            }

        ])
        return res.status(200).json({ products: product, sales: sale })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


module.exports = { getRrecord }