const express = require('express')
const cors = require('cors')
const { connectDatabase } = require('./config/bd.config')
const { Auth_Rqeuired } = require('./middleware/auth.middleware')
const { initializeFirebase } = require('./config/firebase.config')
const { dashboardRoutes } = require('./routes/dashboard.routes')


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
// app.use('/', userRoutes)
// app.use('/development', Auth_Rqeuired, developmentRoutes)
// app.use('/categories', Auth_Rqeuired, categoriesRoutes)
// app.use('/subCategories', Auth_Rqeuired, subCategoriesRoutes)
// app.use('/childSubCategories', Auth_Rqeuired, childsubRoutes)
// app.use('/product', Auth_Rqeuired, productRoutes)

// app.use('/cart', Auth_Rqeuired, cartRoutes)
// app.use('/order', Auth_Rqeuired, oderRoutes)
// app.use('/employee', Auth_Rqeuired, employeeRoutes)
// app.use('/coustomer', Auth_Rqeuired, coustomerRoutes)

// app.use('/refund', Auth_Rqeuired, refundRoutes)
// app.use('/shrinkage', Auth_Rqeuired, shrinkageRoutes)



// database
const mongodb_uri = process.env.PROD_DB;
connectDatabase(mongodb_uri)
initializeFirebase()

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})