import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useUpdateSellerMutation } from "../../../store/api/sellerAuthApi";
import { setSellerUser } from "../../../store/slices/authSlice";

const inputClass =
  "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

const labelClass = (value) =>
  `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;


const SellerDetails = () => {
  const [name, setName] = useState("");
  const [holderName, setHolderName] = useState("");
  const [selected, setSelected] = useState(false);
  const [description, setDescription] = useState("");
  const [shipping, setShipping] = useState('');
  const [returnProductDay, setReturnProductDay] = useState('');
   const [profileImage, setProfileImage] = useState('');
const [previewImage, setPreviewImage] = useState('https://tse3.mm.bing.net/th/id/OIP.Ip2y_2_KabgvNaHIZhYoJgHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3');

  const [updateSeller, { isLoading, error }] = useUpdateSellerMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    // console.log(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      // console.log(imageUrl);
    }
  };

  const registerHandle = async () => {
    if(!name || !holderName) {
      return;
    }

    if(!selected){
      return;
    }

    const policies = {
      return_policy:returnProductDay,
      shipping_policy:shipping
    }
    // console.log('image :',profileImage);

    try {
      const formData = new FormData();
      formData.append("store_name", name);
      formData.append("mangerName", holderName);
      formData.append("store_description", description);
      formData.append("policies", policies);
      formData.append("store_image", profileImage);


      const response = await updateSeller(formData).unwrap();
      // console.log("update : ", response);
      dispatch(setSellerUser(response.user));
      navigate("/seller");
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
        <h1 className="font-medium text-gray-400">Supplier Details</h1>

        <div className='w-full flex items-center justify-center'>
            <div className='w-20 h-20 rounded-full relative bg-gray-600 overflow-hidden cursor-pointer'>
      <input
        type="file"
        accept="image/*"
        className='hidden'
        id="profile-upload"
        onChange={handleImageChange}
      />
      <label htmlFor="profile-upload" className='block w-full h-full'>
        <img
          src={previewImage ? previewImage : profileImage}
          alt="Profile"
          className='w-full h-full object-cover absolute top-0 left-0 cursor-pointer'
        />
      </label>
    </div>
           </div>

        <div className="w-full max-w-md py-1 flex flex-col gap-2">

          {/* Store Name Input */}
          <div className="relative">
            <input
              type="text"
              id="name"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
            <label htmlFor="name" className={labelClass(name)}>
              Store Name
            </label>
          </div>
          <p className="text-xs -mt-1 font-medium">Eg.Business Name,Trade Name,ect.</p>

          {/* Account Holder Name Input */}
          <div className="relative mt-5">
            <input
              type="text"
              id="holderName"
              placeholder=" "
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              className={inputClass}
            />
            <label htmlFor="holderName" className={labelClass(holderName)}>
              Your Full Name
            </label>
          </div>

          {/* Account Holder Name Input */}
          <div className="relative mt-5">
            <input
              type="text"
              id="description"
              placeholder=" "
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputClass}
            />
            <label htmlFor="description" className={labelClass(description)}>
              Store Description
            </label>
          </div>

          
        <div className="w-full flex items-center gap-8">
          {/* Pincode Field */}
          <div className="relative mt-4">
            <input
              type="text"
              id="returnProductDay"
              name="returnProductDay"
              value={returnProductDay}
              onChange={(e) => setReturnProductDay(e.target.value)}
              placeholder=" "
              className={inputClass}
              required
            />
            <label htmlFor="returnProductDay" className={labelClass(returnProductDay)}>
              Return policy (Day) 
            </label>
          </div>

            {/* City Field */}
            <div className="relative mt-4">
              <input
                type="text"
                id="shipping"
                name="shipping"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                placeholder=" "
                className={inputClass}
                required
              />
              <label htmlFor="shipping" className={labelClass(shipping)}>
                Shipping policy (Day)
              </label>
            </div>
        </div>

          {error && (
            <p>Error: {error.data?.message || "Registration failed"}</p>
          )}

          <p className="flex items-center gap-2 mt-25"> <input type="checkbox" checked={selected} onChange={()=>{setSelected(!selected)}} className="w-4 h-4 cursor-pointer" />I agree to comply with the <span className="text-purple-400">terms</span> and <span className="text-purple-400">conditions</span></p>
          <div
            onClick={() => {
              registerHandle();
              scrollTo(0, 0);
            }}
            className={` w-full text-center p-2 px-4 rounded-sm text-white font-medium  mt-2 ${selected  && holderName.length > 0 && name.length > 0 && description.length > 0 && shipping.length > 0 && returnProductDay.length > 0  ? "bg-purple-800 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
            disabled={isLoading}
          >
            Continue
          </div>
         
        </div>

      </div>
    </div>
  );
};

export default SellerDetails