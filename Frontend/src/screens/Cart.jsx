import CartBox from "../components/Cart";
import CartHeader from "../components/CartHeader";
import { Link } from "react-router-dom";
import { useGetToCartProductMutation } from "../store/api/userApi";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { setItemsAndPrice } from "../store/slices/productsFilterSlice";
import CartSidebar from "../components/CartSidebar";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const dispatch = useDispatch();
  const [getToCartProduct, { isLoading }] = useGetToCartProductMutation();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getToCartProduct().unwrap();
        // console.log("get to cart product", response);
        setCart(response.cart);
        
        const totalPrice =
          (
            (response.cart.items || [])
              .map((item) => item.productId.price * item.quantity)
              .reduce((acc, curr) => acc + curr, 0)
              .toFixed(2)
        )
        setTotalPrice(totalPrice);
        // setTotalPrice(
        //   (response.cart.items || [])
        //     .map((item) => item.productId.price * item.quantity)
        //     .reduce((acc, curr) => acc + curr, 0)
        // );

        dispatch(setItemsAndPrice({items:response.cart?.items?.length,price:totalPrice}))
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  return !isLoading ? (
    <div className="w-full min-h-screen">
      {/* <div className='w-full h-[70px] flex items-center justify-evenly px-20 py-2 border-b-2 border-gray-300'>
        <span className="text-2xl cursor-pointer">ApanaStore</span>
        <div>
          <div className='hidden sm:flex  items-center justify-center font-medium text-gray-300'>
          <div className='text-xs flex flex-col items-center gap-2'><span className='flex items-center justify-center border-2 border-purple-400 p-2 rounded-full w-2 h-2'>1</span>Cart</div>
          <span className='border border-gray-300 w-[6rem] mb-6'></span>
          <div className='text-xs flex flex-col items-center gap-2 -ml-3'><span className='flex items-center justify-center border-2 border-gray-400 p-2 rounded-full w-2 h-2'>2</span>address</div>
          <span className='border border-gray-300 w-[6rem] mb-6 -ml-3'></span>
          <div className='text-xs flex flex-col items-center gap-2 -ml-3'><span className='flex items-center justify-center border-2 border-gray-400 p-2 rounded-full w-2 h-2'>3</span>Payment</div>
          <span className='border border-gray-300 w-[6rem] mb-6 -ml-3'></span>
          <div className='text-xs flex flex-col items-center gap-2 -ml-3'><span className='flex items-center justify-center border-2 border-gray-400 p-2 rounded-full w-2 h-2'>4</span>Summary</div>
          </div>
  
        </div>
    </div> */}
      <CartHeader address={1} />
     {cart?.items?.length > 0 ? <div className="w-full h-full flex flex-col sm:flex-row items-start justify-center gap-3 p-3">
        <div className=" w-full sm:w-[60%] h-full flex flex-col items-end gap-2 sm:px-5 sm:border-r-2 sm:border-gray-200">
          <div className="space-y-3">
            <h1 className="text-lg font-medium text-gray-500 py-1 text-start w-full">
              Product Details
            </h1>
            {cart?.items?.map((item) => (
              <CartBox key={item._id} location={1} product={item} />
            ))}
          </div>
        </div>
        <div className="w-[40%] h-full flex flex-col items-start">
          {/* <div className="w-xs h-full flex flex-col items-start gap-3">
            <h1 className="text-lg font-medium text-gray-600 py-3">
              Price Details ({cart?.items?.length} Items)
            </h1>
            <p className="flex items-center w-full justify-between ">
              <span className="border-b-2 border-gray-700 border-dotted font-medium text-gray-500">
                Total Product Price{" "}
              </span>
              +{formatAmount(totalPrice)}
            </p>
            <div className="text-green-700 font-medium w-full flex items-center justify-between">
              <span className="border-b-2 border-gray-700 border-dotted ">
                Total Product Price{" "}
              </span>{" "}
              <span>- {discount}</span>
            </div>
            <span className="block w-full border-b-2 border-gray-300"></span>
            <h1 className="text-xl w-full font-medium flex items-center justify-between">
              {" "}
              Order Total <span>{formatAmount(totalPrice - discount)}</span>
            </h1>
            <div className="bg-green-300/30 w-full text-center p-2 px-4 rounded-sm mt-3 text-green-600">
              Yay! Your total discount is {discount}
            </div>
            <p className="text-xs text-gray-900 font-medium w-full text-center mt-3 -mb-1">
              Clicking on'Continue'will not deduct any money
            </p>
            <Link
              to="/cart/address"
              className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium"
            >
              Continue
            </Link>
            <img
              className="w-full h-full object-cover"
              src="https://images.meesho.com/images/marketing/1588578650850.webp"
              alt="img"
            />
          </div> */}
          <CartSidebar items={{length:cart?.items?.length, totalPrice}} nav={'address'} viewPage={1} />
        </div>
      </div> : (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-6">
          <h1 className="text-2xl font-medium text-gray-600">Your cart is empty</h1>
          <Link to='/' className="bg-purple-800 text-white font-medium px-4 py-2 rounded-sm">Shop Now</Link>
        </div>
      )}

      {/* {openSideBar && (
        <div className='w-full h-full absolute top-0 z-50 flex items-center justify-end bg-gray-900/80'>
          <div className='top-0 right-0 z-50 flex flex-col items-start w-[33%] h-full bg-white'>
          <div className='w-full p-6 font-medium flex items-center justify-between'>EDIT ITEM 
            <span>
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 cursor-pointer hover:text-red-600"
              onClick={()=> setOpenSideBar(false)}
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
          <span className='border border-gray-300 block w-full'></span>
            buttom
          <span className='border border-gray-300 block w-full'></span>
          <div className='w-full p-6 font-medium text-lg flex items-center justify-between'>Total Price
            <span>
              ₹301
            </span>
            </div>
          <span className='border border-gray-300 block w-full'></span>
          <div className='w-full p-4 font-medium text-lg flex items-center justify-between '>
            <button className='bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium'>Continue</button>
          </div>
          <span className='border border-gray-300 block w-full'></span>

        </div>
        </div>
    )} */}
    </div>
  ) : (
    <Loading />
  );
};

export default Cart;
