const { default: mongoose } = require("mongoose");
const admin = require('firebase-admin');
const { errorMessageFormatter } = require("../utils/helpers");
const { EmployeeModel } = require("../model/employee.model");
const { getAuth } = require("firebase-admin/auth");
const { OrderModel } = require("../model/order.model");

const addEmployee = async (req, res) => {
    try {
        const UserRecord = await admin.auth().createUser({
            email: req.body.email,
            password: req.body.password,
        })
        if (UserRecord) {
            const user = await EmployeeModel({ ...req.body, uid: UserRecord.uid, role: 'employee' })//admin
            await user.save()
            if (user) {
                await getAuth().setCustomUserClaims(UserRecord.uid, { ...UserRecord.customClaims, role: user.role, _id: user.id })
                return res.status(200).json({ message: "user" })
            }
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const getEmployee = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search;
    const sanitizedSearchQuery = searchQuery.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
    const search = new RegExp(sanitizedSearchQuery, 'i');
    try {
        const totalEmployee = await EmployeeModel.countDocuments();
        let totalPages = Math.ceil(totalEmployee / limit);
        const skip = (page - 1) * limit;
        if (search && searchQuery) {
            const isNumber = /^\d+$/.test(search);
            const query = {
                $or: [
                    { name: { $regex: search } },
                    { email: { $regex: search } },
                    { nid: { $regex: search } },
                    { zip_code: { $regex: search } },
                    { country: { $regex: search } },
                    { address: { $regex: search } },
                    { city: { $regex: search } }
                ]
            };

            if (isNumber) {
                query.$or.push({ phone: Number(search) });
            }
            const employee = await EmployeeModel.find(query)
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit);

            totalPages = employee.length;
            return res.status(200).json({ employee, totalPages });
        }

        const employee = await EmployeeModel.find({})
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit);
        // let pipeline = [];
        // const employeeIds = employee.map(employee => employee._id);
        // pipeline = [
        //     {
        //         $match: { user: { $in: employeeIds } }
        //     },
        // ];
        // const sale = await OrderModel.aggregate([
        //     ...pipeline,
        //     {
        //         $unwind: "$item"
        //     },
        //     {
        //         $group: {
        //             _id: 1,
        //             quantity: {
        //                 $sum: "$item.quantity"
        //             },
        //             total: { $sum: "$item.price" }
        //         }
        //     },
        //     {
        //         $project: {
        //             quantity: true,
        //             total: true,
        //         }
        //     }

        // ])
        // console.log(sale)

        return res.status(201).json({ employee, totalPages });
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }

}

const updateEmployee = async (req, res) => {
    try {
        const { _id } = req.query;
        const data = req.body;
        const employee = await EmployeeModel.findOneAndUpdate({ _id }, { ...data }, { new: true })
        return res.status(201).json({ employee })
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const { _id } = req.query;
        const info = await EmployeeModel.findById(_id)
        if (info) {
            const userId = info?.uid;
            const deleteFirebase = admin.auth().deleteUser(userId)
            if (deleteFirebase) {
                const employee = await EmployeeModel.deleteOne({ _id: _id })
                return res.status(201).json({ employee })
            }
        }
    } catch (err) {
        const errorMessage = errorMessageFormatter(err)
        return res.status(500).json(errorMessage)
    }
}

module.exports = {
    addEmployee,
    getEmployee,
    updateEmployee,
    deleteEmployee
}