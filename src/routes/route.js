const express = require("express")
const router = express.Router()


const {createCustomer, getCustomer} = require('../controllers/customerController')
const {createOrder} = require('../controllers/orderController')

router.post("/customer", createCustomer);
router.get("/customer/:customerId", getCustomer)

router.post("/createOrder", createOrder)

//HTTP validation

router.all("/*", (req, res) => {
    res.status(400).send({ status: false, message: "HTTP path invalid" })
})


module.exports = router