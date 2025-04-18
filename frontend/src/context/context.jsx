import axios from "axios";
import { createContext,useContext,useEffect, useState} from "react";
import { API_URI } from "../components/Api/Api";

const StoreContext=createContext()

export const ContextProvider=({children})=> {
    const [user,setUser]=useState({})

    useEffect(()=> {
        axios.get(`${API_URI}/vendor/vendor-details`,{withCredentials:true}).then(res=>setUser(res.data.vendor)).catch(err=>console.log('User has not logged yet!'))
    },[])
    
    return <StoreContext.Provider value={{user,setUser}}>
        {children}
    </StoreContext.Provider>
}

export const useContextData=()=> {
    return useContext(StoreContext)
}