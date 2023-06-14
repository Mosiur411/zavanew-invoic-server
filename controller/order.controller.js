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
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.search;
        const search = new RegExp(searchQuery, 'i');
        const totalProduct = await OrderModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        let order;
        if (id == '12') {
            if (role !== 'admin') {
                order = await OrderModel.find({ user: _id }).sort({ _id: -1 }).populate(['user', 'coustomerId', 'item.product_id']);
            } else {
                if (searchQuery) {
                    order = await OrderModel.find({
                        $or: [
                            { orderId: { $regex: search } },
                            { checkProviderName: { $regex: search } },
                            { checkNumber: { $regex: search } },
                        ]
                    })
                        .sort({ _id: -1 })
                        .skip(skip)
                        .limit(limit)
                        .populate(['user', 'coustomerId', 'item.product_id']);
                } else {
                    order = await OrderModel.find({}).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
                }
                totalPages = order.length;
            }

        } else {
            order = await OrderModel.find({ _id: id }).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
            totalPages = order.length;
        }
        return res.status(200).json({ order, totalPages })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* ================ order update  ================  */
const putOrder = async (req, res) => {
    try {
        const { id } = req.query;
        const data = req.body;
        const product = await OrderModel.findOneAndUpdate({ _id: id }, { ...data }, { new: true })
        return res.status(201).json({ product });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const getOrderInvoiceType = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.search;
        const search = new RegExp(searchQuery, 'i');
        const totalProduct = await OrderModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        const invoiceType = req.query?.invoice;
        let invoice;
        if (searchQuery) {
            invoice = await OrderModel.find({
                $and: [
                    { payment: invoiceType },
                    {
                        $or: [
                            { orderId: { $regex: search } },
                            { checkProviderName: { $regex: search } },
                            { checkNumber: { $regex: search } },
                        ]
                    }
                ]
            })
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
                .populate(['user', 'coustomerId', 'item.product_id']);


        } else {
            invoice = await OrderModel.find({ payment: invoiceType }).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
        }

        return res.status(201).json({ invoice, totalPages });

    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
module.exports = { addOrder, getOrder, putOrder, getOrderInvoiceType }