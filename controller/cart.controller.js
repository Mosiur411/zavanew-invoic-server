const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { CartModel } = require("../model/cart.model");
const addCart = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user._id;
        const items = { ...data, user: user };
        const addToCar = await CartModel(items)
        await addToCar.save()
        return res.status(200).json({ addToCar })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const getCart = async (req, res) => {
    try {
        let totalPrice = 0;
        const user_id = req.user._id;
        const items = await CartModel.find({ user: user_id }).sort({ _id: -1 }).populate('product_id');
        for (let i = 0; i < items.length; i++) {
            totalPrice += items[i].price;
        }
        return res.status(200).json({ items, totalPrice })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* card update  */
const updateCart = async (req, res) => {
    try {
        const { _id, data } = req.query;
        const cardData = await CartModel.findById(_id).populate('product_id')
        const productPrice = cardData?.product_id?.price
        const cart = await CartModel.findOneAndUpdate({ _id }, { quantity: Number(data), price: data * productPrice }, { new: true })

        return res.status(201).json({ cart })




    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

/* car delete  */
const deleteCart = async (req, res) => {
    try {
        const { _id } = req.query;
        const cart = await CartModel.findOneAndRemove(_id);
        return res.status(201).json({ cart })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { addCart, getCart, deleteCart, updateCart }