import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {useUserRegisterMutation } from "../store/api/user/authApi";
import { setUser } from "../store/slices/authSlice";

const Register = () => {
  const [contact, setContact] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [userRegister, {isLoading, error}] = useUserRegisterMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const registerHandle = async () => {
    
    if (!contact || !password || !name) {
      return;
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = /^[0-9]{10}$/.test(contact);
const payload = {
    name,
    password
};

if (isEmail) {
    payload.email = contact;
} else if (isPhone) {
    payload.phone = contact;
} else {
    // Handle error before even sending the request
    console.error("Invalid contact input");
    return;
}

   try {
      const response = await userRegister(payload).unwrap();
      // console.log("Registered user:", response);
      localStorage.setItem("token", response.token);
      dispatch(setUser(response.user));
      navigate('/');

    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="h-[110vh] w-full flex flex-col items-center justify-center bg-[#fdecef] dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100">
      <div className=" w-full max-w-md bg-white dark:bg-gray-900 rounded-sm overflow-hidden flex flex-col  gap-5 mt-30">
        <div className="w-full h-48">
          <img
            className="w-full h-full object-cover"
            src="https://images.meesho.com/images/marketing/1661417516766.webp"
            alt="img"
          />
        </div>

        <div className="w-full px-10 py-5 flex flex-col gap-2">
          {/* Contact Number Field */}

      
            <div className="relative mb-5">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
                  />

                  <label
                    htmlFor="name"
                    className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
            ${
              name
                ? "top-1 text-xs text-purple-600"
                : "top-3 text-base text-gray-400"
            }
            peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`} 
                  >
                    Name
                  </label>
                </div>
          {/* <div className="flex items-center gap-2 w-full">
            <div className="flex items-end gap-1 font-semibold border-b-2 border-gray-300 p-2 -mt-3 font-serif text-xs">
              IN <span className="font-sans text-base">+91</span>
            </div>
            <div className="relative mb-5 w-full">
              <input
                type="text"
                id="contact"
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder=" "
                 maxLength={10}
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
                Phone Number
              </label>
            </div>
          </div> */}
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
                Enter Email/Mobile Number
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
              className='"peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"'
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
             onClick={() => {registerHandle();scrollTo(0,0)}}
            className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer"
            disabled={isLoading}
          >
            Continue
          </div>
          <div className="text-xs text-center text-gray-400 font-medium">Already have an account? <span onClick={()=>{navigate('/SignIn');scrollTo(0,0)}} className="text-purple-400 cursor-pointer">Login</span></div>
        </div>
        <div className="text-gray-400 font-medium text-xs flex flex-col items-center mt-10 mb-5 ">
          By continuing, you agree to ApanaStore's
          <p className="flex gap-1 items-center">
            <span className="text-purple-500 cursor-pointer">
              Terms & Conditions{" "}
            </span>
            and
            <span className="text-purple-500 cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
