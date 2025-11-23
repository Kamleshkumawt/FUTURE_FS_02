import React, { useState } from "react";
import Title from "../../components/sellerPanel/Title";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { setAdminUser } from "../../store/slices/authSlice";
import { useUpdateAdminDetailsMutation,useChangeAdminPasswordMutation } from "../../store/api/admin/authApi";
import {toast} from "react-hot-toast";

const inputClass =
  "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

const labelClass = (value) =>
  `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;

const AdminUpdate = () => {
  const [holderName, setHolderName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(
    "https://tse3.mm.bing.net/th/id/OIP.Ip2y_2_KabgvNaHIZhYoJgHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
  );

  const [updateAdminDetails, { isLoading, error }] = useUpdateAdminDetailsMutation();
  const [changeAdminPassword, { loading, isError }] = useChangeAdminPasswordMutation();

  // const navigate = useNavigate();

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

  const updateHandle = async () => {
    try {
      const formData = new FormData();
      formData.append("username", holderName);
      formData.append("profileImage", profileImage);
      
      const response = await updateAdminDetails(formData).unwrap();
      // console.log("update : ", response);
      toast.success("Profile updated successfully!");
      dispatch(setAdminUser(response.data));
      // navigate("/admin");
      setHolderName("");
      setProfileImage("");
    } catch (err) {
      console.error("updated error:", err);
    }
  };

  const updatePassHandle = async () => {
    if (!oldPassword || !newPassword) {
      return;
    }

    if (oldPassword === newPassword) {
      alert("New password must be different from old password");
      return;
    }
   
    try {
     await changeAdminPassword({ oldPassword, newPassword}).unwrap();
      // console.log("update : ", response);
      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      // navigate("/admin");
    } catch (err) {
      console.error("updated error:", err);
    }
  };

  return (
    <div>
      <Title text1={"Update"} text2={"Profile"} />
      <div>
        <div className="w-full flex items-center justify-start mt-10">
          <div className="w-20 h-20 rounded-full relative bg-gray-600 overflow-hidden cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-upload"
              onChange={handleImageChange}
            />
            <label htmlFor="profile-upload" className="block w-full h-full">
              <img
                src={previewImage ? previewImage : profileImage}
                alt="Profile"
                className="w-full h-full object-cover absolute top-0 left-0 cursor-pointer"
              />
            </label>
          </div>
        </div>
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3 mb-5">
          {/* username Field */}
          <div className="relative">
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

        </div>

        {error && (
            <p>Error: {error.data?.message || "updated failed"}</p>
          )}

          <div
            onClick={() => {
              updateHandle();
              scrollTo(0, 0);
            }}
            className={`max-w-xs w-full text-center p-2 px-4 rounded-sm text-white font-medium  mt-2 mb-10 ${
               (holderName.length > 0 || profileImage)
                ? "bg-purple-800 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={isLoading}
          >
            Continue
          </div>

          <Title text1={"Update"} text2={"Password"} />
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
           {/* password Field */}
          <div className="relative">
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder=" "
              maxLength={50}
              className={inputClass}
            />
            <label
              htmlFor="oldPassword"
              className={labelClass(oldPassword)}
            >
              Old Password
            </label>
          </div>

           {/* password Field */}
          <div className="relative">
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder=" "
              maxLength={50}
               className={inputClass}
            />
            <label
              htmlFor="newPassword"
              className={labelClass(newPassword)}
            >
             New Password
            </label>
          </div>


        </div>

        {isError && (
            <p>Error: {isError.data?.message || "updated failed"}</p>
          )}
          <div
            onClick={() => {
              updatePassHandle();
              scrollTo(0, 0);
            }}
            className={` w-full max-w-xs text-center p-2 px-4 rounded-sm text-white font-medium  mt-5 ${
              oldPassword.length > 0 && newPassword.length > 0
                ? "bg-purple-800 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={loading}
          >
            Continue
          </div>
      </div>
    </div>
  );
};

export default AdminUpdate;