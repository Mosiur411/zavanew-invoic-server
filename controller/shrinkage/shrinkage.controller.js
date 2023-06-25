const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../../utils/helpers");
const { ShrinkageModel } = require("../../model/shrinkage.model");
const { SalesModel } = require("../../model/sales.model");


const addShrinkage = async (req, res) => {
    try {
        const user = req.user;
        const { sales_id, item_id, quantity, saleing_Price} = req.body
        const data = req.body;
        const saveshrinkage = await ShrinkageModel({ ...data, user: user });
        const newTotalPrices = Number(saleing_Price) * Number(quantity)
        await SalesModel.findOneAndUpdate(
            { '_id': sales_id, 'item._id': item_id },
            {
                $inc: {
                    'item.$.saleing_Price': -newTotalPrices, 'item.$.quantity': -quantity,
                    totalQuantity: -quantity, totalPrice: -newTotalPrices
                }
            },
            { new: true }
        );
        await saveshrinkage.save()
        return res.status(300).json({ saveshrinkage })
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

module.exports = { addShrinkage, getShrinkage, updateShrinkage, deleteShrinkage }