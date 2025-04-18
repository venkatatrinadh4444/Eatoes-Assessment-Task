

const mongoose=require('mongoose')


const userVerificationSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String
    },
    expiresIn:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('UserVerification',userVerificationSchema)