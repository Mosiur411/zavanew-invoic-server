const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { CoustomerModel } = require("../model/coustomer.model");

const addCoustomer = async (req, res) => {
    try {
        const data = req.body;
        const coustomer = await CoustomerModel(data)
        await coustomer.save()
        return res.status(200).json({ message: "Coustomer add " })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const getCoustomer = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search;
    const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    const search = new RegExp(sanitizedSearchQuery, 'i');

    try {
        const totalCoustomer = await CoustomerModel.countDocuments();
        let totalPages = Math.ceil(totalCoustomer / limit);
        const skip = (page - 1) * limit;
        if (search && searchQuery) {
            const coustomer = await CoustomerModel.find({
                "$or": [{ name: { $regex: search } },
                { comphonyName: { $regex: search } },
                { email: { $regex: search } },
                { etin: { $regex: search } },
                { resale: { $regex: search } },
                { tobacco: { $regex: search } },
                { country: { $regex: search } },
                { city: { $regex: search } },
                { address: { $regex: search } },
                ]
            }).sort({ _id: -1 }).skip(skip).limit(limit)
            totalPages = coustomer.length;
            return res.status(200).json({ coustomer, totalPages })
        }
        const coustomer = await CoustomerModel.find({}).sort({ _id: -1 }).skip(skip).limit(limit)
        return res.status(201).json({ coustomer, totalPages })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const updateCoustomer = async (req, res) => {
    try {
        const { _id } = req.query;
        const data = req.body;
        const coustomer = await CoustomerModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
        return res.status(201).json({ coustomer })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const deleteCoustomer = async (req, res) => {
    try {
        const { _id } = req.query;
        const coustomer = await CoustomerModel.deleteOne({ _id: _id })
        return res.status(201).json({ coustomer })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


module.exports = {
    addCoustomer,
    getCoustomer,
    updateCoustomer,
    deleteCoustomer
}
