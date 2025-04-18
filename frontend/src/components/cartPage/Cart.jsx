import { useEffect, useState } from "react";
import "./Cart.css";
import {toast} from 'react-toastify';
import { Navigate,useNavigate} from "react-router-dom";
import { useContextData } from "../../context/context";
import axios from "axios";
import { API_URI } from "../Api/Api";

const Cart = () => {
  const navigateHome=useNavigate(null)
  const [cartItems, setCartItems] = useState([]);
  const {user,setUser}=useContextData()

  if(!user.username) {
    toast.warning('You need to be logged in to access this.')
    return <Navigate to="/"/>
  }

  useEffect(()=>{
    axios.get(`${API_URI}/vendor/show-cart-products`,{withCredentials:true}).then(res=>setCartItems(res.data.vendor.cart)).catch(err=>console.log(err))
  },[])

  const removeCartItem=(productId)=> {
    axios.delete(`${API_URI}/product/${productId}/delete-cart-item`,{withCredentials:true}).then(res=>{
      toast.success(res.data.msg)
      setCartItems(res.data.updatedProducts.cart)
    }).catch(err=>console.log(err))
  }

  const goToHome=()=> {
    toast('Navigate to home')
    navigateHome('/')
  }

  return (
    <div className="container mt-2">
      <h3 className="text-center text-success">Cart</h3>
      <hr />
      <div className="sectionContainer">
        {cartItems.length > 0 ? (
          cartItems.map((eachItem) => {
            return (
              <div
                className="d-flex justify-content-between align-items-center container cartContainer shadow mb-2"
                key={eachItem._id}
              >
                <div>
                <img
                  src={eachItem.item.image}
                  alt={eachItem.item.description}
                  width="80px" height="60px"
                />
                <button className="btn">Quantity:{eachItem.quantity}</button>
                </div>
                <div>
                  <h5>{eachItem.item.name}</h5>
                  <h6>Price:&#8377;{eachItem.item.price}</h6>
                </div>
                <button className="btn btn-danger" onClick={()=>removeCartItem(eachItem._id)}>Remove</button>
              </div>
            );
          })
        ) : (
          <div className="text-center">
            <img
              src="https://img.freepik.com/free-vector/supermarket-shopping-cart-concept-illustration_114360-22408.jpg?t=st=1740720165~exp=1740723765~hmac=2b73df6e9492d558399354a3f61517c904a82b20db37c1e6d6ba34aa349e49ce&w=1380"
              alt="empty cart"
              width="180px" height="200px"
            />
          </div>
        )}
      </div>

      {cartItems.length > 0 ? (
        <div className="d-flex justify-content-between align-items-center footer">
          <div className="d-flex align-items-center">
            <h6>Total Cart Items:</h6>
            <h5>{cartItems.length}</h5>
          </div>
          <div>
            <button className="btn btn-primary">Checkout</button>
          </div>
        </div>
      ) : (
        <div className="text-center">
        <button className="btn btn-primary" onClick={goToHome}>Go Home</button>
        </div>
      )}
    </div>
  );
};
export default Cart;
