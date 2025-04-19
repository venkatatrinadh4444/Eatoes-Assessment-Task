const express=require('express')
const {registerUser,loginUser,logoutUser,UserDetails,addingItemsToCart,removeItemFromCart,fetchCartItems,checkoutFuntion}=require('../controllers/userControllers')
const verifyVendor=require('../middlewares/verifyUserToken')

const routes=express.Router()

routes.post('/register-vendor',registerUser)
routes.post('/login-vendor',loginUser)
routes.delete('/logout-vendor',logoutUser)
routes.get('/vendor-details',verifyVendor,UserDetails)
routes.post('/add-cart-item',verifyVendor,addingItemsToCart)
routes.get('/fetch-cart-items',verifyVendor,fetchCartItems)
routes.delete('/delete-cart-item',verifyVendor,removeItemFromCart)
routes.post('/checkout',verifyVendor,checkoutFuntion)

module.exports=routes