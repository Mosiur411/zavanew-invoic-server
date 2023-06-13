const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../../utils/helpers");
const { OrderModel } = require("../../model/order.model");
const { RefundModel } = require("../../model/refund.model");


const addRefund = async (req, res) => {
    try {
        const user = req.user;
        const data = req.body;
        const saverefund = await RefundModel({ ...data, user: user });
        await saverefund.save()

        // await order.save()

        // const { order_id, item_id } = req.body;
        // const result = await OrderModel.findOne({ _id: order_id, 'item._id': item_id }, { 'item.$': 1 }).populate(['user', 'coustomerId', 'item.product_id']).select('payment totalPrice totalQuantity').exec();
        return res.status(300).json({saverefund})

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