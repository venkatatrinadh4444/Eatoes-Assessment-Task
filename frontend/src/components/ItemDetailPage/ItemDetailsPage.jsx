import axios from "axios";
import "./ItemDetailPage.css";
import { useState, useEffect } from "react";
import {toast} from 'react-toastify'
import {useNavigate, useParams } from "react-router-dom";
import { useContextData } from "../../context/context";
import { API_URI } from "../Api/Api";

const ItemDetailsPage = () => {
  const {user}=useContextData()
  const [produtsData, setProductsData] = useState([]);
  const [firmName,setFirmName]=useState('')
  const {id}=useParams()
  const navigateHome=useNavigate(null)

  useEffect(() => {
    axios.get(`${API_URI}/product/${id}/get-products`).then(res=>{
      setProductsData(res.data.products)
      setFirmName(res.data.firmName)
  }).catch(err=>toast.error(err.response.data.msg))
  }, []);

  const addToCart=(productId)=> {
    if(!user.username) {
      toast.warning('Login is required!')
      navigateHome('/')
    }
    axios.post(`${API_URI}/product/${productId}/add-to-cart`,{},{withCredentials:true}).then(res=>toast.success(res.data.msg)).catch(err=>toast.error(err.response.data?.msg))
  }
  return (
    <div className="container">
    <h3 className="bg-warning text-center mt-5 py-1 fw-bold">{firmName}</h3>
    {produtsData ? (
      produtsData.map((eachProduct) => {
        return (
          <div className="itemDetailContainer px-4" key={eachProduct._id}>
            <div className="itemContent">
              <h5>{eachProduct.name}</h5>
              <p>&#8377;{eachProduct.price}</p>
              <p>{eachProduct.description}</p>
            </div>
            <div className="addItemBox">
              <img
                src={eachProduct.image}
                alt={eachProduct.name}
                width="100px"
              />
              <button className="addBtn btn shadow btn-light" onClick={()=>addToCart(eachProduct._id)}>ADD</button>
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-center mt-3">
        <p className="fw-bold">This restaurent does not contain any items for now...</p>
        <p className="text-secondary">Please look for some other restuarent.</p>
      </div>
    )}
  </div>
    
  )
};

export default ItemDetailsPage;
