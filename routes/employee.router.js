const { Router } = require('express')
const { addEmployee } = require('../controller/employee.controller')
const employeeRoutes = Router()
employeeRoutes.post('/', addEmployee)

module.exports = { employeeRoutes }