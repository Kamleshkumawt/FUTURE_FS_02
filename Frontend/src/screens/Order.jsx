import CartHeader from "../components/user/cart/CartHeader";
import OrderCard from "../components/user/OrderCard";

const Order = () => {

  return (
    <div className="w-full min-h-screen bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 ">
      <CartHeader address={1} />
      <div className="w-full h-full flex flex-col sm:flex-row items-start justify-center gap-3 p-3">
        <div className=" w-full h-full flex flex-col items-center gap-2 sm:px-5">
          <div className="space-y-3">
            <h1 className="text-lg font-medium text-gray-500 dark:text-gray-300 pt-7 py-2  text-start w-full">
              Orders Details
            </h1>
              <OrderCard />
          </div>
        </div>
      </div>
    </div>
  )
};

export default Order;
