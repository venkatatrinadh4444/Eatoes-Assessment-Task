const express=require('express')
const {registerUser,loginUser,logoutUser,UserDetails,addingItemsToCart,removeItemFromCart,fetchCartItems,checkoutFuntion, gettingOrderedItems}=require('../controllers/userControllers')
const verifyUser=require('../middlewares/verifyUserToken')

const routes=express.Router()

routes.post('/register-user',registerUser)
routes.post('/login-user',loginUser)
routes.delete('/logout-user',logoutUser)
routes.get('/user-details',verifyUser,UserDetails)
routes.post('/add-to-cart',verifyUser,addingItemsToCart)
routes.get('/fetch-cart-items',verifyUser,fetchCartItems)
routes.delete('/delete-cart-item/:cartItemId',verifyUser,removeItemFromCart)
routes.post('/checkout',verifyUser,checkoutFuntion)
routes.get('/fetch-ordered-items',verifyUser,gettingOrderedItems)

module.exports=routes