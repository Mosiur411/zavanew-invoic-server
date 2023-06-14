const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../utils/helpers");
const { CartModel } = require("../model/cart.model");
const { ProductModel } = require("../model/product/product.model");
const { PurchasesModel } = require("../model/purchases.model");


const purchases = async (product_id) => {
    try {
        const activeCost = await PurchasesModel.find({ product_id: product_id })
        if (activeCost?.length == 1) result;
        const index = activeCost.findIndex((element) => element.status === true);
        console.log(activeCost)
        const oldCost = activeCost[index];
        const target = activeCost[index + 1];
        if (target) {
            await PurchasesModel.findOneAndUpdate({ _id: oldCost?._id }, { status: false }, { new: true })
            await PurchasesModel.findOneAndUpdate({ _id: target?._id }, { status: true }, { new: true })
            await ProductModel.findOneAndUpdate({ _id: product_id }, { quantity: target?.quantity, cost: target?.cost }, { new: true })
            return target;
        }
        return;
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        throw new Error(errorMessage)
    }
}

const addCart = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user._id;
        const { product_id } = data
        let addToCar;
        const checkProuct = await CartModel.find({ user: user, product_id: product_id }).populate('product_id')
        const handelProuct = await ProductModel.findById(product_id)
        if (checkProuct.length == 0) {
            const items = { ...data, user: user };
            addToCar = await CartModel(items)
            const result = await ProductModel.findOneAndUpdate({ _id: product_id }, { quantity: handelProuct?.quantity - data?.quantity }, { new: true })
            // if (result?.quantity === 0) {
            //     await purchases(product_id)
            // }
           await addToCar.save()
        } else {
            const qut = Number(checkProuct[0]?.quantity) + Number(data?.quantity);
            const productPrice = checkProuct[0]?.saleing_Price / Number(checkProuct[0]?.quantity)
            //await ProductModel.findOneAndUpdate({ _id: product_id }, { quantity: handelProuct?.quantity - data?.quantity }, { new: true })
            addToCar = await CartModel.findOneAndUpdate({ product_id }, { quantity: qut, saleing_Price: productPrice * qut }, { new: true })
        }
        return res.status(200).json({ addToCar })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}


const getCart = async (req, res) => {
    try {
        let totalPrice = 0;
        let totalQuantity = 0;
        const user_id = req.user._id;
        const items = await CartModel.find({ user: user_id }).sort({ _id: -1 }).populate('product_id');
        for (let i = 0; i < items.length; i++) {
            totalPrice += items[i].saleing_Price;
            totalQuantity += items[i].quantity;
        }
        return res.status(200).json({ items, totalPrice, totalQuantity })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
/* card update  */
const updateCart = async (req, res) => {
    try {
        const { _id, data, price } = req.query;
        /* price  */
        // const cardData = await CartModel.findById(_id).populate('product_id')
        // const productPrice = cardData?.product_id?.price
        const cart = await CartModel.findOneAndUpdate({ _id }, { quantity: Number(data), saleing_Price: data * price }, { new: true })


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
        const getCartProduct = await CartModel.findById({ _id: _id }).populate('product_id');
        const { product_id, quantity } = getCartProduct;
        await ProductModel.findOneAndUpdate({ _id: product_id?._id }, { quantity: product_id?.quantity + quantity }, { new: true })
        const cart = await CartModel.deleteOne({ _id: _id })
        return res.status(201).json({ cart })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = { addCart, getCart, deleteCart, updateCart }