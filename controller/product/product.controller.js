const { default: mongoose } = require("mongoose");
const { errorMessageFormatter, getDataFromCsv } = require("../../utils/helpers");
const { ProductModel } = require("../../model/product/product.model");
const { validateObjectId } = require("../../utils/validators");
const { doesDepartmentExist } = require("./development.controller");


const addProduct = async (req, res) => {
    try {
        const data = req.body;
        const product = await ProductModel.create({ ...data, user: req.user._id })
        return res.status(201).json({ product })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}



/* ==================== add bulk product ============  */

const getValidProducts = async (productsFromCSV) => {
    const validProducts = []
    const errors = []

    for (idx in productsFromCSV) {
        try {
            const isValidId = validateObjectId(productsFromCSV[idx].development_id)
            if (!isValidId) {
                errors.push(`Depatrment: ${productsFromCSV[idx].development_id} does not exists`)
                continue
            }

            const isDepartment = await doesDepartmentExist(productsFromCSV[idx].development_id)
            if (!isDepartment) {
                errors.push(`Depatrment: ${productsFromCSV[idx].department} does not exists`)
                continue
            }

            validProducts.push(productsFromCSV[idx])
        } catch (err) {
            //console.log(err)
            errors.push(err.message)
        }
    }

    return { validProducts, errors }
}

const addBulkProduct = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: '"products_csv" is required.' })
        const productsFromCSV = await getDataFromCsv(file.path, req.user._id)
        const products = await ProductModel.insertMany(productsFromCSV)
        return res.status(201).json({ products })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const getProduct = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search.toLowerCase()
    try {
        const totalProduct = await ProductModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = (page - 1) * limit;
        if (search) {
            const product = await ProductModel.find({
                "$or": [{ product_name: { $regex: search } }, { upc: { $regex: search } }, { upcBox: { $regex: search } }]
            }).sort({ _id: -1 }).skip(skip).limit(limit)
            totalPages = product.length;
            return res.status(200).json({ product, totalPages })
        }
        const product = await ProductModel.find({}).sort({ _id: -1 }).skip(skip).limit(limit)
        return res.status(201).json({ product, totalPages })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }

}
const updateProduct = async (req, res) => {
    try {
        const { _id } = req.query;
        const data = req.body;
        const product = await ProductModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
        return res.status(201).json({ product })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }





}
const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.query;
        const product = await ProductModel.findOneAndRemove(_id);
        return res.status(201).json({ product })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
module.exports = { addProduct, getProduct, updateProduct, deleteProduct, addBulkProduct }