const mongoose = require('mongoose')
const customerModel = require('../models/customerModel')
const orderModel = require('../models/orderModel')

exports.createOrder = async (req, res) => {

    try {
        let orderData = req.body
        let { customerId, orderAmount } = orderData

        if (Object.keys(orderData).length == 0) {
            return res.status(400).send({ status: false, message: "Provide some details to create order" })
        }

        if (!customerId)
            return res.status(400).send({ status: false, message: "CustormerId is required" })

        if (!mongoose.isValidObjectId(customerId))
            return res.status(400).send({ status: false, message: "Please provide valid customer id" })


        if (!orderAmount)
            return res.status(400).send({ status: false, message: "orderAmount is required" })

        if (typeof orderAmount != "number")
            return res.status(400).send({ status: false, message: 'Order amount should be in number' })

        let findCustomer = await customerModel.findById(customerId).select({ cOrders: 1, category: 1, totalDiscount: 1 })
        if (!findCustomer)
            return res.status(400).send({ status: false, message: "customer not found" })

            
        const createdOrder = await orderModel.create(orderData)


        let updateOrders = await customerModel.findByIdAndUpdate(customerId, { $inc: { cOrders: +1 } }, { new: true });


        if (updateOrders.cOrders == 9) {
            console.log("You have placed 9 orders with us. Buy one more stuff and you will be promoted to Gold customer and enjoy 10% discounts!")
        }

              
        if (updateOrders.cOrders == 19) {
            console.log("You have placed 19 orders with us. Buy one more stuff and you will be promoted to Platinum customer and enjoy 10% discounts!")
        }

      
        if (updateOrders.cOrders <= 10) {
            updateOrders.orderAmount = 0
        }

        // category becomes Platinum
        if (updateOrders.cOrders == 10) {
            updateOrders.category = "Gold"
        }

        //  10 % discount
        if (updateOrders.cOrders > 10 && updateOrders.cOrders <= 20) {
            updateOrders.orderAmount = orderData.orderAmount * 0.1
        }

        // category becomes Platinum
        if (updateOrders.cOrders == 20) {
            updateOrders.category = "Platinum"
        }

        //  20 % discount
        if (updateOrders.cOrders > 20) {
            updateOrders.orderAmount = orderData.orderAmount * 0.2
        }


        await customerModel.findByIdAndUpdate(customerId, { category: updateOrders.category, $inc: { totalDiscount: +updateOrders.orderAmount } }, { new: true });


       let updatingOrder = await orderModel.findOneAndUpdate({id : createdOrder._id},{discount : updateOrders.orderAmount},{new : true}).select({_v : 0})
        

       return res.status(201).send({ status: true, message: "Success", data: updatingOrder })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

