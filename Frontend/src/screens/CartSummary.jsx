import React, { useEffect, useState } from 'react'
import CartBox from '../components/user/cart/Cart'
import CartHeader from '../components/user/cart/CartHeader'
import { useDispatch, useSelector } from 'react-redux';
import { setAddress, setItemsAndPrice } from '../store/slices/productsFilterSlice';
import CartSidebar from '../components/user/cart/CartSidebar';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-dom';
import CartAddressSummary from '../components/user/cart/CartAddressSummary';
import { useGetCartQuery } from '../store/api/user/cartApi';
import { useCreateOrderMutation } from '../store/api/user/orderApi';

const CartSummary = () => {
  const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [address, setAddr] = useState();
    const [openSideBarUpdated, setOpenSideBarUpdated] = useState(false);
  
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const  {data, isLoading } = useGetCartQuery();

    const [createOrder,{loading}] = useCreateOrderMutation();

    const user = useSelector((state) => state.auth.user);
    const addr = useSelector((state) => state.filters.address);
  
  const handleCreateOrder = async () => {
    try {
      const items = cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
        thumbnail: item.productId.frontImage.url,
        sellerId: item.productId.sellerId,
        title: item.productId.name
      }));
      
      const res =  await createOrder({shipping_address:address, payment_method:"cash_on_delivery", items}).unwrap();
      // console.log("Order created successfully:", res);
      window.location.href = res.url;
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
          setTotalPrice(totalPrice);
        dispatch(setItemsAndPrice({items:data.data?.items?.length, price:totalPrice}))
      }

      // const fetchCart = async () => {
      //   try {
      //     // const response = await getToCartProduct().unwrap();
      //     // console.log("get to cart product", response);
      //     setCart(response.cart);
          
      //     const totalPrice =
      //       (
      //         (response.cart.items || [])
      //           .map((item) => item.productId.price * item.quantity)
      //           .reduce((acc, curr) => acc + curr, 0)
      //           .toFixed(2)
      //     )
      //     setTotalPrice(totalPrice);
      //     // setTotalPrice(
      //     //   (response.cart.items || [])
      //     //     .map((item) => item.productId.price * item.quantity)
      //     //     .reduce((acc, curr) => acc + curr, 0)
      //     // );
  
      //     dispatch(setItemsAndPrice({items:response.cart?.items?.length,price:totalPrice}))
      //   } catch (error) {
      //     console.error("Error fetching cart:", error);
      //   }
      // };
  
      // fetchCart();
    }, [data, dispatch]);

      useEffect(() => {
      if (user?.address) {
        const selectedAddress = user.address.find(addr => addr._id === JSON.parse(localStorage.getItem('selAdd')));
        // console.log("Selected address:", selectedAddress);
        setAddr(selectedAddress);
        dispatch(setAddress(user.address));
        // console.log("User address:", user.address);
        // setAddress(user.address.filter(addr => addr._id === JSON.parse(localStorage.getItem('selAdd'))));
        // console.log("User address:", user.address);
      }
    }, [user]);

  useEffect(() => {
    if(addr?.length > 0){
        const selectedAddress = addr?.find(addr => addr._id === JSON.parse(localStorage.getItem('selAdd')));
        setAddr(selectedAddress || addr[0]);
        // console.log("Address in summary:", selectedAddress);
      }
  }, [addr]);
    

  return !isLoading ? (
   <div className='w-full min-h-screen bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100  '>
    <CartHeader address={4}/>
    <div className='w-full h-full flex flex-col sm:flex-row items-start justify-center gap-3 p-3'>
      <div className=' w-full sm:w-[60%] h-full flex flex-col items-end gap-2 sm:px-5 sm:border-r-2 sm:border-gray-200 dark:border-gray-600'>
        <div className='space-y-3'>
          <h1 className='text-lg font-medium text-gray-500 dark:text-gray-100 py-1 text-start w-full'>Product Details</h1>
        {/* <CartBox location={2}/> */}
         {cart?.items?.map((item) => (
            <CartBox key={item._id} location={2} product={item} />
          ))}
        {/* <CartBox location={2}/> */}
          <h1 className='text-lg font-medium text-gray-500 dark:text-gray-100 py-1 text-start w-full'>Delivery Address</h1>
          {/* <div className='w-full flex flex-col items-start gap-3 border border-gray-300 rounded-sm p-3'>
            <h1 className='w-full flex items-center justify-between text-lg font-medium'> {address?.name}<span className='text-purple-900/70'>EDIT</span></h1>
            <p className='w-[30rem] '> {address?.label} {address?.street} {address?.city} {address?.state} - {address?.postalCode}</p>
            <p> {address?.contact}</p>
          </div> */}
          <CartAddressSummary addr={address} openSideBarUpdated={openSideBarUpdated} setOpenSideBarUpdated={setOpenSideBarUpdated}/>
          <h1 className='text-lg font-medium text-gray-500 dark:text-gray-100 py-1 text-start w-full'>Payment Mode</h1>
          <div className='w-full flex flex-col items-center border border-gray-300 rounded-sm p-3'>
            <h1 className='w-full flex items-center justify-between font-medium'> Cash on Delivery <span onClick={()=> navigate('/cart/payment')} className='text-purple-900/70 dark:text-purple-500 cursor-pointer focus:scale-95'>EDIT</span></h1>
          </div>
        </div>
    </div>
    <div className='w-[40%] h-full flex flex-col items-start'>
      {/* <div className='w-xs h-full flex flex-col items-start gap-3'>
        <h1 className='text-lg font-medium text-gray-600 py-3'>Price Details (3 Items)</h1>
      <p className='flex items-center w-full justify-between '><span className='border-b-2 border-gray-700 border-dotted font-medium text-gray-500'>Total Product Price </span>+ 3602</p>
      <div className='text-green-700 font-medium w-full flex items-center justify-between'><span className='border-b-2 border-gray-700 border-dotted '>Total Product Price </span> <span>- 81</span></div>
      <span className='block w-full border-b-2 border-gray-300'></span>
      <h1 className='text-xl w-full font-medium flex items-center justify-between'> Order Total <span>3521</span></h1>
      <div className='bg-green-300/30 w-full text-center p-2 px-4 rounded-sm mt-3 text-green-600'>Yay! Your total discount is 81</div>
      
      <button  className='bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer'>Place Order</button>
      
      </div> */}
       <CartSidebar items={{length:cart?.items?.length, totalPrice}} nav={'address'} viewPage={4} isLoading={loading} isClick={() => handleCreateOrder()} />
    </div>
    </div>

    </div>
  ) : <Loading/>;
}

export default CartSummary