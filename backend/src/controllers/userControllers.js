const User=require('../models/User')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const UserVerification=require('../models/UserVerification')
const Cart = require('../models/Cart')
const Order = require('../models/Order')

const registerUser=async(req,res)=> {
    try {
        const {username,email,password}=req.body;
        const existUser=await User.findOne({email})
        if(existUser) 
            return res.status(409).json({msg:'User already exist'})
        const otpRecord=await UserVerification.findOne({email})
        if(!otpRecord || !otpRecord.isVerified) 
            return res.status(400).json({msg:'Please verify your email first'})
        if(password.length<6)
            return res.status(400).json({msg:'password must be greater than 6 letters'})
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=new User({
            username,
            email,
            password:hashedPassword
        })
        await newUser.save()
        return res.status(201).json({msg:"User registered successfully!"})
    }
    catch(err) {
        console.log('Error occured at User registration',err)
        return res.status(500).json({msg:"Internam server error"})
    }
}

const loginUser=async(req,res)=> {
    try {
        const {email,password}=req.body;
        const existUser=await User.findOne({email})
        if(!existUser || !await bcrypt.compare(password,existUser.password))
            return res.status(400).json({msg:"Invalid credentials"})

        const token=jwt.sign({id:existUser._id},process.env.MY_SECRET_KEY,{expiresIn:'1h'})

        res.cookie("digital_diner_user_token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'None':'Lax',
            maxAge:60*60*1000
        })
        const UserDetails=await User.findById(existUser._id)

        return res.status(200).json({msg:'Login successfull',UserDetails})
    } catch (err) {
        console.log('Error occured at login controller',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const logoutUser=async(req,res)=> {
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

const UserDetails=async(req,res)=> {
    try {
        const {id}=req
        const user=await User.findById(id)
        if(!user)
            return res.status(404).json({msg:'User not found!'})
        return res.status(200).json(user)
    } catch (err) {
        console.log('Error occured at fetching User details',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const addingItemsToCart=async(req,res)=> {
    try {
        const {id}=req
        const {itemId,image,name,price}=req.body;
        if(!itemId || !image || !name || !price) 
            return res.status(401).json({msg:"All fields are required"})

        const user=await User.findById(id)

        if(!user)
            return res.status(404).json({msg:'User not found!'})

        const cartItem=await Cart.findOne({itemId})
        if(cartItem) {
            cartItem.quantity=cartItem.quantity+1
            await cartItem.save()
        return res.status(201).json({msg:'Cart Item updated successfully!'})
        }

        const newCartItem=new Cart({
            userId:user._id,
            itemId,
            image,
            name,
            price
        })

        await newCartItem.save()

        return res.status(201).json({msg:'New Item added to cart'})

    } catch (err) {
        console.log('Error occured at adding cart item',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const removeItemFromCart=async(req,res)=> {
    try {
        const {id}=req
        if(!id)
            return res.status(404).json({msg:"User id not found!"})
        const {cartItemId}=req.params;
        if(!cartItemId)
            return res.status(404).json({msg:'Item id not found!'})
        const updateCart=await Cart.findByIdAndDelete(cartItemId)
        if(!updateCart)
            return res.status(404).json({msg:'Cart Item not found'})
        return res.status(200).json({msg:"Item removed from cart"})
    } catch (err) {
        console.log('Error occured at removing cart item',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const fetchCartItems=async(req,res)=> {
    try {
        const {id}=req
        if(!id)
            return res.status(404).json({msg:'User id not found!'})
        const cartItems=await Cart.find({userId:id})
        return res.status(200).json({msg:'Showing cart items',cartItems})
    } catch (err) {
        console.log('Error occured at fetching cart items',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const checkoutFuntion=async(req,res)=> {
    try {
        const {id}=req
        if(!id)
            return res.status(404).json({msg:'User id not found!'})
        const {name,phone,address}=req.body;
        if(!name || !phone || !address)
            return res.status(401).json({msg:"All fields are required"})
        const cartItems=await Cart.find({userId:id})

        if(cartItems.length===0)
            return res.status(403).json({msg:"Cart is empty"})

        
        const totalAmount=cartItems.reduce((total,item)=>{
            return total+item.price*item.quantity
        },0)

        const newOrder=new Order({
            userId:id,
            name,
            phone,
            address,
            items:
                cartItems.map(eachItem=>{
                    return {
                        itemId:eachItem.itemId,
                        image:eachItem.image,
                        name:eachItem.name,
                        quantity:eachItem.quantity,
                        price:eachItem.price
                    }
                }),
            total:totalAmount
        })
        await newOrder.save()
        await Cart.deleteMany({userId:id})
        return res.status(201).json({msg:'Order placed successfully!'})
    } catch (err) {
        console.log('Error occured at placing order',err)
        return res.status(500).json({msg:"Server error"})
    }
}

const gettingOrderedItems=async(req,res)=> {
    try {
        const {id}=req
        if(!id)
            return res.status(404).json({msg:'user id not found!'})
        const orderedItems=await Order.find({userId:id})
        return res.status(200).json({msg:'Showing ordered items',orderedItems})
    } catch (err) {
        console.log('Error occured at fetching order items',err)
        return res.status(500).json({msg:"Server error"})
    }
}

module.exports={registerUser,loginUser,logoutUser,UserDetails,addingItemsToCart,removeItemFromCart,fetchCartItems,checkoutFuntion,gettingOrderedItems}