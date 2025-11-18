import React, { useEffect, useState } from "react";
import { formatAmount } from "../../lib/formatAmount";
import Loading from "../Loading";
import { useNavigate } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../store/api/user/orderApi";
import { useDispatch } from "react-redux";
import { setRatingAndId } from "../../store/slices/productsFilterSlice";

const OrderCard = () => {
  const [orders, setOrders] = useState([]);
  const { data, isLoading } = useGetMyOrdersQuery();
  const [rating, setRating] = useState({ value: 0, productId: "" });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRating = (rating, productId) => {
    // console.log("Rating : ", rating, "productId : ", productId);
    dispatch(setRatingAndId({rating, productId}));
    setRating({value:rating, productId});
  };

  useEffect(() => {
    if (data) {
      setOrders(data.orders);
    }
    // const fetchCart = async () => {
    //   try {
    //     const response = await getOrder().unwrap();
    //     console.log("get to order product : ", response);
    //     setOrders(response.orders);
    //     // If you want to log product details from the first order:
    //     // response.orders.forEach((order, index) => {
    //     //   console.log(
    //     //     `Order ${index + 1} - Status: ${order.status}, Total: ₹${
    //     //       order.total_amount
    //     //     }`
    //     //   );

    //     //   order.items.forEach((item, itemIndex) => {
    //     //     const product = item.productId;

    //     //     console.log(`  Item ${itemIndex + 1}:`);
    //     //     console.log(`    Name: ${product.name}`);
    //     //     console.log(`    Price: ₹${product.price}`);
    //     //     console.log(`    Quantity: ${item.quantity}`);
    //     //     console.log(`    Image: ${product.frontImage?.url}`);
    //     //     console.log(`    Product ID: ${product._id}`);
    //     //   });
    //     // });
    //   } catch (error) {
    //     console.error("Error fetching cart:", error);
    //   }
    // };

    // fetchCart();
  }, [data, dispatch]);

  return !isLoading ? (
    <>
      {orders.map((order, index) => (
        <div
          key={order._id}
          className="border border-gray-300 rounded-lg p-6 mb-6 shadow-sm bg-white dark:bg-neutral-700 text-gray-900 dark:text-gray-100 "
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Order #{index + 1}
            </h3>
            <span
              className={`text-sm px-3 py-1 rounded-full font-medium ${
                order.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "Delivered"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            <strong>Total:</strong> {formatAmount(order.total_amount)}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {order.items.map((item,index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-500 rounded-md p-4 bg-gray-50 dark:bg-neutral-600 flex flex-col items-start"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-48 h-full object-cover rounded mb-3"
                />
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  {item.title}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Price: {formatAmount(item.price)}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Quantity: {item.quantity}
                </p>
                {item.isReviewed === true && (
                  <p className="text-green-600 mt-2 font-medium text-sm">
                    ✅ Review submitted successfully!
                  </p>
                )}

                {item.isReviewed === false &&
                  order.status === "Delivered" && (
                    <div className="flex items-center justify-between mt-2">
                      {/* Star Rating */}
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => {
                          const starIndex = i + 1;
                          return (
                            <svg
                              key={starIndex}
                              onClick={() =>
                                handleRating(starIndex, item.productId)
                              }
                              xmlns="http://www.w3.org/2000/svg"
                              // fill={starIndex <= rating && item.productId === rating.productId ? "#FFD700" : "none"} // fill if selected
                              fill={item.productId === rating.productId && starIndex <= rating.value ? "#FFD700" : "none"}
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#FFD700"
                              className="w-6 h-6 cursor-pointer transition-transform duration-150 hover:scale-110"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.356 4.765 
                                5.263.764a.563.563 0 01.312.961l-3.81 3.715.9 
                                5.243a.563.563 0 01-.817.593L12 17.813l-4.724 
                                2.484a.563.563 0 01-.817-.593l.9-5.243-3.81-3.715a.563.563 
                                0 01.312-.961l5.263-.764L11.48 3.5z"
                              />
                            </svg>
                          );
                        })}
                      </div>

                      {/* Add Review */}
                      <div
                        onClick={() => {
                          navigate(`/user/revieworder/${order._id}`);
                          scrollTo(0, 0);
                        }}
                        className="font-medium text-sm bg-gray-100 text-black p-2 rounded-sm px-4 cursor-pointer"
                      >
                        Add a review
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  ) : (
    <Loading />
  );
};

export default OrderCard;
