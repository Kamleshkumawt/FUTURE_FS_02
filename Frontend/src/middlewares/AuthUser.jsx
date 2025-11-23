import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Loading from '../components/Loading';
import { useDispatch } from 'react-redux';
import { setUser, setAdminUser, setSellerUser } from '../store/slices/authSlice';

const AuthUser = ({ children, allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

// Get the cookie
const token = localStorage.getItem('token');

// console.log("AuthUser Token:", token);


  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      console.error(e);
      return true;
    }
  };

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      dispatch(setUser(null));
      dispatch(setAdminUser(null));
      dispatch(setSellerUser(null));

      // Redirect based on allowedRoles
      if (allowedRoles?.includes('admin')) {
        navigate('/admin/selector/login', { replace: true });
      } else if (allowedRoles?.includes('seller')) {
        navigate('/sellerSignIn', { replace: true });
      } else {
        navigate('/signIn', { replace: true });
      }
      return;
    }

    // Decode token
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      navigate('/signIn', { replace: true });
      return;
    }

    // Block unauthorized access
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      if (decoded.role === 'admin') navigate('/admin', { replace: true });
      else if (decoded.role === 'seller') navigate('/seller', { replace: true });
      else navigate('/signIn', { replace: true });
      return;
    }

    // ✅ Everything fine, stop loading
    setLoading(false);
  }, [token, navigate, dispatch, allowedRoles]);

  if (loading) return <Loading />;

  return <>{children}</>;
};

export default AuthUser;
