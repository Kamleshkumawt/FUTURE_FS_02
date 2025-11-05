import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSellerUser } from "../../../store/slices/authSlice";
import { useUpdateSellerMutation } from "../../../store/api/sellerAuthApi";

const BusinessDetails = () => {
  const [gst, setGst] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [updateSeller, { isLoading, error }] = useUpdateSellerMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const registerHandle = async () => {
    if (!gst) {
      return;
    }

    try {
      const response = await updateSeller({ gst_number : gst }).unwrap();
      // console.log("updated :", response);
      dispatch(setSellerUser(response.seller));
      navigate("/sellerSignUp/address");
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-start bg-[#fdecef] p-5 px-10">
      <div className=" flex w-full items-center justify-start">
        <h1 className="text-purple-400 text-2xl font-medium">ApanaStore</h1>
      </div>
      <div className=" w-full max-w-md  rounded-sm overflow-hidden flex flex-col items-center  gap-1 mt-5">
        <h1 className="text-2xl font-medium">Welcome to ApanaStore</h1>
        <h1 className="font-medium text-gray-400">Business Details</h1>

        <div className="w-full max-w-xs py-1 flex flex-col gap-2">
          <p className="font-medium ">Do you have a GST number?</p>
          <div className="flex items-center gap-2">
            <div
              className={`rounded-xs bg-gray-50 border border-gray-200 p-2 pb-6 ${
                selectedAddress === 1 ? "bg-purple-200" : ""
              }`}
            >
              <div className="flex items-center space-x-3 ">
                <input
                  type="checkbox"
                  name="selectedAddress"
                  checked={selectedAddress === 1}
                  onChange={() => setSelectedAddress(1)}
                  className="w-5 h-5 rounded-full appearance-none bg-white border-2 border-gray-300 
                    checked:bg-pink-500 checked:border-white  cursor-pointer focus:outline-none"
                />
                <span>Yes</span>
              </div>
              <p className="text-xs min-w-40">
                Enter your GSTIN and sell anywhere easily
              </p>
            </div>

            <div
              className={`rounded-xs bg-gray-50 border border-gray-200 p-2 ${
                selectedAddress === 2 ? "bg-purple-200" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="selectedAddress"
                  checked={selectedAddress === 2}
                  onChange={() => setSelectedAddress(2)}
                  className="w-5 h-5 rounded-full appearance-none bg-white border-2 border-gray-300 
                    checked:bg-pink-500 checked:border-white  cursor-pointer focus:outline-none"
                />
                <span>No</span>
              </div>
              <p className="text-xs min-w-40 flex flex-col">
                Worry not, you can sell without GST
                <span className="text-green-600 font-medium">
                  Get EID in mins ⚡
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between h-70 w-full">
            {selectedAddress === 1 && (
              <div className="flex items-center gap-3 w-full mt-10">
                <div className="relative w-full">
                  <input
                    type="text"
                    id="gst"
                    name="gst"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    placeholder=" "
                    className="peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
                  />

                  <label
                    htmlFor="gst"
                    className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
            ${
              gst
                ? "top-1 text-xs text-purple-600"
                : "top-3 text-base text-gray-400"
            }
            peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`}
                  >
                    GST
                  </label>
                </div>
                <button
                onClick={()=> setIsAuthenticated(true)}
                  className={` p-2 px-4  font-medium rounded-sm test-sm text-white ${
                    gst.length > 0
                      ? "cursor-pointer bg-purple-600 hover:scale-105 transition-transform"
                      : "cursor-not-allowed bg-gray-300"
                  }`}
                >
                  Verify
                </button>
              </div>
            )}

            {error && (
              <p>Error: {error.data?.message || "Registration failed"}</p>
            )}

            {selectedAddress === 2 && (
              <div className=" w-full flex items-center gap-2 bg-gray-200 p-1 px-3 text-sm mt-10">
                create it directly through the{" "}
                <a href="https://reg.gst.gov.in/registration/generateuid" className="flex items-center gap-2 text-blue-500 hover:underline cursor-pointer">
                  GST website
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="#3C29B7"
                  >
                    <path
                      d="M13.3333 7.33333C13.1565 7.33333 12.987 7.40357 12.8619 7.5286C12.7369 7.65362 12.6667 7.82319 12.6667 8V12C12.6667 12.1768 12.5964 12.3464 12.4714 12.4714C12.3464 12.5964 12.1768 12.6667 12 12.6667H4C3.82319 12.6667 3.65362 12.5964 3.5286 12.4714C3.40357 12.3464 3.33333 12.1768 3.33333 12V4C3.33333 3.82319 3.40357 3.65362 3.5286 3.5286C3.65362 3.40357 3.82319 3.33333 4 3.33333H8C8.17681 3.33333 8.34638 3.2631 8.4714 3.13807C8.59643 3.01305 8.66667 2.84348 8.66667 2.66667C8.66667 2.48986 8.59643 2.32029 8.4714 2.19526C8.34638 2.07024 8.17681 2 8 2H4C3.46957 2 2.96086 2.21071 2.58579 2.58579C2.21071 2.96086 2 3.46957 2 4V12C2 12.5304 2.21071 13.0391 2.58579 13.4142C2.96086 13.7893 3.46957 14 4 14H12C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V8C14 7.82319 13.9298 7.65362 13.8047 7.5286C13.6797 7.40357 13.5101 7.33333 13.3333 7.33333Z"
                      fill="#3C29B7"
                    ></path>
                    <path
                      d="M10.6668 3.33333H11.7201L7.52679 7.52C7.4643 7.58198 7.41471 7.65571 7.38086 7.73695C7.34702 7.81819 7.32959 7.90533 7.32959 7.99333C7.32959 8.08134 7.34702 8.16848 7.38086 8.24972C7.41471 8.33096 7.4643 8.40469 7.52679 8.46667C7.58876 8.52915 7.6625 8.57875 7.74374 8.61259C7.82498 8.64644 7.91211 8.66387 8.00012 8.66387C8.08813 8.66387 8.17527 8.64644 8.25651 8.61259C8.33775 8.57875 8.41148 8.52915 8.47346 8.46667L12.6668 4.28V5.33333C12.6668 5.51014 12.737 5.67971 12.8621 5.80474C12.9871 5.92976 13.1566 6 13.3335 6C13.5103 6 13.6798 5.92976 13.8049 5.80474C13.9299 5.67971 14.0001 5.51014 14.0001 5.33333V2.66667C14.0001 2.48986 13.9299 2.32029 13.8049 2.19526C13.6798 2.07024 13.5103 2 13.3335 2H10.6668C10.49 2 10.3204 2.07024 10.1954 2.19526C10.0704 2.32029 10.0001 2.48986 10.0001 2.66667C10.0001 2.84348 10.0704 3.01305 10.1954 3.13807C10.3204 3.2631 10.49 3.33333 10.6668 3.33333Z"
                      fill="#3C29B7"
                    ></path>
                  </svg>
                </a>
              </div>
            )}
          </div>
          <div
            onClick={() => {
              registerHandle();
              scrollTo(0, 0);
            }}
            className={` w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer mt-20 ${
              isAuthenticated
                ? "cursor-pointer bg-purple-800 "
                : "cursor-not-allowed bg-gray-300"
            } `}
            disabled={isLoading}
          >
            Continue
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
