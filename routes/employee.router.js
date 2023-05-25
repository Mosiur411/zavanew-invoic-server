const { Router } = require('express')
const { addEmployee, getEmployee, deleteEmployee, updateEmployee } = require('../controller/employee.controller')
const employeeRoutes = Router()
employeeRoutes.post('/', addEmployee)
employeeRoutes.get('/', getEmployee)
employeeRoutes.put('/', updateEmployee)
employeeRoutes.delete('/', deleteEmployee)

module.exports = { employeeRoutes }