const razorpay = require('razorpay');
const Order = require('../models/Order');
const logger = require('../services/logger');

exports.getPurchasePremium = (req,res,next) => {
    try{
        const rzp = new razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET
        }) 

        const amount = 2500;
        rzp.orders.create({amount, currency: 'INR'}, async(err, order)=>{
            if(err){
                throw new Error(JSON.stringify(err))
            }
            await Order.create({
                orderID: order.id,
                status: 'PENDING',
                userId: req.user.payment_Id
            })
            res.status(201).json({order, key_id: rzp.key_id})
        })
    }catch(err){
        logger.write(err.stack)
    }   
}

exports.postUpdateStatus = async(req,res,next) => {
    try{
        await Order.updateOne({status:'PENDING', userId: req.user._id}, {status:'FAILED'}); //fail all the prior pending payments of user
        const order = await Order.findOne({orderID: req.body.order_Id});
        if(order){
           if(req.body.payment_Id!==null){
                order.paymentID = req.body.payment_Id,
                order.status = 'SUCCESSFUL'
                req.user.isPremium = true;
                await req.user.save();
                await order.update({paymentID: req.body.payment_Id, status:'SUCCESSFUL'});
            }else{
                await order.update({status:'FAILED'});
            }
        }
    }catch(err){
        logger.write(err.stack)
    }
}