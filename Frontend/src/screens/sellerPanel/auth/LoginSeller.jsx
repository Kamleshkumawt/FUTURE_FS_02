import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setSellerUser } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useSellerLoginMutation } from "../../../store/api/seller/authApi";
import toast from "react-hot-toast";

const LoginSeller = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [sellerLogin, { isLoading, error }] = useSellerLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async() => {
    try{       
       const response = await sellerLogin({ phoneNumber:contact, password }).unwrap();
      //  console.log("Logged in user:", response);
        toast.success("Logged in Successfully!");
      localStorage.setItem("token", response.token);
       dispatch(setSellerUser(response.seller));
       navigate("/seller");

    }catch(err){
      console.error("Login error:", err);
    }
  };

  
  
  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center bg-[#fdecef] dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-medium mb-5">ApanaStore</h1>
      <div className=" w-full max-w-sm bg-white dark:bg-gray-900 rounded-sm overflow-hidden flex flex-col  gap-2">
        {/* <div className="w-full h-48">
          <img
            className="w-full h-full object-cover"
            src="https://images.meesho.com/images/marketing/1661417516766.webp"
            alt="img"
          />
        </div> */}
        <h1 className="font-medium text-xl p-5">Login to your supplier panel</h1>

        <div className="w-full px-5 py-5 flex flex-col gap-3">
    
           <div className="flex items-center gap-2 w-full">
            <div className="relative mb-5 w-full">
              <input
                type="text"
                id="contact"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder=" "
                className="peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
              />
              <label
                htmlFor="contact"
                className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
                  ${
                    contact
                      ? "top-1 text-xs text-purple-600"
                      : "top-3 text-base text-gray-400"
                  }
                  peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`}
              >
              Enter Mobile Number
              </label>
            </div>
          </div>

          {/* password Field */}
          <div className="relative mb-5">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              maxLength={50}
              className="peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
            />
            <label
              htmlFor="password"
              className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
            ${
              password
                ? "top-1 text-xs text-purple-600"
                : "top-3 text-base text-gray-400"
            }
            peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`}
            >
              Password
            </label>
          </div>
          {error && <p>Error: {error.data?.message || "Registration failed"}</p>}
          <div
             onClick={() => {handleLogin();scrollTo(0,0)}}
            className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer"
              disabled={isLoading}
          >
           Log in
          </div>
         {/* <div className="text-xs text-center text-gray-400 font-medium">Don't have an account? <span onClick={()=>{navigate('/SignUp');scrollTo(0,0)}} className="text-purple-400 cursor-pointer">Register</span></div> */}
        </div>
      </div>
      <div className="flex flex-col items-center w-full px-3">
        <div className="flex items-center w-full max-w-xs my-4">
  <span className="flex-grow border-b border-gray-500"></span>
  <span className="mx-3 text-gray-600 whitespace-nowrap">New to ApanaStore?</span>
  <span className="flex-grow border-b border-gray-500"></span>
</div>
<div onClick={()=>{navigate('/seller/SignUp');scrollTo(0,0)}} className="border border-purple-500 text-purple-500 p-2 px-4 rounded-sm w-full max-w-xs text-center focus-within:bg-purple-300 transition-all duration-300 cursor-pointer ">Create Your Account</div>
      </div>
    </div>
  );
};

export default LoginSeller;