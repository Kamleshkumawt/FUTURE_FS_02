import CartBox from "../components/user/cart/Cart";
import CartHeader from "../components/user/cart/CartHeader";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { useDispatch } from "react-redux";
import { setItemsAndPrice } from "../store/slices/productsFilterSlice";
import CartSidebar from "../components/user/cart/CartSidebar";
import { useGetCartQuery } from "../store/api/user/cartApi";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const dispatch = useDispatch();
  const { data, isLoading } = useGetCartQuery();

  useEffect(() => {
    // const fetchCart = async () => {
    //   try {
    //     const response = await getToCartProduct().unwrap();
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
    if (data) {
      console.log("cart data is : ", data);
      setCart(data.data);
      const totalPrice = (() => {
        if (!Array.isArray(data?.data.items)) return 0;
        const sum = data.data.items.reduce((acc, item) => {
          const price = Number(item?.productId?.price);
          const qty = Number(item?.quantity);
          return acc + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
        }, 0);

        return Number(sum.toFixed(2));
      })();

      // console.log("💰 total price is:", totalPrice);

      setTotalPrice(totalPrice);
      //     // setTotalPrice(
      //     //   (response.cart.items || [])
      //     //     .map((item) => item.productId.price * item.quantity)
      //     //     .reduce((acc, curr) => acc + curr, 0)
      //     // );

      dispatch(
        setItemsAndPrice({ items: data?.data.items?.length, price: totalPrice })
      );
    }
  }, [data, dispatch]);

  return !isLoading ? (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      <CartHeader address={1} />
      {cart?.items?.length > 0 ? (
        <div className="w-full h-full flex flex-col sm:flex-row items-start justify-center gap-3 p-3">
          <div className=" w-full sm:w-[60%] h-full flex flex-col items-end gap-2 sm:px-5 sm:border-r-2 sm:border-gray-200 dark:border-gray-500">
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
            <CartSidebar
              items={{ length: cart?.items?.length, totalPrice }}
              nav={"address"}
              viewPage={1}
            />
          </div>
        </div>
      ) : (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-6">
          <h1 className="text-2xl font-medium text-gray-600 dark:text-gray-300">
            Your cart is empty
          </h1>
          <Link
            to="/"
            className="bg-purple-800 text-white font-medium px-4 py-2 rounded-sm"
          >
            Shop Now
          </Link>
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default Cart;
