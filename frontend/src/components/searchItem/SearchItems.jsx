import { useEffect,useState } from "react";
import axios from 'axios';
import { BeatLoader } from "react-spinners";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URI } from "../Api/Api";
import { useNavigate } from "react-router-dom";
import {useContextData} from '../../context/context'

const SearchItems=()=> {
  const navigateHome=useNavigate(null)
    const [produtsData, setProductsData] = useState([]);
    const [data,setData]=useState([]) 
    const {value}=useParams()
    const {user}=useContextData()

    useEffect(()=> {
      axios.get(`${API_URI}/product/search-products?itemName=${value}`).then(res=>setProductsData(res.data.filterdProducts)).catch(err=>toast.error(err.response.data?.msg))
    },[])

    const addToCart=(productId)=> {
      if(!user.username) {
        toast.warning('Login is required!')
        navigateHome('/')
      }
      axios.post(`${API_URI}/product/${productId}/add-to-cart`,{},{withCredentials:true}).then(res=>toast.success(res.data.msg)).catch(err=>toast.error(err.response.data?.msg))
    }

    return (
      <div className="container">
         <h3 className="bg-warning text-center mt-5 py-1 fw-semibold">Searched Items</h3>
            {produtsData?.length>0 ? (
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
                        width="100px"
                      />
                      <button className="addBtn btn shadow btn-light" onClick={()=>addToCart(eachProduct._id)}>ADD</button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center mt-3">
                <h4>No items found</h4>
                <p>Please look for some other items.</p>
              </div>
            )}
            {!produtsData && <h3 className="text-center text-danger">No Restaurants Found</h3>}
</div>
    )
}
export default SearchItems


           