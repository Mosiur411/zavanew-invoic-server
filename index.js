const express = require('express')
const cors = require('cors')
const { connectDatabase } = require('./config/bd.config')
const { Auth_Rqeuired } = require('./middleware/auth.middleware')
const { initializeFirebase } = require('./config/firebase.config')
const { userRoutes } = require('./routes/user.routes')
const { developmentRoutes } = require('./routes/product/development.routes')
const { categoriesRoutes } = require('./routes/product/categories.routes')
const { subCategoriesRoutes } = require('./routes/product/subCategoties.router')
const { childsubRoutes } = require('./routes/product/childSubCategories.router')
const { productRoutes } = require('./routes/product/product.router')
const { cartRoutes } = require('./routes/cart.routes')
const { oderRoutes } = require('./routes/order.router')
const { employeeRoutes } = require('./routes/employee.router')
const { coustomerRoutes } = require('./routes/coustomer.router')
const { dashboardRoutes } = require('./routes/dashboard.routes')
const { refundRoutes } = require('./routes/refund.router')
const { shrinkageRoutes } = require('./routes/shrinkage.router')
const { salesRoutes } = require('./routes/sales.router')

require('dotenv').config()
const app = express()
/* server site port

*/
const port = process.env.PORT || 5001
// middlewares 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

/* dashboard.controller.js */
app.use('/dashboard', Auth_Rqeuired, dashboardRoutes)
app.use('/', userRoutes)
app.use('/development', Auth_Rqeuired, developmentRoutes)
app.use('/categories', Auth_Rqeuired, categoriesRoutes)
app.use('/subCategories', Auth_Rqeuired, subCategoriesRoutes)
app.use('/childSubCategories', Auth_Rqeuired, childsubRoutes)
app.use('/product', Auth_Rqeuired, productRoutes)

app.use('/cart', Auth_Rqeuired, cartRoutes)
app.use('/order', Auth_Rqeuired, oderRoutes)
app.use('/employee', Auth_Rqeuired, employeeRoutes)
app.use('/coustomer', Auth_Rqeuired, coustomerRoutes)

app.use('/refund', Auth_Rqeuired, refundRoutes)
app.use('/shrinkage', Auth_Rqeuired, shrinkageRoutes)

/* sales  */
app.use('/sales', Auth_Rqeuired, salesRoutes)



// database
const mongodb_uri = process.env.PROD_DB;
connectDatabase(mongodb_uri)
initializeFirebase()

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})