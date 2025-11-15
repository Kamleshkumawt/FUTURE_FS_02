import React, { useState } from "react";
import { formatAmount } from "../../../lib/formatAmount";
import {
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../../../store/api/user/cartApi";

const sizes = ["S", "M", "L", "XL", "XXL"];

const Cart = ({ location, product }) => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [quantity, setQuantity] = useState(product?.quantity);
  const [selectedSize, setSelectedSize] = useState("Free Size");
  const [openRemoveProduct, setOpenRemoveProduct] = useState(false);

  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();
  const [removeCartItem, { loading }] = useRemoveCartItemMutation();

  const handleUpdateCart = async () => {
    try {
      const items = {
        _id: product?.productId._id,
        quantity: quantity,
        // size: selectedSize,
      };
      await updateCartItem( items ).unwrap();
      window.location.reload();
    } catch (err) {
      console.log("update cart error :", err);
    }
  };

  const handleCartRemove = async (productId) => {
    try {
      await removeCartItem( productId ).unwrap();
      window.location.reload();
    } catch (err) {
      console.log("deleted cart error :", err);
    }
  };

  return (
    <>
      <div className="border border-gray-300 dark:border-gray-500 rounded-sm min-w-lg">
        {location === 2 && (
          <>
            <div className="flex items-center p-2 text-gray-800 dark:text-gray-300">
              Estimated Delivery by Monday, 20th Oct
            </div>
            <span className=" block border-b border-gray-300 dark:border-gray-500 mt-1"></span>
          </>
        )}
        <div className="flex items-start gap-2 p-3">
          <div>
            <img
              className="w-20"
              src={product?.productId?.frontImage.url}
              alt="img"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <h1 className="text-lg w-full flex items-center justify-between gap-2">
              {product?.productId?.name}
              <button
                onClick={() => setOpenSideBar(true)}
                className="text-purple-900/70 dark:text-purple-500 font-medium cursor-pointer"
              >
                EDIT
              </button>
            </h1>
            <div className="flex items-center gap-1">
              {formatAmount(product?.productId?.price)}
              <span className="line-through text-xs">
                {formatAmount(product?.productId?.price)}
              </span>
              <span className="text-xs">
                {product?.productId?.discount.percentage}% Off
              </span>
            </div>
            <div className="flex items-center gap-3">
              Size: {product?.productId?.size}{" "}
              <div className="text-gray-500 dark:text-gray-300"> Qty: {product?.quantity}</div>
            </div>
            {location === 1 && (
              <div
                className="flex items-center cursor-pointer w-[6rem]"
                onClick={() => setOpenRemoveProduct(true)} // your function
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 group-hover:text-red-600"
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
                <span className="text-gray-500 dark:text-gray-300 font-medium ">REMOVE</span>
              </div>
            )}
          </div>
        </div>
        <span className=" block border-b border-gray-300 dark:border-gray-500 mt-2"></span>
        <div className="flex items-center justify-between p-2 text-gray-500 dark:text-gray-300">
          <span>Sold by: {product?.productId?.brand}</span>
          <span>Free Delivery</span>
        </div>
      </div>

      {openSideBar && (
        <div className="w-full h-full fixed left-0 top-0 z-50 flex items-center justify-end bg-gray-900/80 transition-all duration-200 ease-in-out">
          <div className="top-0 right-0 z-50 flex flex-col items-start w-[33%] h-full bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100   ">
            <div className="w-full p-6 font-medium flex items-center justify-between ">
              EDIT ITEM
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 cursor-pointer hover:text-red-600"
                  onClick={() => setOpenSideBar(false)}
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
            <span className="border border-gray-300 block w-full"></span>
            <div className="">
              <div className="flex items-start gap-2 p-3">
                <div>
                  <img
                    className="w-20"
                    src={product?.productId?.frontImage.url}
                    alt="img"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="text-lg flex items-center gap-2">
                    {product?.productId?.name}
                  </h1>
                  <div className="flex items-center gap-1">
                    {formatAmount(product?.productId?.price)}
                    <span className="line-through text-xs">
                      {formatAmount(product?.productId?.price)}
                    </span>
                    <span className="text-xs">
                      {product?.productId?.discount.percentage}% Off
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-3">
                      <label htmlFor="size" className="font-medium">
                        Size
                      </label>
                      <select
                        id="size"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="border border-gray-300 dark:border-gray-500 rounded px-1 py-1 focus:outline-none text-gray-600 dark:text-gray-300 font-semibold"
                      >
                        {/* <option value="">Select Size</option> */}
                        {sizes.map((size) => (
                          <option
                            key={size}
                            value={size}
                            className=" font-semibold"
                          >
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
          

                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-800 dark:text-gray-300 font-medium">Qty </span>
                      <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-500 rounded ">
                        <button
                          onClick={() =>
                            quantity > 1
                              ? setQuantity(quantity - 1)
                              : setQuantity(1)
                          }
                          className={`text-gray-900 px-2 hover:text-black bg-gray-100 dark:text-gray-200 dark:hover:text-gray-300 dark:bg-neutral-800 py-1 cursor-pointer ${
                            quantity === 1 && "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={quantity}
                          onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value));
                            setQuantity(val);
                          }}
                          className="w-12 text-center border-none focus:outline-none dark:text-gray-300"
                        />
                        <button
                          onClick={() =>
                            quantity < 10
                              ? setQuantity(quantity + 1)
                              : setQuantity(10)
                          }
                          className={`text-gray-900 px-2 hover:text-black bg-gray-100 dark:text-gray-200 dark:hover:text-gray-300 dark:bg-neutral-800 py-1 cursor-pointer ${
                            quantity === 10 && "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  {quantity >= 10 ? (
                    <div className="flex items-center font-medium text-red-700">
                      You can add up to 10 units in one order
                    </div>
                  ) : (
                    <div className="mt-2"></div>
                  )}
                </div>
              </div>
            </div>
            <span className="border border-gray-300 block w-full"></span>
            <div className="w-full p-6 font-medium text-lg flex items-center justify-between">
              Total Price
              <span>{formatAmount(quantity * product?.productId?.price)}</span>
            </div>
            <span className="border border-gray-300 block w-full"></span>
            <div className="w-full p-4 font-medium text-lg flex items-center justify-between ">
              <button
                onClick={() => handleUpdateCart(product?.productId._id)}
                disabled={isLoading}
                className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer"
              >
                Continue
              </button>
            </div>
            <span className="border border-gray-300 block w-full"></span>
          </div>
        </div>
      )}

      {openRemoveProduct && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 dark:text-gray-200 dark:bg-neutral-800  rounded-xs p-6">
            <span className="flex justify-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 cursor-pointer"
                onClick={() => setOpenRemoveProduct(false)}
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
            <h2 className="text-lg font-semibold mb-2 w-[22rem] mt-2">
              {product?.productId?.name}
            </h2>
            <p className="font-medium text-gray-500">
              Do you want to remove this product from cart?
            </p>
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setOpenRemoveProduct(false)}
                className="mr-2 px-4 py-2 font-medium text-purple-500 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  handleCartRemove(product?.productId._id);
                  setOpenRemoveProduct(false);
                  scrollTo(0, 0);
                }}
                disabled={loading}
                className="px-4 py-2 font-medium text-purple-500 cursor-pointer"
              >
                REMOVE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
