import React, { useEffect, useState } from "react";
import { formatAmount } from "../../../lib/formatAmount";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartQuery } from "../../../store/api/user/cartApi";
import { setAddress, setItemsAndPrice } from "../../../store/slices/productsFilterSlice";
import { useCreateOrderMutation } from "../../../store/api/user/orderApi";

const CartSidebar = ({ items, nav, viewPage, isClick,isLoading, paymentMethod }) => {
  const discount = 81;
  const navigate = useNavigate();
const [cart, setCart] = useState([]);
    const [address, setAddr] = useState();
  
    const dispatch = useDispatch();
    const  {data } = useGetCartQuery();

    const [createOrder,{loading}] = useCreateOrderMutation();

    const user = useSelector((state) => state.auth.user);
    const addr = useSelector((state) => state.filters.address);
  
  const handleCreateOrder = async () => {
    if (!address) {
      return;
    }

    if(!paymentMethod){
      return;
    }
    if(paymentMethod === "cod"){
      return;
    }

    try {
      const items = cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        thumbnail: item.productId.frontImage.url,
        sellerId: item.productId.sellerId,
        title: item.productId.name
      }));

      // console.log("Items for order:", items);
      // console.log("Selected address for order:", address);
      // console.log("Payment method for order:", paymentMethod);
      const res =  await createOrder({shipping_address:address, payment_method:paymentMethod, items}).unwrap();
      console.log("Order created successfully:", res);
      if(res.url){
        window.location.href = res.url;
      } else {
        navigate("/user/orders");
      }
      // navigate("/user/orders");
    } catch(error) {
      console.error("Error creating order:", error);
    }
  }

    useEffect(() => {
      if(data){
        // console.log("Cart data:", data);
        setCart(data.data);
        const totalPrice =
            (
              (data.data.items || [])
                .map((item) => item.productId.price * item.quantity)
                .reduce((acc, curr) => acc + curr, 0)
                .toFixed(2)
          )
        dispatch(setItemsAndPrice({items:data.data?.items?.length, price:totalPrice}))
      }
    }, [data, dispatch]);

      useEffect(() => {
      if (user?.address) {
        const selectedAddress = user.address.find(addr => addr._id === JSON.parse(localStorage.getItem('selAdd')));
        setAddr(selectedAddress);
        dispatch(setAddress(user.address));
      }
    }, [user]);

  useEffect(() => {
    if(addr?.length > 0){
        const selectedAddress = addr?.find(addr => addr._id === JSON.parse(localStorage.getItem('selAdd')));
        setAddr(selectedAddress || addr[0]);
        // console.log("Address in summary:", selectedAddress);
      }
  }, [addr]);
   

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
            disabled={loading}
           onClick={() => {
             if (viewPage === 3 && paymentMethod === "online_payment") {
               handleCreateOrder();
             } else {
               navigate(`/cart/${nav}`);
             }
           }}
            className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer z-10"
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
