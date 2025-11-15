import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useUpdateAddressMutation,
} from "../../../store/api/user/userApi";
import { useDispatch } from "react-redux";
import { setAddress } from "../../../store/slices/productsFilterSlice";

const CartAddressComponent = ({
  addr,
  isSelected,
  onSelect,
}) => {

  //   const [openSideBar, setOpenSideBar] = useState(false);
  const [openSideBarUpdated, setOpenSideBarUpdated] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [homeValue, setHomeValue] = useState("");
  const [areaValue, setAreaValue] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [place, setPlace] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateAddress, { isLoading }] = useUpdateAddressMutation();

  const inputClass =
    "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

  const labelClass = (value) =>
    `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;

  const handleSaveAddress = async (id) => {
    const address = {
      name,
      contact,
      label: homeValue,
      street: areaValue,
      postalCode: pincode,
      city,
      state: stateValue,
      famousPlaces: place,
      latitude: location?.latitude,
      longitude: location?.longitude,
      _id: id,
    };
    // console.log("address to save :", address);
    try {
      const response = await updateAddress({ address }).unwrap();
      // console.log("Address saved successfully:", response.user.address);
      dispatch(setAddress(response.user?.address));
      setOpenSideBarUpdated(false);
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  useEffect(() => {
    if (openSideBarUpdated && addr) {
      setName(addr.name || "");
      setContact(addr.contact || "");
      setHomeValue(addr.label || "");
      setAreaValue(addr.street || "");
      setPincode(addr.postalCode || "");
      setCity(addr.city || "");
      setStateValue(addr.state || "");
      setPlace(addr.famousPlaces || "");
    }
  }, [openSideBarUpdated, addr]);

  return (
    <>
      <div className="bg-purple-300/50 w-full h-45 rounded-sm flex flex-col items-start p-3">
        <div className="flex items-center justify-between w-full text-xl font-medium">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="selectedAddress"
              checked={isSelected}
              onChange={onSelect}
              className="w-5 h-5 rounded-full appearance-none bg-white border-2 border-gray-300 
                    checked:bg-pink-500 checked:border-white  cursor-pointer focus:outline-none"
            />
            <span>{addr?.name}</span>
          </div>
          <span
            onClick={() => setOpenSideBarUpdated(true)}
            className="text-purple-900/70 font-medium text-lg cursor-pointer"
          >
            EDIT
          </span>
        </div>

        <div className="flex flex-col gap-3 px-8">
          <p className="w-[30rem] mt-2">
            {addr?.label}, {addr?.street}, {addr?.city}, {addr?.state},
            {addr?.postalCode}
            {/* {addr.famousPlaces} */}
            <br />
            {/* Hanuman Chok , Gayatri Nagar, Ganeshpura, University Road,
                    Girwa, Udaipur District, Udaipur, Udaipur, Rajasthan, 313001 */}
          </p>
          <p>{addr?.contact}</p>
          <Link
            to="/cart/payment"
            onClick={() => {
              navigate("/cart/payment");
              localStorage.setItem("selAdd", JSON.stringify(addr?._id));
            }}
            className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium"
          >
            Deliver to this Address
          </Link>
        </div>
      </div>
      {openSideBarUpdated && (
        <div className="w-full h-full fixed left-0 top-0 z-50 flex items-center justify-end bg-gray-900/80 transition-all duration-200 ease-in-out">
          <div className="top-0 right-0 z-50 flex flex-col items-start justify-between w-[33%] h-full bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 ">
            <div className="w-full p-6 font-medium flex items-center justify-between border-b-2 border-gray-300">
              ADD DELIVERY ADDRESS
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 cursor-pointer hover:text-red-600"
                  onClick={() => setOpenSideBarUpdated(false)}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </div>
            <div className="w-full overflow-auto p-4">
              <div className="w-full p-1">
                <div className="w-full flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      fill="none"
                      // iconSize="20"
                      className="sc-dlfmHC bFsYwH"
                    >
                      <g>
                        <path fill="#fff" d="M0 .01h20v20H0z"></path>
                        <path
                          fill="#5580E6"
                          d="M14.593 20.01a8.2 8.2 0 0 1-3.113-.724 20.24 20.24 0 0 1-7.764-5.857A18.6 18.6 0 0 1 .59 8.175a8.1 8.1 0 0 1-.589-2.818A2.8 2.8 0 0 1 .925 3.2c.495-.455.957-.95 1.439-1.418a1.58 1.58 0 0 1 1.265-.496c.353.032.683.189.93.442.87.857 1.747 1.714 2.59 2.59a1.49 1.49 0 0 1-.06 2.23c-.481.495-.984.977-1.472 1.459-.174.18-.18.207-.087.441.407.883.944 1.7 1.593 2.424a15 15 0 0 0 3.347 3.018c.368.234.77.422 1.158.63.133.073.234 0 .328-.095l1.486-1.492a1.51 1.51 0 0 1 2.302 0c.817.803 1.62 1.613 2.43 2.423l.127.14a1.47 1.47 0 0 1 0 2.009c-.22.26-.482.488-.73.736-.247.248-.495.482-.722.743a2.8 2.8 0 0 1-2.256 1.024"
                        ></path>
                        <path
                          fill="#3A66CF"
                         
                          d="M9.397.482a.517.517 0 0 1 .56-.47c.848.073 1.682.26 2.48.557a10.73 10.73 0 0 1 7.115 8.517q.054.271.074.547a.517.517 0 1 1-1.032.075 4 4 0 0 0-.062-.455 9.7 9.7 0 0 0-6.438-7.708l-.012-.004a8.4 8.4 0 0 0-2.214-.499.517.517 0 0 1-.47-.56"
                       
                        ></path>
                        <path
                          fill="#3A66CF"
                        
                          d="M9.484 4.14a.517.517 0 0 1 .599-.42 7.21 7.21 0 0 1 5.84 5.82.517.517 0 1 1-1.017.183A6.18 6.18 0 0 0 9.903 4.74a.517.517 0 0 1-.42-.6"
                         
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="phone_svg__a">
                          <path fill="#fff" d="M0 .01h20v20H0z"></path>
                        </clipPath>
                      </defs>
                    </svg>
                    Contact Details
                  </h2>
                </div>
              

                {/* Name Field */}
                <div className="relative mb-5">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" "
                    className={inputClass} //"peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
                  />

                  <label htmlFor="name" className={labelClass(name)}>
                    Name
                  </label>
                </div>

                {/* Contact Number Field */}
                <div className="relative mb-5">
                  <input
                    type="text"
                    id="contact"
                    name="contact"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder=" "
                    className={inputClass}
                  />
                  <label htmlFor="contact" className={labelClass(contact)}>
                    Contact Number
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-semibold text-xl flex items-center gap-2 py-3 mt-1">
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                  >
                    <path fill="#fff" d="M0 0h20v20H0z"></path>
                    <path
                      fill="#3A66CF"
                      d="M15.257 17.828c0 1.202-2.289 2.172-5.098 2.172-2.81 0-5.098-.97-5.098-2.172.015-.16.087-.334.16-.464.506-.985 2.534-1.709 4.967-1.709s4.46.724 4.953 1.71c.072.13.116.303.116.463"
                    ></path>
                    <path
                      fill="#90B1FB"
                      d="M17.053 6.43C16.53-.043 10.116 0 10.116 0S3.67-.043 3.15 6.43C2.7 12.165 8.494 16.915 9.826 17.93a.45.45 0 0 0 .275.087.48.48 0 0 0 .275-.087c1.333-1.014 7.14-5.764 6.677-11.499m-6.937 3.288c-.536 0-1.058-.16-1.492-.45a2.6 2.6 0 0 1-1-1.201 2.7 2.7 0 0 1-.159-1.55c.102-.521.362-1 .739-1.376a2.7 2.7 0 0 1 2.925-.594c.493.203.913.55 1.217.985.29.45.449.97.449 1.492 0 .71-.275 1.39-.782 1.897a2.69 2.69 0 0 1-1.897.797"
                    ></path>
                  </svg>
                  Address
                </div>
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
                    House no./Building name
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
                    Road name / Area / Colony
                  </label>
                </div>
                {/* Pincode Number Field */}
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
                <div className="w-full flex items-center gap-8">
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
                </div>
                {/* Famous Place (Optional) Field */}
                <div className="relative my-4">
                  <input
                    type="text"
                    id="place"
                    name="place"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder=" "
                    className={inputClass}
                  />
                  <label htmlFor="place" className={labelClass(place)}>
                    Nearby Famous Place / Shop / School, etc. (Optional)
                  </label>
                </div>
              </div>
            </div>

            <div className="w-full p-4 font-medium text-lg flex items-center justify-between border-t-2 border-gray-300">
              <button
                onClick={() => handleSaveAddress(addr._id)}
                disabled={isLoading}
                className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer"
              >
                Save Address and Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartAddressComponent;
