import { Routes, Route, useLocation } from 'react-router-dom'
import Home from '../screens/Home'
import Navbar from '../components/user/Navbar'
import Footer from '../components/user/Footer'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Layout from '../screens/sellerPanel/Layout'
import Dashboard from '../screens/sellerPanel/Dashboard'
import AddProduct from '../screens/sellerPanel/AddProduct'
import AddProductCategory from '../screens/sellerPanel/AddProductCategory'
import CreateSellerAccount from '../screens/sellerPanel/auth/CreateSellerAccount'
import LoginSeller from '../screens/sellerPanel/auth/LoginSeller'
import BusinessDetails from '../screens/sellerPanel/auth/BusinessDetails'
import PickupAddress from '../screens/sellerPanel/auth/PickupAddress'
import BankDetails from '../screens/sellerPanel/auth/BankDetails'
import SellerDetails from '../screens/sellerPanel/auth/SellerDetails'
import SellerSettings from '../screens/sellerPanel/SellerSettings'
import EditProduct from '../screens/sellerPanel/EditProduct'
import ShowAllProduct from '../screens/sellerPanel/ShowAllProduct'
import SearchCategoryRoutes from '../screens/SearchCategoryRoutes'
import ProductDetails from '../screens/ProductDetails'
import DeleteAccount from '../screens/DeleteAccount'
import Cart from '../screens/Cart'
import CartAddress from '../screens/CartAddress'
import CartPayment from '../screens/CartPayment'
import CartSummary from '../screens/CartSummary'


const AppRouter = () => {
   const location = useLocation();
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
            <Route path="/products/search" element={<SearchCategoryRoutes />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/account/delete" element={<DeleteAccount />} />
            <Route path="/seller/SignUp" element={<CreateSellerAccount />} />
            <Route path="/seller/SignIn" element={<LoginSeller />} />
            <Route path="/sellerSignUp/business" element={<BusinessDetails />} />
            <Route path="/sellerSignUp/address" element={<PickupAddress />} />
            <Route path="/sellerSignUp/bank-details" element={<BankDetails />} />
            <Route path="/sellerSignUp/details" element={<SellerDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/cart/address" element={<CartAddress />} />
            <Route path="/cart/payment" element={<CartPayment />} />
            <Route path="/cart/payment" element={<CartPayment />} />
            <Route path="/cart/summary" element={<CartSummary />} />
            <Route path='/seller/*' element={<Layout/>} > 
                <Route index element={<Dashboard />} />
                <Route path="add-product" element={<AddProduct/>} />
                <Route path="new-category-product" element={<AddProductCategory/>} />
                <Route path="edit-product/:id" element={<EditProduct/>} />
                <Route path="list-products" element={<ShowAllProduct/>} />
                {/*<Route path="list-orders" element={<ShowAllOrders/>} />
                <Route path="list-del-orders" element={<ShowAllDeliveredOrders/>} />
                <Route path="list-ship-orders" element={<ShowAllShippedOrders/>} />
                <Route path="list-ret-orders" element={<ShowAllReturnsOrders/>} />*/}
                <Route path="list-ret-stting" element={<SellerSettings/>} /> 
            </Route>
        </Routes>

        {!isCartRoute && !isSellerRoute && !isAdminRoute && <Footer />}
    </>
  )
}

export default AppRouter