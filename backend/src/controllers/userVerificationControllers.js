const UserVerification=require('../models/UserVerification');
const otpGenerator=require('otp-generator')
const sendOtp=require('../middlewares/nodemailer')
const Vendor=require('../models/Vendor')


const sendingOtp=async(req,res)=> {
    try {
        const {email}=req.body;
        if(!email)
            return res.status(404).json({msg:'Email is required!'})
        const vendor=await Vendor.findOne({email})
        const user=await UserVerification.findOne({email})
        if(user?.isVerified && vendor)
            return res.status(404).json({msg:'Email is already in use'})
        const otp=otpGenerator.generate(6,{upperCaseAlphabets:false,specialChars:false})
        const expiryTime=new Date(Date.now()+5*60000)
        await sendOtp(email,otp)
        if(user) {
           user.otp=otp
           user.expiresIn=expiryTime
           await user.save() 
        }
        else {
            const newUser=new UserVerification({
                email,
                otp,
                expiresIn:expiryTime
            })
            await newUser.save()
        }
        return res.status(200).json({msg:'OTP sent successfully!'})
    } catch (err) {
        console.log("Error occured at sending otp",err)
        return res.status(500).json({msg:'Server error'})
    }
}

const verifyingOtp=async(req,res)=> {
    try {
        const {email,otp}=req.body;
        if(!otp || !email) 
            return res.status(400).json({msg:'All fields are required!'})
        const user=await UserVerification.findOne({email})
        if(!user) 
            return res.status(404).json({msg:'User not found!'})
        if(otp!==user.otp || new Date() > user.expiresIn) {
            return res.status(401).json({msg:'Invalid or expired OTP'})
        }
        user.otp=""
        user.expiresIn=null
        user.isVerified=true
        await user.save()
        return res.status(200).json({msg:'OTP verified successfully!'})

    } catch (err) {
        console.log("Error occured at verifying otp",err)
        return res.status(500).json({msg:'Server error'})
    }
}

module.exports={sendingOtp,verifyingOtp}
