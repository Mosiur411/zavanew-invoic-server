const { default: mongoose } = require("mongoose");
const { errorMessageFormatter, getDataFromCsv } = require("../../utils/helpers");
const { ProductModel } = require("../../model/product/product.model");
const { validateObjectId } = require("../../utils/validators");
const { doesDepartmentExist } = require("./development.controller");
const { PurchasesModel } = require("../../model/purchases.model");


const addProduct = async (req, res) => {
    try {
        const data = req.body;
        const product = await ProductModel.create({ ...data, user: req.user._id })
        const purchaseAdd = { cost: product?.cost, quantity: product?.quantity, product_id: product?._id }
        await PurchasesModel.create({ ...purchaseAdd, user: req.user._id })
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
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search;
    const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    const search = new RegExp(sanitizedSearchQuery, 'i');
    try {
        const totalProduct = await ProductModel.countDocuments();
        let totalPages = Math.ceil(totalProduct / limit);
        const skip = page * limit;
        if (searchQuery && search) {
            const product = await ProductModel.find({
                "$or": [{ product_name: { $regex: search } }, { upc: { $regex: search } }, { upcBox: { $regex: search } }]
            }).sort({ _id: 1 }).skip(skip).limit(limit)
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


        
        const activeCost = await PurchasesModel.findOneAndUpdate({ product_id: _id, status: true }, { cost: product?.cost, quantity: product?.quantity }, { new: true })
        console.log(activeCost)




        return res.status(201).json({ product })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }



}
const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.query;
        const product = await ProductModel.deleteOne({ _id: _id })
        return res.status(201).json({ product })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


/* all porduct Purchases  */



addPurchases = async (req, res) => {
    try {
        const user = req?.user;
        const data = req?.body;
        const extraCostAdd = await PurchasesModel.create({ ...data, user: req.user._id })
        return res.status(201).json(extraCostAdd)
        /* const user = req?.user
        await PurchasesModel.create({ product_id: _id, quantity: unitGross, cost: cost, user: req.user._id })

        const products = await ProductModel.find({})
        await products?.map(async (data) => {
            const { _id, cost, unitGross } = data;
            await PurchasesModel.create({ product_id: _id, quantity: unitGross, cost: cost, user: req.user._id })
        })
        return res.status(201).json({ message: "insoallha" }) */
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


const addProductPurchases = async (req, res) => {
    try {   /* quantity */
        const user = req?.user
        const products = await ProductModel.find({})
        await products?.map(async (data) => {
            const { _id, cost, unitGross } = data;
            await PurchasesModel.create({ product_id: _id, quantity: unitGross, cost: cost, user: req.user._id })
        })
        return res.status(201).json({ message: "insoallha" })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}






module.exports = { addProduct, getProduct, updateProduct, deleteProduct, addBulkProduct, addProductPurchases, addPurchases }