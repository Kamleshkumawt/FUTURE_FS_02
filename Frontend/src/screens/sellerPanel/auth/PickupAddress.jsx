import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {  useUpdateSellerMutation } from "../../../store/api/sellerAuthApi";
import { setSellerUser } from "../../../store/slices/authSlice";

const inputClass =
  "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

const labelClass = (value) =>
  `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;

const PickupAddress = () => {
  const [homeValue, setHomeValue] = useState("");
  const [areaValue, setAreaValue] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [landmark, setLandmark] = useState(""); 

  const [updateSeller, { isLoading, error }] = useUpdateSellerMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const registerHandle = async () => {

    if(!homeValue || !areaValue || !pincode || !city || !stateValue || !landmark) {
      return;
    }

    const address = {
      label: homeValue,
      street: areaValue,
      postalCode: pincode,
      city: city,
      state: stateValue,
      famousPlaces: landmark,
    };
  
    try {
      const response = await updateSeller({store_address:address}).unwrap();
      console.log("updated :", response);
      dispatch(setSellerUser(response.user));
      navigate("/sellerSignUp/bank-details");
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
        <h1 className="font-medium text-gray-400">Pickup Address</h1>

        <p className="border border-amber-400 bg-amber-200 text-sm text-gray-800 p-1 px-3 rounded-sm">Products will be picked up from this location for delivery</p>

        <div className="w-full max-w-xs py-1 flex flex-col gap-2">
          {/* House Number Field */}
          <div className="relative">
            <input
              type="text"
              id="home"
              placeholder=" "
              value={homeValue}
              onChange={(e) => setHomeValue(e.target.value)}
              className={inputClass}
            />
            <label htmlFor="home" className={labelClass(homeValue)}>
              Room/Floor/Building Number
            </label>
          </div>

          {/* Road name/Area Field */}
          <div className="relative mt-4">
            <input
              type="text"
              id="area"
              value={areaValue}
              onChange={(e) => setAreaValue(e.target.value)}
              placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
              className={inputClass}
            />
            <label htmlFor="area" className={labelClass(areaValue)}>
              Street/Locality
            </label>
          </div>

          {/* Landmark  Field */}
          <div className="relative mt-4">
            <input
              type="text"
              id="landmark"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
              className={inputClass}
            />
            <label htmlFor="landmark" className={labelClass(landmark)}>
              Landmark
            </label>
          </div>
     

        <div className="w-full flex items-center gap-8">
          {/* Pincode Field */}
          <div className="relative mt-4">
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder=" "
              className={inputClass}
              required
            />
            <label htmlFor="pincode" className={labelClass(pincode)}>
              Pincode
            </label>
          </div>

            {/* City Field */}
            <div className="relative mt-4">
              <input
                type="text"
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder=" "
                className={inputClass}
                required
              />
              <label htmlFor="city" className={labelClass(city)}>
                City
              </label>
            </div>
        </div>
         {/* State Field */}
          <div className="relative mt-4">
            <input
              type="text"
              id="state"
              name="state"
              value={stateValue}
              onChange={(e) => setStateValue(e.target.value)}
              placeholder=" "
              required
              className={inputClass}
            />
            <label htmlFor="state" className={labelClass(stateValue)}>
              State
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
            className={` w-full text-center p-2 px-4 rounded-sm text-white font-medium  mt-20 ${homeValue.length > 0 && areaValue.length > 0 && pincode.length > 0 && city.length > 0 && stateValue.length > 0 && landmark.length > 0 ? "bg-purple-800 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
            disabled={isLoading}
          >
            Continue
          </div>
          </div>

      </div>
    </div>
  );
};

export default PickupAddress;
