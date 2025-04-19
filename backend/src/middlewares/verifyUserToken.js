const User=require('../models/User')
const jwt=require('jsonwebtoken')

const verifyUser=async(req,res,next)=> {
    try {
        const {digital_diner_user_token}=req.cookies
        if(!digital_diner_user_token) 
           return res.status(404).json({msg:"Token not found!"})
        const decoded=jwt.verify(token,process.env.MY_SECRET_KEY)
        if(!decoded)
            return res.status('token is invalid or expired')
        const existUser=await User.findById(decoded.id)
        if(!existUser)
            return res.status(400).json({msg:'user not found!'})
        req.id=decoded.id
        next()
    }
    catch(err) {
        console.log('Error occured at verify User middleware',err)
        return res.status(500).json({msg:'Server error'})
    }
}

module.exports=verifyUser