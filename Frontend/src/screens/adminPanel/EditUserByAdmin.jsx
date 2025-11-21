import React, { useEffect, useState } from "react";
import Title from "../../components/sellerPanel/Title";
import { useNavigate, useParams } from "react-router-dom";

import Loading from "../../components/Loading";
import {
  useGetUserByIdQuery,
  useUpdateUserPasswordByAdminMutation,
  useUpdateUserProfileByAdminMutation,
} from "../../store/api/admin/adminApi";

const EditUserByAdmin = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { id } = useParams();

  const { data, mainLoading } = useGetUserByIdQuery(id, {
    skip: !id,
  });

  const [updateUserProfileByAdmin, { error, isLoading }] =
    useUpdateUserProfileByAdminMutation();
  const [updateUserPassByAdmin, { isError, loading }] =
    useUpdateUserPasswordByAdminMutation();

  const navigate = useNavigate();

  const handleSaveChanges = async () => {
    try {
      const data = {
        fullName: username,
        email,
        phone,
        userId: id,
      };

      //    formData.forEach((value, key) => {
      //   console.log(key + ':', value);
      // });

      await updateUserProfileByAdmin(data).unwrap();
      navigate("/admin/show/all-user");
      // console.log("Profile updated successfully:", response);
    } catch (error) {
      console.error("Save changes error:", error);
    }
  };

  const handleSaveChangesPass = async () => {
      if (!oldPassword || !newPassword) {
      return;
    }

    if (oldPassword !== newPassword) {
      alert("New password must be same from confirm password");
      return;
    }
    try {
      await updateUserPassByAdmin({ oldPassword, newPassword, userId: id }).unwrap();
      // console.log('Password updated successfully:', response);
      navigate("/admin/show/all-user");
    } catch (error) {
      console.error("Save changes error:", error);
    }
  };

  useEffect(() => {
    if (data) {
      // console.log("data : ", data.user);
    }
  }, [data]);

  const user = data?.user;

  return !mainLoading ? (
    <div>
      <Title text1={"Update User"} text2={"Profile"} />
      <div>
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3 mb-5"></div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              defaultValue={user?.fullName}
              // value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Mobile Number</label>
            <input
              type="tel"
              defaultValue={user?.phone}
              maxLength={10}
              // value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              defaultValue={user?.email}
              // value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        {error && <p>Error: {error.data?.message || "updated failed"}</p>}

        <div
          onClick={() => {
            handleSaveChanges();
            scrollTo(0, 0);
          }}
          className={`max-w-xs w-full text-center p-2 px-4 rounded-sm text-white font-medium  mt-2 mb-10 ${
            email || username || phone
              ? "bg-purple-800 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={isLoading}
        >
          Continue
        </div>

        <Title text1={"Update"} text2={"Password"} />
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="tel"
                maxLength={50}
                value={oldPassword}
                placeholder="Enter oldPassword"
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Confirm Password</label>
              <input
                type="text"
                value={newPassword}
                placeholder="Enter NewPassword"
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {isError && <p>Error: {isError.data?.message || "updated failed"}</p>}
        <div
          onClick={() => {
            handleSaveChangesPass();
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
  ) : (
    <Loading />
  );
};

export default EditUserByAdmin;
