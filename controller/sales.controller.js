const { default: mongoose } = require("mongoose");
const getSales = async (req, res) => {
    try {
        let order;
        const { status, distractions } = req.query;
        const { role, _id } = req.user;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.search;
        const search = new RegExp(searchQuery, 'i');
        const totalProduct = await OrderModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        order = await OrderModel.find({ status: status, distractions: distractions }).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);




        // if (id == '12') {
        //     if (role !== 'admin') {
        //         order = await OrderModel.find({ user: _id }).sort({ _id: -1 }).populate(['user', 'coustomerId', 'item.product_id']);
        //     } else {
        //         if (searchQuery) {
        //             order = await OrderModel.find({
        //                 $or: [
        //                     { orderId: { $regex: search } },
        //                     { checkProviderName: { $regex: search } },
        //                     { checkNumber: { $regex: search } },
        //                 ]
        //             })
        //                 .sort({ _id: -1 })
        //                 .skip(skip)
        //                 .limit(limit)
        //                 .populate(['user', 'coustomerId', 'item.product_id']);
        //         } else {
        //             order = await OrderModel.find({}).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
        //         }
        //         totalPages = order.length;
        //     }

        // } else {
        //     order = await OrderModel.find({ _id: id }).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
        //     totalPages = order.length;
        // }
        // return res.status(200).json({ order, totalPages })
        return res.status(200).json({ order, totalPages })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
module.exports = { getSales }