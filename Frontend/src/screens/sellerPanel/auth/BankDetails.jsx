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


const BankDetails = () => {
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIFSCCode] = useState("");
  const [bankName, setBankName] = useState("");

  const [updateSeller, { isLoading, error }] = useUpdateSellerMutation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const registerHandle = async () => {

    if(!accountHolderName || !accountNumber || !confirmAccountNumber || !ifscCode) {
      return;
    }

    if(accountNumber !== confirmAccountNumber) {
      alert("Account number and confirm account number do not match");
      return;
    } 

    const bankDetails = {
      account_holder_name: accountHolderName,
      bank_name: bankName,
      account_number: accountNumber,
      confirmAccountNumber: confirmAccountNumber,
      ifsc_code: ifscCode,
    };

    try {
      const response = await updateSeller({bank_details:bankDetails}).unwrap();
      // console.log("update : ", response);
      dispatch(setSellerUser(response.user));
      navigate("/sellerSignUp/details");
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
        <h1 className="font-medium text-gray-400">Bank Details</h1>

        <p className="border border-amber-400 bg-amber-200 text-sm text-gray-800 p-1 px-3 rounded-sm">Bank account should be in the name of registered business name or trade as per GSTIN.</p>

        <div className="w-full max-w-xs py-1 flex flex-col gap-2">
           
          <div className="relative">
            <input
              type="text"
              id="accountHolderName"
              placeholder=" "
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              className={inputClass}
            />
            <label htmlFor="accountHolderName" className={labelClass(accountHolderName)}>
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
            <label htmlFor="accountNumber" className={labelClass(accountNumber)}>
              Account Number
            </label>
          </div>

          {/* confirm Account Number  Field */}
           <div className="relative">
            <input
              type="text"
              id="confirmAccountNumber"
              placeholder=" "
              value={confirmAccountNumber}
              onChange={(e) => setConfirmAccountNumber(e.target.value)}
              className={inputClass}
            />
            <label htmlFor="confirmAccountNumber" className={labelClass(confirmAccountNumber)}>
              confirm Account Number
            </label>
          </div>

          {/* IFSC Code  Field */}
          <div className="relative mt-4">
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
            Continue
          </div>
         
        </div>

      

      </div>
    </div>
  );
};

export default BankDetails