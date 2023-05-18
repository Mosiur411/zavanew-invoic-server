const { default: mongoose } = require("mongoose");
const admin = require('firebase-admin');
const { errorMessageFormatter } = require("../utils/helpers");
const { EmployeeModel } = require("../model/employee.model");
const { getAuth } = require("firebase-admin/auth");



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




module.exports = {
    addEmployee
}
