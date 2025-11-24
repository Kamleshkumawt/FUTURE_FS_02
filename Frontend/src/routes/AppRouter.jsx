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
import CategoryProduct from '../screens/CategoryProduct'
import Order from '../screens/Order'
import ShowAllPendingOrders from '../screens/sellerPanel/ShowAllPendingOrders'
import ShowAllDeliveredOrders from '../screens/sellerPanel/ShowAllDeliveredOrders'
import ShowAllCancelledOrders from '../screens/sellerPanel/ShowAllCancelledOrders'
import ShowAllShippedOrders from '../screens/sellerPanel/ShowAllShippedOrders'
import ReviewOrder from '../screens/ReviewOrder'
import AdminLayout from '../screens/adminPanel/Layout'
import AdminLogin from '../screens/adminPanel/auth/AdminLogin'
import AdminRegister from '../screens/adminPanel/auth/AdminRegister'
import AdminDashboard from '../screens/adminPanel/AdminDashboard'
import AdminUpdate from '../screens/adminPanel/AdminUpdate'
import EditProductByAdmin from '../screens/adminPanel/EditProductByAdmin'
import ShowAllBlockedUser from '../screens/adminPanel/ShowAllBlockedUser'
import ShowAllBlockedSeller from '../screens/adminPanel/ShowAllBlockedSeller'
import ShowAllProducts from '../screens/adminPanel/ShowAllProducts'
import ShowAllCategories from '../screens/adminPanel/ShowAllCategories'
import ShowAllOrdersAdmin from '../screens/adminPanel/ShowAllOrders'
import ShowAllUsers from '../screens/adminPanel/ShowAllUsers'
import ShowAllSellers from '../screens/adminPanel/ShowAllSellers'
import AddCategory from '../screens/adminPanel/AddCategory'
import EditOrderDetails from '../screens/adminPanel/EditOrderDetails'
import EditUserByAdmin from '../screens/adminPanel/EditUserByAdmin'
import EditSellerByAdmin from '../screens/adminPanel/EditSellerByAdmin'
import EditCategory from '../screens/adminPanel/EditCategory'
import { Toaster } from 'react-hot-toast';
import AuthUserLoader from "../components/user/AuthUserLoader";
import AuthUser from '../middlewares/AuthUser'
import NotFound from '../screens/NotFound'


const AppRouter = () => {
   const location = useLocation();
  const isCartRoute = location.pathname.startsWith("/cart");
  const isSellerRoute = location.pathname.startsWith("/seller");
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
       {!isCartRoute && !isSellerRoute && !isAdminRoute && <Navbar />}
       <Toaster/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signIn" element={<Login />} />
            <Route path="/signUp" element={<Register />} />
            <Route path="/about" element={<h1>About</h1>} />

            <Route path="/products/search" element={<SearchCategoryRoutes />} />
            <Route path="/category/search/:categoryName" element={<CategoryProduct />} />
            <Route path="/product/:id" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><ProductDetails /></AuthUserLoader></AuthUser>} />
            <Route path="/account/delete" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><DeleteAccount /></AuthUserLoader></AuthUser>} />
            <Route path="/user/orders" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><Order /></AuthUserLoader></AuthUser>} />
            <Route path="/user/revieworder/:id" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><ReviewOrder /></AuthUserLoader></AuthUser>} />
            <Route path="/cart" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><Cart /></AuthUserLoader></AuthUser>} />
            <Route path="/cart/address" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><CartAddress /></AuthUserLoader></AuthUser>} />
            <Route path="/cart/payment" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><CartPayment /></AuthUserLoader></AuthUser>} />
            <Route path="/cart/payment" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><CartPayment /></AuthUserLoader></AuthUser>} />
            <Route path="/cart/summary" element={<AuthUser allowedRoles={['user']}><AuthUserLoader><CartSummary /></AuthUserLoader></AuthUser>} />

            <Route path="/seller/SignUp" element={<CreateSellerAccount />} />
            <Route path="/seller/SignIn" element={<LoginSeller />} />

            <Route path="/sellerSignUp/business" element={<AuthUser allowedRoles={['seller']}><AuthUserLoader><BusinessDetails /></AuthUserLoader></AuthUser>} />
            <Route path="/sellerSignUp/address" element={<AuthUser allowedRoles={['seller']}><AuthUserLoader><PickupAddress /></AuthUserLoader></AuthUser>} />
            <Route path="/sellerSignUp/bank-details" element={<AuthUser allowedRoles={['seller']}><AuthUserLoader><BankDetails /></AuthUserLoader></AuthUser>} />
            <Route path="/sellerSignUp/details" element={<AuthUser allowedRoles={['seller']}><AuthUserLoader><SellerDetails /></AuthUserLoader></AuthUser>} />

            <Route path='/seller/*' element={<AuthUser allowedRoles={['seller']}><Layout/></AuthUser>} > 
                <Route index element={<Dashboard />} />
                <Route path="add-product" element={<AddProduct/>} />
                <Route path="new-category-product" element={<AddProductCategory/>} />
                <Route path="edit-product/:id" element={<EditProduct/>} />
                <Route path="list-products" element={<ShowAllProduct/>} />
                <Route path="list-orders" element={<ShowAllPendingOrders/>} />
                <Route path="list-del-orders" element={<ShowAllDeliveredOrders/>} />
                <Route path="list-ship-orders" element={<ShowAllShippedOrders/>} />
                <Route path="list-canc-orders" element={<ShowAllCancelledOrders/>} />
                <Route path="list-ret-stting" element={<SellerSettings/>} /> 
            </Route>
            
            <Route path="/admin/selector/login" element={<AdminLogin />} />
            <Route path="/admin/selector/register" element={<AdminRegister />} />

            <Route path='/admin/*' element={<AuthUser allowedRoles={['admin']}><AdminLayout/> </AuthUser>} > 
                <Route index element={<AdminDashboard />} />  
                <Route path="ret-stting" element={<AdminUpdate />} />
                <Route path="ret-edit/:id" element={<EditProductByAdmin />} />
                <Route path="show/all-user" element={<ShowAllUsers />} />
                <Route path="show/all-blocked-user" element={<ShowAllBlockedUser />} />
                <Route path="show/all-seller" element={<ShowAllSellers />} />
                <Route path="show/all-blocked-seller" element={<ShowAllBlockedSeller />} />
                <Route path="show/all-products" element={<ShowAllProducts />} />
                <Route path="show/all-orders" element={<ShowAllOrdersAdmin />} />
                <Route path="show/all-categories" element={<ShowAllCategories />} />
                <Route path="order/details/:id" element={<EditOrderDetails />} />
                <Route path="user/details/:id" element={<EditUserByAdmin />} />
                <Route path="seller/details/:id" element={<EditSellerByAdmin />} />
                <Route path="add-category" element={<AddCategory />} />  
                <Route path="category/update/:id" element={<EditCategory />} />  
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>

        {!isCartRoute && !isSellerRoute && !isAdminRoute && <Footer />}
    </>
  )
}

export default AppRouter