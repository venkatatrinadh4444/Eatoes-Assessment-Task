import { useContextData } from "../context/context";
import {toast} from 'react-toastify'
import { Navigate } from "react-router-dom";

const PrivateRoute=({children})=> {
    const {user}=useContextData()

    if(!user) {
        toast("Please login to view your cart items");
    }

    return !user?<Navigate to="/"/>:children
}
export default PrivateRoute