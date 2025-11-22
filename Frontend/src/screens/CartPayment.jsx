import React, { useState } from "react";
import CartHeader from "../components/user/cart/CartHeader";
import CartSidebar from "../components/user/cart/CartSidebar";
import { useSelector } from "react-redux";

const CartPayment = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const itemsAndPrice = useSelector((state) => state.filters.itemsAndPrice);

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 ">
      <CartHeader address={3} />
      <div className="w-full h-full flex flex-col sm:flex-row items-start justify-center gap-3 p-3">
        <div className=" w-full sm:w-[60%] h-full flex flex-col items-end gap-2 sm:px-5 sm:border-r-2 sm:border-gray-200">
          <div className="space-y-3 w-sm">
            <div className="text-lg font-semibold  py-1 w-full flex items-center ">
              Select Delivery Address
              {/* <span className='text-purple-600 cursor-pointer'> + ADD NEW ADDRESS</span> */}
            </div>
            {/* Cash on Delivery */}
      <div className="w-full rounded-sm flex items-center justify-between text-xl font-bold border gap-20 text-gray-600 dark:text-gray-300 border-purple-400 shadow-xs p-4">
        <div className="flex items-center gap-4">
          ₹1049 <span className="border-l border-gray-300 h-7"></span> Cash on Delivery
        </div>
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={() => setPaymentMethod("cod")}
          className="w-5 h-5 appearance-none border-2 border-gray-300 rounded-full bg-white checked:bg-pink-500 checked:border-white cursor-pointer focus:outline-none"
        />
      </div>

      {/* Pay Online */}
      <div className="w-full rounded-sm flex flex-col items-center border gap-1 text-gray-600 dark:text-gray-300 border-purple-400 shadow-xs">
        <div className="flex items-center justify-between w-full p-4">
          <div className="flex items-center gap-4 text-lg font-semibold">
            <div className="flex flex-col text-xl font-bold text-green-600">
              <span className="text-gray-500 dark:text-gray-400 line-through text-sm">₹1049</span>
              ₹980
              <span className="bg-green-300/40 text-xs text-center rounded-xs p-1">
                Save ₹79
              </span>
            </div>
            <span className="border-l border-gray-300 h-9"></span>
            Pay Online
          </div>
          <input
            type="radio"
            name="payment"
            value="online"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
            className="w-5 h-5 appearance-none border-2 border-gray-300 rounded-full bg-white checked:bg-pink-500 checked:border-white cursor-pointer focus:outline-none"
          />
        </div>
        <div className="font-medium text-gray-500 dark:text-gray-300 bg-purple-200/20 dark:bg-purple-400/20  w-full p-2 rounded-b-sm">
          Extra discount with bank offers
        </div>
      </div>
          </div>
        </div>
        <div className="w-[40%] h-full flex flex-col items-start">
          <CartSidebar items={{length:itemsAndPrice?.items, totalPrice:itemsAndPrice?.price}} nav={'summary'} viewPage={3} />
        </div>
      </div>
    </div>
  );
};

export default CartPayment;
