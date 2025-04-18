const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor"
    },
    name: {
        type: String,
        required:true
      },
      phone: {
        type: Number,
        required:true
      },
      address: {
        type: String,
        required:true
      },
      itemId:{
          type:String,
          required:true
      },
      image: {
        type: String,
        required:true
      },
      name: {
        type: String,
        required:true
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required:true
      },
      total:{
        type:Number,
        required:true
      }
})

const Order=mongoose.model('Order',orderSchema)

module.exports=Order