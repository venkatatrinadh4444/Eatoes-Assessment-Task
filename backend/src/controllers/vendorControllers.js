const Vendor=require('../models/Vendor')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const UserVerification=require('../models/UserVerification')

const registerVendor=async(req,res)=> {
    try {
        const {username,email,password}=req.body;
        const existVendor=await Vendor.findOne({email})
        if(existVendor) 
            return res.status(409).json({msg:'Vendor already exist'})
        const otpRecord=await UserVerification.findOne({email})
        if(!otpRecord || !otpRecord.isVerified) 
            return res.status(400).json({msg:'Please verify your email first'})
        if(password.length<6)
            return res.status(400).json({msg:'password must be greater than 6 letters'})
        const hashedPassword=await bcrypt.hash(password,10)
        const newVendor=new Vendor({
            username,
            email,
            password:hashedPassword
        })
        await newVendor.save()
        return res.status(201).json({msg:"Vendor registered successfully!"})
    }
    catch(err) {
        console.log('Error occured at vendor registration',err)
        return res.status(500).json({msg:"Internam server error"})
    }
}

const loginVendor=async(req,res)=> {
    try {
        const {email,password}=req.body;
        const existVendor=await Vendor.findOne({email})
        if(!existVendor || !await bcrypt.compare(password,existVendor.password))
            return res.status(400).json({msg:"Invalid credentials"})

        const token=jwt.sign({id:existVendor._id},process.env.MY_SECRET_KEY,{expiresIn:'1h'})

        res.cookie("digital_diner_user_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'None':'Lax',
            maxAge:60*60*1000
        })
        const vendorDetails=await Vendor.findById(existVendor._id)

        return res.status(200).json({msg:'Login successfull',vendorDetails})
    } catch (err) {
        console.log('Error occured at login controller',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const logoutVendor=async(req,res)=> {
    try {
        res.clearCookie('digital_diner_user_token',{
            httpOnly:true,
            secure:true,
            sameSite:'None'
        })
        return res.status(200).json({msg:'Logout successfull!'})
    } catch (err) {
        console.log('Error occured at logout funtionality',err)
        return res.status(500).json({msg:'Server error'})
    }
}

const vendorDetails=async(req,res)=> {
    try {
        const {id}=req
        const vendor=await Vendor.findById(id)
        if(!vendor)
            return res.status(404).json({msg:'Vendor not found!'})
        return res.status(200).json({vendor})
    } catch (err) {
        console.log('Error occured at fetching vendor details',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const addingItemsToCart=async(req,res)=> {
    try {
        const {id}=req
        const {itemId,image,name,price}=req.body;
        if(!itemId || !image || !name || !price) 
            return res.status(401).json({msg:"All fields are required"})
        const vendor=await Vendor.findById(id)

        if(!vendor)
            return res.status(404).json({msg:'Vendor not found!'})

    } catch (err) {
        
    }
}


module.exports={registerVendor,loginVendor,logoutVendor,vendorDetails}