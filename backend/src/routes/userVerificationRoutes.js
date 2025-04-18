const express=require('express')
const {sendingOtp,verifyingOtp}=require('../controllers/userVerificationControllers')
const routes=express.Router()


routes.post('/send-otp',sendingOtp)
routes.post('/verify-otp',verifyingOtp)

module.exports=routes