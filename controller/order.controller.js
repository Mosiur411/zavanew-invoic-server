const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { ProductModel } = require("../model/product/product.model");
const { CartModel } = require("../model/cart.model");
const { OrderModel } = require("../model/order.model");
const addOrder = async (req, res) => {

    try {
        let totalQuantity = 0;
        const data = req.body;
        const user = req.user._id;
        const card = await CartModel.find({ user: user }).sort({ _id: -1 }).populate('product_id');
        const items = { item: [...card] }
        for (let i = 0; i < items?.item.length; i++) {
            totalQuantity += items?.item[i].quantity;
        }
        const order = await OrderModel({ ...data, ...items, user: user, totalQuantity: totalQuantity })
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
const getOrder = async (req, res) => {
    try {
        const { id } = req.query;
        const { role, _id } = req.user;
        let order;
        if (id == '12') {
            if (role !== 'admin') {
                order = await OrderModel.find({ user: _id }).sort({ _id: -1 }).populate(['user', 'coustomerId', 'item.product_id']);
            } else {
                order = await OrderModel.find({}).sort({ _id: -1 }).populate(['user', 'coustomerId', 'item.product_id']);
            }

        } else {
            order = await OrderModel.find({ _id: id }).sort({ _id: -1 }).populate(['user', 'coustomerId', 'item.product_id'])
        }
        return res.status(200).json({ order })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


module.exports = { addOrder, getOrder }