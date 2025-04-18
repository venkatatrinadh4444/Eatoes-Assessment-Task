import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css'
import LandingPage from "./pages/landingPage/LandingPage"
import ItemDetailsPage from "./components/ItemDetailPage/ItemDetailsPage"
import { BrowserRouter,Routes,Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Cart from "./components/cartPage/Cart"
import PrivateRoute from "./privateRoute/privateRoute"
import SearchItems from "./components/searchItem/SearchItems"

const App=()=> {
  return (
      <BrowserRouter basename='/'>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/products/:id" element={<ItemDetailsPage/>}/>
        <Route path="/cart" element={<PrivateRoute>
          <Cart/>
        </PrivateRoute>}/>
        <Route path="/search/:value" element={<SearchItems/>}/>
      </Routes>
      <ToastContainer/>
      </BrowserRouter>
  )
}
export default App