import React, { useEffect, useState } from "react";
import { formatAmount } from "../lib/formatAmount";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMyOrdersQuery } from "../store/api/user/orderApi";
import { useDispatch, useSelector } from "react-redux";
import { setRatingAndId } from "../store/slices/productsFilterSlice";
import { useCreateReviewMutation } from "../store/api/user/review";

const ReviewOrder = () => {
  const [orders, setOrders] = useState([]);
  const { data, isLoading } = useGetMyOrdersQuery();
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [createReview, { isLoading: isReviewLoading }] =
    useCreateReviewMutation();
  const ratingAndId = useSelector((state) => state.filters.ratingAndId);

  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRating = (rating, productId) => {
    // console.log("Rating : ", rating, "productId : ", productId);
    // console.log("Rating : ", ratingAndId.rating, "productId : ", ratingAndId.productId);
    dispatch(setRatingAndId({rating, productId}));
  };

  useEffect(() => {
    // const fetchCart = async () => {
    //   try {
    //     const response = await getOrder().unwrap();
    //     console.log("get to order product : ", response);
    //     setOrders(response.orders);
    //   } catch (error) {
    //     console.error("Error fetching cart:", error);
    //   }
    // };

    // fetchCart();
    if (data) {
      setOrders(data.orders);
    }
  }, [data, dispatch]);

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);

    const newMedia = files.map((file) => {
      const isVideo = file.type.startsWith("video/");
      return {
        url: URL.createObjectURL(file),
        file,
        type: isVideo ? "video" : "image", // ✅ distinguish between image/video
      };
    });

    setMedia((prev) => [...prev, ...newMedia].slice(0, 4)); // limit total to 4
  };

  const handleReplaceMedia = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");

    const updated = [...media];
    updated[index] = {
      url: URL.createObjectURL(file),
      file,
      type: isVideo ? "video" : "image",
    };
    setMedia(updated);
  };

  // ---------- Form Submit ----------
  const handleReviewSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("rating", ratingAndId.rating);
      formData.append("comment", description);
      formData.append("orderId", id);
      formData.append("productId", ratingAndId.productId);

      media.forEach((img) => {
        formData.append("images", img.file);
      });
      // for (const pair of formData.entries()) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }

      await createReview(formData).unwrap();
      // console.log("Product created:", response);
      navigate("/");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return !isLoading ? (
    <div className="pt-30 flex flex-col gap-5 px-5 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100">
      {orders
        .filter((item) => item._id === id)
        .map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-6 shadow-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100"
          >
            <div className="flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <strong>Total:</strong> {formatAmount(order.total_amount)}
              </p>
              <span
                className={`text-sm px-3 py-1 rounded-xl font-medium ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 dark:border-gray-500 rounded-md p-4 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 flex flex-col  gap-4"
                >
                  <div className="flex  items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-full object-cover rounded mb-3"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {item.title}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Price: {formatAmount(item.price)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  </div>
                {item.isReviewed === true && (
                  <p className="text-green-600 mt-2 font-medium text-sm">
                    ✅ Review submitted successfully!
                  </p>
                )}

              {item.isReviewed === false && order.status === "Delivered" && (
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
                        fill={item.productId === ratingAndId.productId && starIndex <= ratingAndId.rating ? "#FFD700" : "none"}
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
              </div>
            )}
                </div>
              ))}
            </div>
            
          </div>
        ))}
      <div>
        <div className="flex flex-col items-start gap-5 border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-6 shadow-sm bg-white  dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
          <p className="font-medium">
            Resellers find images and videos more helpful than text alone.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 mb-8">
            <div className="flex flex-col gap-2 items-center">
              <p className="font-medium text-pink-600 text-sm">
                Add Images/Videos
              </p>
              {/* Upload box (only visible if less than 4 images) */}
              {media.length < 4 && (
                <div className="relative w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center text-center text-gray-500 cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-xs">Click to Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {media.map((item, i) => (
                <div
                  key={i}
                  className="relative w-25 h-25 border border-gray-300 rounded-md overflow-hidden group"
                >
                  {/* Media Preview */}
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.file?.name || `Media ${i + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                      controls
                    />
                  )}

                  {/* Reselect / Replace Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Change
                  </div>

                  {/* Hidden File Input for Replace */}
                  <input
                    type="file"
                    accept="image/*,video/*" // ✅ allow both
                    onChange={(e) => handleReplaceMedia(e, i)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-5 border border-gray-300 dark:border-gray-600 rounded-lg p-3 mb-6 shadow-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
          <p className="font-medium">What did you like?.</p>
          {/* description Field */}
          <div className="relative w-full">
            <textarea
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=" "
              required
              maxLength={200}
              className="peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
            />
            <label
              htmlFor="description"
              className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
                ${
                  description
                    ? "top-1 text-xs text-purple-600"
                    : "top-3 text-base text-gray-400"
                }
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`}
            >
              Description
            </label>
          </div>
        </div>
        <div className=" flex items-center justify-center p-3 mb-6 shadow-sm bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
          <button
            onClick={() =>
              handleReviewSubmit(
                orders
                  .filter((item) => item._id === id)
                  .map((item) => item._id)
              )
            }
            disabled={isReviewLoading}
            className="btn cursor-pointer bg-purple-600 text-gray-100 rounded-sm font-medium p-2 px-4"
          >
            Submit review
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ReviewOrder;
