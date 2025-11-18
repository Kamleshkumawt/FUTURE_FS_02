import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminUser } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRegisterAdminMutation } from "../../../store/api/admin/authApi";

const AdminRegister = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const navigate = useNavigate();
  const [registerAdmin, { isLoading, error }] = useRegisterAdminMutation();
  const dispatch = useDispatch();

  const handleLogin = async() => {
    try{       
       const response = await registerAdmin({ phone:contact, username, password }).unwrap();
      //  console.log("Logged in user:", response);
      localStorage.setItem("token", response.token);
       dispatch(setAdminUser(response.seller));
       navigate("/admin");

    }catch(err){
      console.error("creating error:", err);
    }
  };

  
  
  return (
    <div className="h-[100vh] w-full flex flex-col items-center justify-center bg-[#fdecef] dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-medium mb-5">ApanaStore</h1>
      <div className=" w-full max-w-sm bg-white dark:bg-neutral-950 rounded-sm overflow-hidden flex flex-col  gap-2">
        <h1 className="font-medium text-center text-xl p-5">Register to your Admin panel</h1>

        <div className="w-full px-5 py-5 flex flex-col gap-3">

          {/* Name Field */ }
           <div className="flex items-center gap-2 w-full">
            <div className="relative mb-5 w-full">
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder=" "
                className="peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
              />
              <label
                htmlFor="username"
                className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
                  ${
                    username
                      ? "top-1 text-xs text-purple-600"
                      : "top-3 text-base text-gray-400"
                  }
                  peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`}
              >
              Enter Full Name
              </label>
            </div>
          </div>

          {/* contact Field */ }
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
          Continue
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;