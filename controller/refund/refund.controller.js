const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../../utils/helpers");
const { OrderModel } = require("../../model/order.model");
const { RefundModel } = require("../../model/refund.model");
const { SalesModel } = require("../../model/sales.model");
const { PurchasesModel } = require("../../model/purchases.model");
const { ProductModel } = require("../../model/product/product.model");


const addRefund = async (req, res) => {
    try {
        const user = req.user;
        const { product_id, sales_id, item_id, quantity, saleing_Price, purchases_id } = req.body
        const data = req.body;
        const saverefund = await RefundModel({ ...data, user: user });
        const newTotalPrices = Number(saleing_Price) * Number(quantity)
        await SalesModel.findOneAndUpdate(
            { '_id': sales_id, 'item._id': item_id },
            {
                $inc: {
                    'item.$.saleing_Price': -newTotalPrices,
                    'item.$.quantity': -quantity,
                    totalQuantity: -quantity,
                    totalPrice: -newTotalPrices
                }
            },
            { new: true }
        )
        await ProductModel.findOneAndUpdate({ _id: product_id }, { $inc: { stock: quantity, quantity: quantity } }, { new: true })
        await PurchasesModel.findOneAndUpdate({ _id: purchases_id }, { $inc: { quantity: quantity } }, { new: true })

        await saverefund.save()
        return res.status(300).json({ saverefund })

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const getRefund = async (req, res) => {
    try {

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const updateRefund = async (req, res) => {
    try {


    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const deleteRefund = async (req, res) => {
    try {

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { addRefund, getRefund, updateRefund, deleteRefund }