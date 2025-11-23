import { Navigate } from "react-router-dom";
import { useAuthMeQuery } from "../../store/api/user/authApi";
import { useSelector } from "react-redux";
import Loading from "../Loading";

const AuthUserLoader = ({ children }) => {
  const { token, user, isAuthenticated } = useSelector((state) => state.auth);

  const localToken = localStorage.getItem("token");
  console.log("AuthUserLoader Token:", localToken);

  const { isLoading } = useAuthMeQuery(undefined, {
    skip: !localToken, // 🔥 FIXED
  });

  if (isLoading) return <Loading />;

  console.log("AuthUserLoader - State:", { isAuthenticated, token, user });

  // If token exists but user not yet stored → wait till user comes from API
  if (!localToken || !isAuthenticated || !user) {
    return <Navigate to="/signIn" replace />;
  }

  return <>{children}</>;
};

export default AuthUserLoader;
