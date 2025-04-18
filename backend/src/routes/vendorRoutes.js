const express=require('express')
const {registerVendor,loginVendor, logoutVendor, vendorDetails}=require('../controllers/vendorControllers')
const verifyVendor=require('../middlewares/verifyVendor')

const routes=express.Router()

routes.post('/register-vendor',registerVendor)
routes.post('/login-vendor',loginVendor)
routes.delete('/logout-vendor',logoutVendor)
routes.get('/vendor-details',verifyVendor,vendorDetails)

module.exports=routes