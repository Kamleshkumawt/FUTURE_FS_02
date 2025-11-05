import { Routes, Route } from 'react-router-dom'
import Home from '../screens/Home'
import Navbar from '../components/user/Navbar'
import Footer from '../components/user/Footer'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Layout from '../screens/sellerPanel/Layout'
import Dashboard from '../screens/sellerPanel/Dashboard'
import AddProduct from '../screens/sellerPanel/AddProduct'
import AddProductCategory from '../screens/sellerPanel/AddProductCategory'


const AppRouter = () => {
//    const location = useLocation();
  const isCartRoute = location.pathname.startsWith("/cart");
  const isSellerRoute = location.pathname.startsWith("/seller");
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
       {!isCartRoute && !isSellerRoute && !isAdminRoute && <Navbar />}
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signIn" element={<Login />} />
            <Route path="/signUp" element={<Register />} />
            <Route path="/about" element={<h1>About</h1>} />

            <Route path='/seller/*' element={<Layout/>} > 
                <Route index element={<Dashboard />} />
                <Route path="add-product" element={<AddProduct/>} />
                <Route path="new-category-product" element={<AddProductCategory/>} />
                {/* <Route path="edit-product/:id" element={<EditProduct/>} />
                <Route path="list-products" element={<ShowAllProduct/>} />
                <Route path="list-orders" element={<ShowAllOrders/>} />
                <Route path="list-del-orders" element={<ShowAllDeliveredOrders/>} />
                <Route path="list-ship-orders" element={<ShowAllShippedOrders/>} />
                <Route path="list-ret-orders" element={<ShowAllReturnsOrders/>} />
                <Route path="list-ret-stting" element={<SellerSettings/>} /> */}
            </Route>
        </Routes>

        {!isCartRoute && !isSellerRoute && !isAdminRoute && <Footer />}
    </>
  )
}

export default AppRouter