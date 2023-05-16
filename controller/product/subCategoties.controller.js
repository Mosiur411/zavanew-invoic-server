const { default: mongoose } = require("mongoose");
const { errorMessageFormatter } = require("../../utils/helpers");
const { SubCategorieModel } = require("../../model/product/subcategories.model");
/* Development create */
const addSubCategoties = async (req, res) => {
    try {
        const data = req.body;
        const subcategorie = await SubCategorieModel.create({ ...data, user: req.user._id })
        return res.status(201).json({ subcategorie })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}
const getSubCategoties = async (req, res) => {

    try {
        const query = req.query._id;
        let subCategorie;
        if (query) {
            subCategorie = await SubCategorieModel.find({ categorie_id: query }).sort({ _id: -1 })
        } else {
            subCategorie = await SubCategorieModel.find({}).sort({ _id: -1 }).populate(['development_id', 'categorie_id', 'user'])
        }
        return res.status(201).json({ subCategorie })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }


}
const deleteSubCategoties = async (req, res) => { 
    try {
        const { _id } = req.query;
        const result = await SubCategorieModel.findOneAndRemove(_id);
        return res.status(201).json({ result })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }


}

module.exports = {
    addSubCategoties, getSubCategoties, deleteSubCategoties
}
