const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { ProductModel } = require("../model/product/product.model");
const { CartModel } = require("../model/cart.model");
const { OrderModel } = require("../model/order.model");
const addOrder = async (req, res) => {

    try {
        const data = req.body;
        const user = req.user._id;
        const card = await CartModel.find({ user: user }).sort({ _id: -1 }).populate('product_id');
        const items = { item: [...card] }
        const order = await OrderModel({ ...data, ...items, user: user })
        await order.save()
        const updateProduct = card?.map(async (data) => await ProductModel.updateOne({ _id: data?.product_id?._id }, { $set: { quantity: data?.product_id?.quantity - data?.quantity } }));
        /* ============= set order =============  */
        const result = await CartModel.deleteMany({ user: { $in: user } });
        return res.status(201).json({ result });

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


module.exports = { addOrder }