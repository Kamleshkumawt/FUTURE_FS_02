// import { Navigate } from "react-router-dom";
// import { useAuthMeQuery } from "../../store/api/user/authApi";
// import { useSelector } from "react-redux";
// import Loading from "../Loading";

// const AuthUserLoader = ({ children }) => {
//   const { token, user, isAuthenticated } = useSelector((state) => state.auth);

//   const localToken = localStorage.getItem("token");
//   console.log("AuthUserLoader Token:", localToken);

//   const { isLoading } = useAuthMeQuery(undefined, {
//     skip: !localToken, // 🔥 FIXED
//   });

//   if (isLoading) return <Loading />;

//   console.log("AuthUserLoader - State:", { isAuthenticated, token, user });

//   // If token exists but user not yet stored → wait till user comes from API
//   if (!localToken || !isAuthenticated || !user) {
//     return <Navigate to="/signIn" replace />;
//   }

//   return <>{children}</>;
// };

// export default AuthUserLoader;

import { Navigate } from "react-router-dom";
import { useAuthMeQuery } from "../../store/api/user/authApi";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import { setCredentials, setUser } from "../../store/slices/authSlice";
import { useEffect } from "react";

const AuthUserLoader = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const token = localStorage.getItem("token");
  // console.log("AuthUserLoader Token:", token);

  const { data, isLoading, isError } = useAuthMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (data && token) {
      dispatch(setCredentials({ token, user: data.data }));
      dispatch(setUser(data.data));
    }
  }, [data, token, dispatch]);

  if (!token) return <Navigate to="/signIn" replace />;

  if (isLoading) return <Loading />;

  if (isError) {
    localStorage.removeItem("token");
    return <Navigate to="/signIn" replace />;
  }

  if (!user) return <Loading />;

  return <>{children}</>;
};

export default AuthUserLoader;

