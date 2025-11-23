import React, { useState } from "react";
import Title from "../../components/sellerPanel/Title";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../../components/Loading";
import { useGetSellerByIdQuery, useUpdateSellerPasswordByAdminMutation, useUpdateSellerProfileByAdminMutation } from "../../store/api/admin/adminApi";
import {toast} from "react-hot-toast";

const inputClass =
  "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

const labelClass = (value) =>
  `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;

const EditSellerByAdmin = () => {
   const [name, setName] = useState("");
  const [holderName, setHolderName] = useState("");
  const [description, setDescription] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIFSCCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [gst, setGst] = useState("");
  const [sellerId, setSellerId] = useState("");

  const { id } = useParams();

  const { data, mainLoading } = useGetSellerByIdQuery(id, {
    skip: !id,
  });

  const [updateSellerProfileByAdmin, { isLoading, error }] =
    useUpdateSellerProfileByAdminMutation();
  const [updateSellerPassByAdmin, { loading, isError }] =
    useUpdateSellerPasswordByAdminMutation();

  const navigate = useNavigate();


  const updateHandle = async () => {
    const bankDetails = {
      accountHolderName: accountHolderName,
      bankName: bankName,
      accountNumber: accountNumber,
      ifscCode: ifscCode,
    };

    try {
      const data = {
        fullName: holderName,
        storeDescription: description,
        bankDetails: bankDetails,
        gstNumber: gst,
        storeName: name,
        sellerId: sellerId,
      }
      await updateSellerProfileByAdmin(data).unwrap();
      toast.success("Seller Profile updated successfully!");
      navigate("/admin/show/all-seller");
    } catch (err) {
      console.error("updated error:", err);
    }
  };

  const updatePassHandle = async () => {
    if (!oldPassword || !newPassword) {
      return;
    }

    if (oldPassword !== newPassword) {
      alert("New password must be same from confirm password");
      return;
    }

    try {
      await updateSellerPassByAdmin({
        oldPassword,
        newPassword,
        sellerId,
      }).unwrap();
      // console.log("update : ", response);
      toast.success("Seller Password updated successfully!");
      navigate("/admin/show/all-seller");
    } catch (err) {
      console.error("updated error:", err);
    }
  };

  useEffect(() => {
    if (data) {
      // console.log("data : ", data.seller);
      setName(data.seller.storeName);
      setHolderName(data.seller.fullName);
      setDescription(data.seller.storeDescription);
      setAccountHolderName(data.seller.bankDetails.accountHolderName);
      setBankName(data.seller.bankDetails.bankName);
      setAccountNumber(data.seller.bankDetails.accountNumber);
      setIFSCCode(data.seller.bankDetails.ifscCode);
      setGst(data.seller.gstNumber);
      setSellerId(data.seller._id);
    }
  }, [data]);

  return !mainLoading ? (
    <div>
      <Title text1={"Update Seller"} text2={"Profile"} />
      <div>
        <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3 mb-5">
          {/* mangerName Field */}
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

          {/* description Field */}
          <div className="relative">
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

          <div className="relative">
            <input
              type="text"
              id="accountHolderName"
              placeholder=" "
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className={inputClass}
            />
            <label
              htmlFor="accountHolderName"
              className={labelClass(accountHolderName)}
            >
              Account Holder Name
            </label>
          </div>

          {/* Bank Name  Field */}
          <div className="relative">
            <input
              type="text"
              id="bankName"
              placeholder=" "
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className={inputClass}
            />
            <label htmlFor="bankName" className={labelClass(bankName)}>
              Bank Name
            </label>
          </div>

          {/* Account Number  Field */}
          <div className="relative">
            <input
              type="text"
              id="accountNumber"
              placeholder=" "
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className={inputClass}
            />
            <label
              htmlFor="accountNumber"
              className={labelClass(accountNumber)}
            >
              Account Number
            </label>
          </div>

          {/* IFSC Code  Field */}
          <div className="relative ">
            <input
              type="text"
              id="ifscCode"
              value={ifscCode}
              onChange={(e) => setIFSCCode(e.target.value)}
              placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
              className={inputClass}
            />
            <label htmlFor="ifscCode" className={labelClass(ifscCode)}>
              IFSC Code
            </label>
          </div>

            {/*gst Field*/}
          <div className="relative ">
            <input
              type="text"
              id="gst"
              name="gst"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              placeholder=" "
               className={inputClass}
            />

            <label
              htmlFor="gst"
              className={labelClass(gst)}
            >
              GST
            </label>
          </div>
        </div>

        {error && <p>Error: {error.data?.message || "updated failed"}</p>}

        <div
          onClick={() => {
            updateHandle();
            scrollTo(0, 0);
          }}
          className={`max-w-xs w-full text-center p-2 px-4 rounded-sm text-white font-medium  mt-2 mb-10 ${
            holderName?.length > 0 || description.length > 0
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
            <label htmlFor="oldPassword" className={labelClass(oldPassword)}>
              New Password
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
            <label htmlFor="newPassword" className={labelClass(newPassword)}>
              Confirm Password
            </label>
          </div>
        </div>

        {isError && <p>Error: {isError.data?.message || "updated failed"}</p>}
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
  ) : (
    <Loading />
  );
};

export default EditSellerByAdmin;
