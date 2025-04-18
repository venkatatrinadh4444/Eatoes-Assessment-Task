const Vendor=require('../models/Vendor')
const jwt=require('jsonwebtoken')

const verifyVendor=async(req,res,next)=> {
    try {
        const token=req.cookies.token
        if(!token) 
           return res.status(404).json({msg:"Token not found!"})
        const decoded=jwt.verify(token,process.env.MY_SECRET_KEY)
        if(!decoded)
            return res.status('token is invalid or expired')
        const existVendor=await Vendor.findById(decoded.id)
        if(!existVendor)
            return res.status(400).json({msg:'user not found!'})
        req.id=decoded.id
        next()
    }
    catch(err) {
        console.log('Error occured at verify vendor middleware',err)
        return res.status(500).json({msg:'Server error'})
    }
}

module.exports=verifyVendor