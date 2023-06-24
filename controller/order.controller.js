const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { CartModel } = require("../model/cart.model");
const { OrderModel } = require("../model/order.model");
const { ProductModel } = require("../model/product/product.model");
const { SalesModel } = require("../model/sales.model");
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
        await CartModel.deleteMany({ user: { $in: user } });
        return res.status(201).json(order);
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
        const { id, coustomerId } = req.query;
        const data = { ...req.body, coustomerId: coustomerId };
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
const orderDelete = async (req, res) => {
    const { _id } = req.query;
    const order = await OrderModel.findOne({ _id: _id, user: req.user._id });
    await order?.item?.map(async (data) => {
        await ProductModel.findOneAndUpdate({ _id: data?.product_id }, { $inc: { stock: Number(data?.quantity), quantity: Number(data?.quantity) } }, { new: true })
    })
    const orderDlete = await OrderModel.deleteOne({ _id: _id })
    return res.status(201).json(orderDlete);
}

/* order items add and update or delete*/
const orderUpdateDelete = async (req, res) => {
    const { item_id, order_id } = req.query;
    const orderItemGet = await OrderModel.findOne({ _id: order_id, 'item._id': item_id }, { 'item.$': 1 },);
    const { quantity, saleing_Price, product_id } = orderItemGet?.item[0];
    await OrderModel.findOneAndUpdate(
        { _id: order_id },
        {
            $pull: { item: { _id: item_id } },
            $inc: { totalQuantity: -quantity, totalPrice: -saleing_Price }
        },
        { new: true }
    );
    const deleteItems = await ProductModel.findOneAndUpdate({ _id: product_id }, { $inc: { stock: Number(quantity), quantity: Number(quantity) } }, { new: true })
    return res.status(201).json(deleteItems);
}
const orderUpdatePut = async (req, res) => {
    const { item_id, order_id, editQuantity, editPrices } = req.query;
    const orderItemGet = await OrderModel.findOne({ _id: order_id, 'item._id': item_id }, { 'item.$': 1 },);
    const { quantity, saleing_Price, product_id } = orderItemGet?.item[0];
    const NowPrices = editQuantity * editPrices;
    const NowQuantity = editQuantity - quantity
    const NowTotalPrices = saleing_Price - NowPrices;
    await OrderModel.findOneAndUpdate(
        { '_id': order_id, 'item._id': item_id },
        {
            $set: { 'item.$.saleing_Price': NowPrices, 'item.$.quantity': editQuantity },
            $inc: { totalQuantity: -NowQuantity, totalPrice: -NowTotalPrices }
        },
        { new: true }
    )
    const UpdateItems = await ProductModel.findOneAndUpdate({ _id: product_id }, { $inc: { stock: -NowQuantity, quantity: -NowQuantity } }, { new: true })
    return res.status(201).json(UpdateItems);

}
const orderItemAdd = async (req, res) => {
    try {

        const { order_id } = req.query;
        const data = req.body;
        const user = req.user._id;
        const newItem = { ...data, user: user }
        const orderinAddNewitem = await OrderModel.findOneAndUpdate(
            { '_id': order_id },
            {
                $push: { item: newItem },
                $inc: { totalQuantity: data?.quantity, totalPrice: data?.saleing_Price }
            },
            { new: true }
        )
        await ProductModel.findOneAndUpdate({ _id: data?.product_id }, { $inc: { stock: -data?.quantity, quantity: -data?.quantity } }, { new: true })

        return res.status(201).json(orderinAddNewitem);
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
// const salesAdd = async (req, res) => {
//     try {
//         const { order_id, status } = req.query;
//         const user = req.user._id;
//         const order = await OrderModel.findOne({ _id: order_id, user: user });
//         const salesOrder = SalesModel(order)
//         salesOrder.status = status;
//         console.log(salesOrder)
//         await salesOrder.save()
//         await OrderModel.deleteOne({ _id: order_id })
//         return res.status(201).json(salesOrder);

//     } catch (err) {
//         const errorMessage = errorMessageFormatter(err)
//         return res.status(500).json(errorMessage)
//     }
// }


const salesAdd = async (req, res) => {
    try {
        const { order_id, status } = req.query;
        const user = req.user._id;
        const order = await OrderModel.findOne({ _id: order_id, user: user });

        // Assuming you have a SalesOrderModel defined for the sales order
        const salesOrder = new SalesModel({
            item: order.item,
            payment: order.payment,
            orderId: order.orderId,
            address: order.address,
            totalPrice: order.totalPrice,
            totalQuantity: order.totalQuantity,
            checkNumber: order.checkNumber,
            checkProviderName: order.checkProviderName,
            user: order.user,
            coustomerId: order.coustomerId,
            status: status,
            distractions: order.distractions
        });

        console.log(salesOrder);
        await salesOrder.save();
        await OrderModel.deleteOne({ _id: order_id });
        return res.status(201).json(salesOrder);

    } catch (err) {
        const errorMessage = errorMessageFormatter(err);
        return res.status(500).json(errorMessage);
    }
};






module.exports = { addOrder, getOrder, putOrder, getOrderInvoiceType, orderDelete, orderUpdateDelete, orderUpdatePut, orderItemAdd, salesAdd }