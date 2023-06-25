const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { SalesModel } = require("../model/sales.model");
const getSales = async (req, res) => {
    try {
        let sales;
        const { distractions } = req.query;
        const { role } = req.user;
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const searchQuery = req.query.search;
        const search = new RegExp(searchQuery, 'i');
        const totalProduct = await SalesModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        if (distractions == '') {
            console.log(distractions)
            sales = await SalesModel.find({}).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
            if (searchQuery) {
                sales = await SalesModel.find({
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
                totalPages = sales.length;
            }
            return res.status(200).json({ sales, totalPages })
        }

        if (role !== 'admin') {
            sales = await SalesModel.find({ distractions: distractions, user: req.user._id }).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
        } else {
            if (searchQuery) {
                sales = await SalesModel.find({
                    /*  distractions: distractions, */
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
                sales = await SalesModel.find({ distractions: distractions }).sort({ _id: -1 }).skip(skip).limit(limit).populate(['user', 'coustomerId', 'item.product_id']);
            }
            totalPages = sales.length;
        }
        return res.status(200).json({sales, totalPages})
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const SalesStatusHandel = async (req, res) => {
    try {
        const { _id, status } = req.query;
        const statusResult = await SalesModel.findOneAndUpdate({ _id: _id }, { status: status }, { new: true })
        return res.status(200).json(statusResult)
    }
    catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const SingleSales = async (req, res) => {
    try {
        const { id } = req.query;
        const sales = await SalesModel.findById(id).populate(['user', 'coustomerId', 'item.product_id']);
        return res.status(200).json(sales)
    }
    catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
module.exports = { getSales, SalesStatusHandel, SingleSales }