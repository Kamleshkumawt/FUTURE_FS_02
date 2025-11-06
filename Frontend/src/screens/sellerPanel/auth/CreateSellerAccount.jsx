import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSellerUser } from "../../../store/slices/authSlice";
import { useSellerRegisterMutation } from "../../../store/api/seller/authApi";
import ThemeToggle from "../../../components/user/ThemeToggle";

const CreateSellerAccount = () => {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");

  const [sellerRegister, { isLoading, error }] =
    useSellerRegisterMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const registerHandle = async () => {
    if (!contact || !password) {
      return;
    }

    const isPhone = /^[0-9]{10}$/.test(contact);
    if (!isPhone) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    
    try {
      const response = await sellerRegister({phoneNumber: contact, password}).unwrap();
      console.log("Registered user:", response);
      localStorage.setItem("token", response.token);
      dispatch(setSellerUser(response.seller));
       navigate("/sellerSignUp/business");
    } catch (err) {
      console.error("Registration error:", err);
    }
  };


  return (
    <div className="h-screen w-full flex flex-col items-center justify-start bg-[#fdecef] dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100 p-5 px-10">
      <ThemeToggle/>
      <div className=" flex w-full items-center justify-between">
        <h1 className="text-purple-400 text-2xl font-medium">ApanaStore</h1>{" "}
        <div className="flex items-center gap-4">
          <span>Already a user?</span>
          <button
            onClick={() => {
              navigate("/seller/SignIn");
              scrollTo(0, 0);
            }}
            className="border border-purple-400 p-1 font-medium px-4 text-purple-400 rounded-sm cursor-pointer"
          >
            Login
          </button>
        </div>
      </div>
      <div className=" w-full max-w-md  rounded-sm overflow-hidden flex flex-col items-center  gap-1 mt-5">
        <h1 className="text-2xl font-medium">Welcome to ApanaStore</h1>
        <p className="text-gray-400 font-medium">
          Create your account to start selling
        </p>

        <div className="w-full max-w-xs py-1 flex flex-col gap-2">
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

          {error && (
            <p>Error: {error.data?.message || "Registration failed"}</p>
          )}
          <div
            onClick={() => {
              registerHandle();
              scrollTo(0, 0);
            }}
            className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer mt-20"
            disabled={isLoading}
          >
            Create Account
          </div>
          <div className="text-xs text-center text-gray-400 font-medium">
            <div className="text-gray-400 font-medium text-xs flex flex-col  mb-5 ">
              By continuing, you agree to ApanaStore's
              <p className="flex gap-1 items-center text-center justify-center">
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
      </div>
    </div>
  );
};

export default CreateSellerAccount;
