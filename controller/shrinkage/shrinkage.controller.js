const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../../utils/helpers");
const { ShrinkageModel } = require("../../model/shrinkage.model");


const addShrinkage = async (req, res) => {
    try {
        const user = req.user;
        const data = req.body;
        const saveshrinkage = await ShrinkageModel({ ...data, user: user });
        await saveshrinkage.save()

        // await order.save()

        // const { order_id, item_id } = req.body;
        // const result = await OrderModel.findOne({ _id: order_id, 'item._id': item_id }, { 'item.$': 1 }).populate(['user', 'coustomerId', 'item.product_id']).select('payment totalPrice totalQuantity').exec();
        return res.status(300).json({saveshrinkage})

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const getShrinkage = async (req, res) => {
    try {

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const updateShrinkage = async (req, res) => {
    try {


    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const deleteShrinkage = async (req, res) => {
    try {

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = {addShrinkage, getShrinkage, updateShrinkage, deleteShrinkage}