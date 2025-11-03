import { Routes, Route } from 'react-router-dom'
import Home from '../screens/Home'



const AppRouter = () => {
//    const location = useLocation();
//   const isCartRoute = location.pathname.startsWith("/cart");
//   const isSellerRoute = location.pathname.startsWith("/seller");
//   const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
       {/* {!isCartRoute && !isSellerRoute && !isAdminRoute && <Navbar />} */}
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<h1>About</h1>} />
        </Routes>

        {/* {!isCartRoute && !isSellerRoute && !isAdminRoute && <Footer />} */}
    </>
  )
}

export default AppRouter