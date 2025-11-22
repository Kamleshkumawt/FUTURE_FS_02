import React from "react";
import { formatAmount } from "../../../lib/formatAmount";
import { Link, useNavigate } from "react-router-dom";

const CartSidebar = ({ items, nav, viewPage, isClick,
  isLoading, }) => {
  const discount = 81;
  const navigate = useNavigate();

  return (
    <div className="w-xs h-full flex flex-col items-start gap-3">
      <h1 className="text-lg font-medium text-gray-600 dark:text-gray-300 py-3">
        Price Details ({items?.length} Items)
      </h1>
      <p className="flex items-center w-full justify-between ">
        <span className="border-b-2 border-gray-700 border-dotted font-medium text-gray-500">
          Total Product Price{" "}
        </span>
        +{formatAmount(items.totalPrice)}
      </p>
      <div className="text-green-700 font-medium w-full flex items-center justify-between">
        <span className="border-b-2 border-gray-700 border-dotted ">
          Total Product Price{" "}
        </span>{" "}
        <span>- {discount}</span>
      </div>
      <span className="block w-full border-b-2 border-gray-300 dark:border-gray-500"></span>
      <h1 className="text-xl w-full font-medium flex items-center justify-between">
        {" "}
        Order Total <span>{formatAmount(items.totalPrice - discount)}</span>
      </h1>
      <div className="bg-green-300/30 w-full text-center p-2 px-4 rounded-sm mt-3 text-green-600">
        Yay! Your total discount is {discount}
      </div>
      {viewPage !== 2 && viewPage !== 4 ? (
        <>
          <p className="text-xs text-gray-900 font-medium w-full text-center mt-3 -mb-1">
            Clicking on'Continue'will not deduct any money
          </p>
          <button
            // to={`/cart/${nav}`}
            onClick={() => viewPage === 3 && navigate(`/cart/${nav}`)}
            className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer"
          >
            Continue
          </button>
          <img
            className="w-full h-full object-cover"
            src="https://images.meesho.com/images/marketing/1588578650850.webp"
            alt="img"
          />
        </>
      ) : null}
      {viewPage === 4 && (
         <button
            // to={`/cart/${nav}`}
            onClick={isClick}
            disabled={isLoading}
            className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer"
          >
            Place Order
          </button>
      )}
    </div>
  );
};

export default CartSidebar;
