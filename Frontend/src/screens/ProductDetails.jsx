import React, { useEffect, useState } from "react";
import Card from "../components/user/Card";
// import { useAddToCartProductMutation } from "../store/api/userApi";
// import { useGetAllProductMutation } from "../store/api/productApi";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { formatAmount } from "../lib/formatAmount";
import { useSelector } from "react-redux";
import {
  useGetAllProductsQuery,
  useGetProductBySlugQuery,
} from "../store/api/seller/productApi";
import { useAddItemToCartMutation } from "../store/api/user/cartApi";
import { useGetReviewsByProductIdQuery } from "../store/api/user/review";
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const [pincode, setPincode] = useState("");
  const [addItemToCart, { cartLoading }] = useAddItemToCartMutation();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  // const [getAllProduct, { data, isLoading: loading }] =
  //   useGetAllProductMutation();
  const { data, isLoading: loading } = useGetProductBySlugQuery(id, {
    skip: !id,
  });
  const { data: allProducts, isLoading } = useGetAllProductsQuery();
  const { data: reviewData, reviewLoading } = useGetReviewsByProductIdQuery(
    data?.product.id,
    {
      skip: !data?.product.id,
    }
  );
  const [show, setShow] = useState("");
  const [showSelectedImg, setShowSelectedImg] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.product) {
      // Find the product with matching id
      setShow(data.product);
      setShowSelectedImg(data.product?.frontImage);
      // console.log("data: for show ", data.product);
    }
  }, [data, id]);

  useEffect(() => {
    if (allProducts) {
      // console.log('allProducts', allProducts.products);

      setProducts(allProducts.products);
    }
  }, [allProducts]);

  useEffect(() => {
    if (reviewData) {
      // console.log("reviewData :", reviewData.data);
      setReviews(reviewData.data);
      // const ratingArray = reviewData.data.map((review) => ({
      //   rating: review.rating,
      // }));

      // console.log("ratingArray:", ratingArray);
    }
  }, [reviewData]);

  useEffect(() => {
    if (data) {
      // console.log('datra is showing single product :  ',data.product);

      setShow(data.product);
      setShowSelectedImg(data.product?.frontImage);
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      // console.log(data.products);

      setPincode(user?.address[0]?.postalCode);
    }
  }, [user]);

  const handleAddToCartProduct = async () => {
    try {
      await addItemToCart({
        productId: show?.id,
        quantity: show?.quantity,
      }).unwrap();
      toast.success("Product added to cart successfully!");
      // console.log("create cart response successfully", res);
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  const dateFormat = (dateStr) => {
    const date = new Date(dateStr);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const handleCheckDelivery = async () => {
    if (!pincode) {
      alert("Please enter a pincode");
      return;
    }

    try {
      const response = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=110001&delivery_postcode=${pincode}&cod=1&weight=0.5`,
        {
          headers: {
            Authorization: `Bearer ${""}`,
          },
        }
      );

      const data = await response.json();

      if (data.data?.available_courier_companies?.length > 0) {
        const bestOption = data.data.available_courier_companies[0];
        const estimatedDays = bestOption.estimated_delivery_days;
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + estimatedDays);
        const formattedDate = deliveryDate.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "short",
        });

        setDeliveryInfo({
          message: `Dispatch in ${estimatedDays} days`,
          date: formattedDate,
        });
      } else {
        setDeliveryInfo({
          message: "Delivery not available for this pincode ",
        });
      }
    } catch (err) {
      console.error(err);
      setDeliveryInfo({ message: "Error fetching delivery info" });
    }
  };


  const breakdown = {
  excellent: reviews.filter(r => r.rating === 5).length,
  veryGood: reviews.filter(r => r.rating === 4).length,
  good: reviews.filter(r => r.rating === 3).length,
  average: reviews.filter(r => r.rating === 2).length,
  poor: reviews.filter(r => r.rating === 1).length,
};

const ratings = [
  { label: "Excellent", count: breakdown.excellent },
  { label: "Very Good", count: breakdown.veryGood },
  { label: "Good", count: breakdown.good },
  { label: "Average", count: breakdown.average },
  { label: "Poor", count: breakdown.poor },
];


const maxCount = Math.max(...ratings.map((r) => r.count));

  const getBarStyle = (label) => {
    switch (label) {
      case "Good":
        return { backgroundColor: "#ec803d" }; // orange
      case "Average":
        return { backgroundColor: "#f4b743" }; // yellow
      case "Poor":
        return { backgroundColor: "#ef4444" }; // Tailwind red-500 hex
      default:
        return {}; // fallback to green via class
    }
  };

  return !loading ? (
    <div className="flex flex-col px-5 sm:px-16 gap-3 pt-28 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
      {/* <h1 className="font-medium text-lg mt-2">
        Home/Women/Women Ethnic/WearKurtis style list kurti with embroidered
        work
      </h1> */}
      <div className=" w-full flex flex-col lg:flex-row justify-center gap-8">
        <div className="flex gap-2 w-full">
          <div className="flex flex-col items-center gap-2 mt-2 min-w-12">
            {show?.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`img-${index}`}
                itemProp="image"
                className={`rounded-xs border border-purple-400 px-1 ${
                  index === 0 ? "w-18 h-16" : "w-16 h-16"
                }`}
                onClick={() => setShowSelectedImg(image)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="border border-gray-300 dark:border-gray-600 rounded-xs max-w-[16rem] sm:max-w-2xl">
              <img
                src={showSelectedImg}
                className="w-full h-full object-cover px-6"
                alt="Product Image"
                itemProp="image"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center w-full gap-3 px-5">
              <div
                onClick={() => handleAddToCartProduct()}
                disabled={!cartLoading}
                className="border border-[#9f2089] text-[#9f2089] p-2 sm:px-5 text-sm sm:text-lg font-medium rounded-xs flex items-center justify-center gap-2 w-full cursor-pointer"
              >
                <svg
                  fill="#9F2089"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                >
                  <g fill="#333">
                    <path d="M.75 1.5A.75.75 0 0 1 1.5.75h2.084a1.75 1.75 0 0 1 1.68 1.262L6.05 4.72h12.625a1.75 1.75 0 0 1 1.683 2.23L18.661 12.9a1.75 1.75 0 0 1-1.683 1.27H8.303a1.75 1.75 0 0 1-1.695-1.315l-1.845-7.19-.94-3.236a.25.25 0 0 0-.24-.18H1.5a.75.75 0 0 1-.75-.75Zm5.703 4.719 1.608 6.264a.25.25 0 0 0 .242.188h8.675a.25.25 0 0 0 .24-.181l1.698-5.952a.25.25 0 0 0-.24-.319H6.452ZM9.923 16.238a.5.5 0 0 0-.493.506.5.5 0 0 0 .493.506.5.5 0 0 0 .493-.506.5.5 0 0 0-.493-.506Zm-1.993.506a2 2 0 0 1 1.993-2.006 2 2 0 0 1 1.993 2.006 2 2 0 0 1-1.993 2.006 2 2 0 0 1-1.993-2.006ZM15.72 16.238a.5.5 0 0 0-.493.506.5.5 0 0 0 .493.506.5.5 0 0 0 .493-.506.5.5 0 0 0-.493-.506Zm-1.993.506a2 2 0 0 1 1.993-2.006 2 2 0 0 1 1.993 2.006 2 2 0 0 1-1.993 2.006 2 2 0 0 1-1.993-2.006Z"></path>
                  </g>
                  <defs>
                    <clipPath id="go-to-cart_svg__a">
                      <path
                        fill="#fff"
                        transform="translate(.5)"
                        d="M0 0h20v20H0z"
                      ></path>
                    </clipPath>
                  </defs>
                </svg>
                Add to Cart
              </div>
              <div
                onClick={() => handleAddToCartProduct()}
                disabled={!cartLoading}
                className="border border-[#9f2089] text-[#fff] bg-[#9f2089] p-2 px-1 sm:px-5  text-sm sm:text-lg font-medium  rounded-xs flex items-center justify-center gap-2   w-full cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  fill="transparent"
                  xmlns="http://www.w3.org/2000/svg"
                  // ml="4"
                  // mr="4"
                  // stroke="#ffffff"
                  // btntype="solid"
                  // icon="[object Object]"
                  // class="sc-ftTHYK cholQD ProductCard__SolidButtonBigStyled-sc-camkhj-1 dEqZtN"
                  // iconsize="20"
                >
                  <path
                    d="M3.927 3.28A.956.956 0 0 0 2.576 4.63l5.437 5.438-5.3 5.3a.956.956 0 1 0 1.352 1.351l5.43-5.43a1.727 1.727 0 0 0-.032-2.474L3.927 3.28Z"
                    fill="#fff"
                  ></path>
                  <path
                    d="M11.631 3.28A.956.956 0 1 0 10.28 4.63l5.437 5.438-5.3 5.3a.956.956 0 1 0 1.352 1.351l5.43-5.43a1.727 1.727 0 0 0-.032-2.474L11.631 3.28Z"
                    fill="#fff"
                  ></path>
                </svg>
                Buy Now
              </div>
            </div>
            <span className="border-b border-gray-400 block min-w-40 sm:min-w-xs"></span>
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-semibold ">2 Similar Products</h1>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764"
                  className="w-18 h-18 rounded-xs border border-purple-400"
                  alt="img"
                />
                <img
                  src="https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764"
                  className="w-18 h-18 rounded-xs border border-purple-400"
                  alt="img"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3">
          {/* main details for products*/}
          <div className="w-full border border-gray-300 dark:border-gray-600 rounded-sm p-5 flex flex-col gap-3">
            <h1 className="text-gray-400 text-xl font-medium max-w-152">
              {show?.name?.slice(0, 70)}
            </h1>
            <div className="flex items-center gap-2 text-2xl font-medium">
              {formatAmount(show?.price)}
              <span className="text-gray-400 text-[16px] line-through">
                {formatAmount(show?.price)}
              </span>{" "}
              <span className="text-lg text-green-500">
                {show?.discount}% off
              </span>
              <div className=" hidden sm:flex items-center gap-2 text-lg text-gray-500">
                onwards
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  // iconSize="20"
                  className="sc-ftTHYK kizHtP"
                >
                  <g fill="#666">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0Zm0 18.44c-4.65 0-8.44-3.79-8.44-8.44 0-4.65 3.79-8.44 8.44-8.44 4.65 0 8.44 3.79 8.44 8.44 0 4.65-3.79 8.44-8.44 8.44Z"></path>
                    <path d="M10 4.825a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0 3.017a1 1 0 0 0-1 1v5.333a1 1 0 0 0 2 0V8.842a1 1 0 0 0-1-1Z"></path>
                  </g>
                  <defs>
                    <clipPath id="info_svg__a">
                      <path fill="#fff" d="M0 0h20v20H0z"></path>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full">
              <div className="flex items-center text-lg gap-1 bg-green-700/70 rounded-xl text-white font-medium  px-2">
                {show?.rating}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 20 20"
                  fill="#ffffff"
                  xmlns="http://www.w3.org/2000/svg"
                  // ml="4"
                  // iconSize="10"
                  className="sc-ftTHYK bmIaUL"
                >
                  <g>
                    <path
                      d="M19.5399 6.85L13.6199 5.5L10.5099 0.29C10.3999 0.11 10.2099 0 9.99993 0C9.78993 0 9.59993 0.11 9.48993 0.29L6.37993 5.5L0.45993 6.85C0.25993 6.9 0.0899297 7.05 0.0299297 7.25C-0.0300703 7.45 0.00992969 7.67 0.14993 7.83L4.13993 12.4L3.58993 18.44C3.56993 18.65 3.65993 18.85 3.82993 18.98C3.99993 19.1 4.21993 19.13 4.41993 19.05L9.99993 16.64L15.5799 19.03C15.6599 19.06 15.7399 19.08 15.8099 19.08C15.8099 19.08 15.8099 19.08 15.8199 19.08C16.1199 19.09 16.4199 18.82 16.4199 18.48C16.4199 18.42 16.4099 18.36 16.3899 18.31L15.8499 12.38L19.8399 7.81C19.9799 7.65 20.0199 7.43 19.9599 7.23C19.9099 7.04 19.7399 6.89 19.5399 6.85Z"
                      fill="#ffffff"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect width="20" height="19.08" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="text-sm text-gray-400">
                {show?.rating} Ratings, {show?.numOfReviews} Reviews
              </p>
            </div>
            <div className="text-gray-700 dark:text-gray-300 text-sm font-medium bg-gray-200/40 dark:bg-gray-800/80 px-2 rounded-xl text-center p-1 max-w-28">
              Free Delivery
            </div>
          </div>

          {/*selected Size*/}
          <div className="w-full border border-gray-300 dark:border-gray-600 rounded-sm p-5 flex flex-col gap-4 ">
            <h1 className="text-gray-800 dark:text-gray-300 text-xl font-semibold  ">
              Select Size
            </h1>
            <div className="flex flex-wrap items-center gap-2 ">
              {show?.size?.length > 0 && (show?.size.map((size, index) => (
                <div key={index} className="text-purple-600 dark:text-purple-200 font-medium bg-purple-200/40 px-2 p-1 border border-purple-500 rounded-xl text-center ">
                {size}
              </div>
              )))}
            </div>
          </div>

          {/*Product Details*/}
          <div className="w-full border border-gray-300 dark:border-gray-600 rounded-sm p-5 flex flex-col gap-4 ">
            <h1 className="text-gray-800 dark:text-gray-300 text-xl font-semibold  ">
              Product Details
            </h1>
            <div className="flex flex-col items-start text-gray-500 dark:text-gray-400">
              <p>
                Name :<span>{show?.name}</span>
              </p>
              <p className="flex items-center gap-1">
                Fabric : <span>{show?.material}</span>
              </p>
              <p className="flex items-center gap-1">
                weight : <span> {show?.weight}g</span>
              </p>
              <p className="flex items-center gap-1">
                color : <span>{show?.color}</span>
              </p>
              <p className="flex items-center gap-1">
                Net Quantity (N) : <span> {show?.quantity}</span>
              </p>
              <p className="flex items-center gap-1">
                Sizes :<span>{show?.size}</span>
              </p>
              <p className="flex items-center gap-1">
                Country of Origin : <span>India</span>
              </p>
              <p className="max-w-sm">
                Description : <span>{show?.description}</span>
              </p>
            </div>
          </div>

          {/*Check Delivery Date */}
          {user && (
            <div className="w-full border border-gray-300 dark:border-gray-600 rounded-sm p-5 flex flex-col gap-4">
              <h1 className="text-gray-800 dark:text-gray-300 text-xl font-semibold">
                Check Delivery Date
              </h1>

              <div className="relative mt-4 flex items-center">
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder=" "
                  className="peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
                  required
                />
                <label
                  htmlFor="pincode"
                  className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
                ${
                  pincode
                    ? "top-1 text-xs text-purple-600"
                    : "top-3 text-xs text-gray-400"
                }
                peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`}
                >
                  Enter Delivery Pincode
                </label>

                <span
                  onClick={handleCheckDelivery}
                  className="-ml-10 cursor-pointer text-purple-600 font-medium"
                >
                  CHECK
                </span>
              </div>

              <div className="flex flex-col items-start text-gray-500 font-medium w-full">
                <p className="flex items-center gap-1 text-black dark:text-gray-300 w-full">
                  {!deliveryInfo ? (
                    <span>Enter Pincode for Estimated Delivery Date</span>
                  ) : deliveryInfo.message ===
                    "Delivery not available for this pincode" ? (
                    <span className="flex items-center gap-2 bg-red-200 rounded-sm text-[#e11900] p-4 w-full ">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            d="M11.7294 1.98633C10.9615 0.643068 9.02461 0.643064 8.25675 1.98633L0.241724 16.0075C-0.520449 17.3408 0.442269 19 1.97805 19H18.0081C19.5439 19 20.5066 17.3408 19.7444 16.0075L11.7294 1.98633ZM9.99171 5.50899C10.544 5.50899 10.9917 5.95671 10.9917 6.50899V11.2744C10.9917 11.8267 10.544 12.2744 9.99171 12.2744C9.43942 12.2744 8.99171 11.8267 8.99171 11.2744V6.50899C8.99171 5.95671 9.43942 5.50899 9.99171 5.50899ZM9.99171 15.8851C10.5614 15.8851 11.0233 15.4362 11.0233 14.8825C11.0233 14.3288 10.5614 13.88 9.99171 13.88C9.42198 13.88 8.96013 14.3288 8.96013 14.8825C8.96013 15.4362 9.42198 15.8851 9.99171 15.8851Z"
                            fill="#e11900"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="20" height="20" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                      {deliveryInfo.message} - {pincode}
                    </span>
                  ) : (
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-black dark:text-gray-200 flex items-center gap-2">
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          width={20}
                          height={20}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.896 12.548a2.508 2.508 0 0 1 2.506 2.506 2.508 2.508 0 0 1-2.506 2.505 2.508 2.508 0 0 1-2.505-2.505 2.508 2.508 0 0 1 2.505-2.506Zm0 3.716a1.21 1.21 0 0 0 0-2.42 1.21 1.21 0 0 0 0 2.42ZM4.708 12.548a2.508 2.508 0 0 1 2.506 2.506 2.508 2.508 0 0 1-2.506 2.505 2.508 2.508 0 0 1-2.505-2.505 2.508 2.508 0 0 1 2.505-2.506Zm0 3.716a1.21 1.21 0 0 0 0-2.42c-.667 0-1.21.543-1.21 1.21 0 .667.543 1.21 1.21 1.21Z"
                            fill="#333"
                          ></path>
                          <path
                            d="M17.538 5.66c.242 0 .465.135.576.35l1.814 3.52a.648.648 0 0 1 .072.298v5.227c0 .357-.29.647-.648.647h-1.577v-1.296a.929.929 0 0 0 .93-.928V9.985l-1.283-2.488a1 1 0 0 0-.889-.542h-4.33V5.66h5.335ZM6.588 14.406h7.386v1.296H6.588v-1.296Z"
                            fill="#333"
                          ></path>
                          <path
                            d="M.648 2.44h11.555c.358 0 .648.29.648.648v11.966h-1.296V4.736a1 1 0 0 0-1-1H2.296a1 1 0 0 0-1 1v8.67a1 1 0 0 0 1 1h.555v1.296H.648A.648.648 0 0 1 0 15.054V3.088c0-.357.29-.648.648-.648Z"
                            fill="#333"
                          ></path>
                          <path
                            d="M12.203 9.2h7.149v1.297h-7.15V9.2Z"
                            fill="#333"
                          ></path>
                        </svg>
                        Delivery by {deliveryInfo.date}
                      </p>
                      <p className="text-black dark:text-gray-200 flex items-center gap-2">
                        {" "}
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          width={20}
                          height={20}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 8.28c0-.03-.01-.05-.01-.07V5.15c0-1.22-.99-2.21-2.21-2.21H14.9V1.66a.675.675 0 0 0-.67-.66H14c-.37 0-.66.3-.66.66v1.27H6.65V1.66c0-.36-.3-.66-.66-.66h-.23c-.37 0-.67.3-.67.66v1.27H2.21C.99 2.93 0 3.92 0 5.15v11.56c0 1.22.99 2.21 2.21 2.21h15.56c1.22 0 2.21-.99 2.21-2.21V8.35c.01-.02.02-.04.02-.07ZM2.21 4.49h2.88v.84c0 .37.3.67.67.67h.23c.37 0 .66-.3.66-.66v-.85h6.69v.84c0 .37.29.67.66.67h.23c.37 0 .66-.3.66-.66v-.85h2.88c.36 0 .65.29.65.65V7.5H1.56V5.15c0-.37.29-.66.65-.66Zm15.56 12.87H2.21c-.36 0-.65-.29-.65-.65V9.06h16.87v7.64c0 .37-.3.66-.66.66Z"
                            fill="#666"
                          ></path>
                        </svg>{" "}
                        {deliveryInfo.message}
                      </p>
                    </div>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="w-full border border-gray-300 dark:border-gray-600 rounded-sm p-5 flex flex-col gap-5 ">
            <h1 className="text-gray-800 dark:text-gray-300 text-xl font-semibold  ">
              Product Ratings & Reviews
            </h1>
            <div className="flex flex-col  gap-5 w-full">
              <div className=" flex items-center gap-2">
                <div className="text-gray-400 text-sm flex flex-col">
                  <div className="flex items-center text-xl sm:text-5xl gap-1 text-[#038d63] font-bold  px-2">
                    {show.rating}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 20 20"
                      fill="#038d63"
                      xmlns="http://www.w3.org/2000/svg"
                      // ml="4"
                      // iconSize="10"
                      className="sc-ftTHYK bmIaUL"
                    >
                      <g>
                        <path
                          d="M19.5399 6.85L13.6199 5.5L10.5099 0.29C10.3999 0.11 10.2099 0 9.99993 0C9.78993 0 9.59993 0.11 9.48993 0.29L6.37993 5.5L0.45993 6.85C0.25993 6.9 0.0899297 7.05 0.0299297 7.25C-0.0300703 7.45 0.00992969 7.67 0.14993 7.83L4.13993 12.4L3.58993 18.44C3.56993 18.65 3.65993 18.85 3.82993 18.98C3.99993 19.1 4.21993 19.13 4.41993 19.05L9.99993 16.64L15.5799 19.03C15.6599 19.06 15.7399 19.08 15.8099 19.08C15.8099 19.08 15.8099 19.08 15.8199 19.08C16.1199 19.09 16.4199 18.82 16.4199 18.48C16.4199 18.42 16.4099 18.36 16.3899 18.31L15.8499 12.38L19.8399 7.81C19.9799 7.65 20.0199 7.43 19.9599 7.23C19.9099 7.04 19.7399 6.89 19.5399 6.85Z"
                          fill="#038d63"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="20" height="19.08" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div className="mt-2">{show.numOfReviews} Reviews</div>
                  {/* <div>{show.numOfReviews} Reviews</div> */}
                </div>
                {/* <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">Excellent <span className="border-b-4 border-gray-400 block min-w-xs"></span> <span>722</span> </div>
                <div className="flex items-center gap-4" >Very Good<span className="border-b-4 border-gray-400 block min-w-xs"></span> <span>700</span> </div>
                <div className="flex items-center gap-4" >Good<span className="border-b-4 border-gray-400 block min-w-xs"></span> <span>2</span></div>
                <div className="flex items-center gap-4" >Average<span className="border-b-4 border-gray-400 block min-w-xs"></span> <span>72</span></div>
                <div className="flex items-center gap-4" >Poor<span className="border-b-4 border-gray-400 block min-w-xs"></span> <span>102</span></div>
              </div> */}
                <div className="flex flex-col items-center gap-2 w-full max-w-md">
                  {ratings.map((item) => {
                    const percentage = (item.count / maxCount) * 100;
                    const customStyle = getBarStyle(item.label);
                    const useCustomColor = Object.keys(customStyle).length > 0;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-1 sm:gap-4 w-full"
                      >
                        {/* Label */}
                        <span className="sm:w-24">{item.label}</span>

                        {/* Bar container */}
                        <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
                          <div
                            className={`h-2 rounded ${
                              useCustomColor ? "" : "bg-green-500"
                            }`}
                            style={{ width: `${percentage}%`, ...customStyle }}
                          ></div>
                        </div>

                        {/* Count */}
                        <span className="w-10 text-right">{item.count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <span className="border-b border-gray-400 block min-w-40 sm:min-w-xs"></span>
              <div className="font-semibold ">
                Real Images and videos from customers
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {reviews.length > 0 &&
                  reviews.map((review) => (
                    <div
                      key={review._id}
                      className="flex items-center gap-3 flex-wrap"
                    >
                      {/* Review Images */}
                      {review.images?.length > 0 &&
                        review.images.map((img, i) => (
                          <img
                            key={i}
                            src={img.url}
                            className="w-16 h-16 object-cover rounded-sm"
                            alt="review"
                          />
                        ))}
                    </div>
                  ))}
              </div>

              {reviews.length > 0 && (
                <span className="border-b border-gray-400 block min-w-40 sm:min-w-xs"></span>
              )}

              {/* user review */}
              {reviews.map((item) => (
                <div key={item._id} className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 font-medium text-lg text-gray-600 dark:text-gray-300">
                    <div>
                      <img
                        src={item.userId.profile_picture.url}
                        className="w-10 h-10 rounded-full"
                        alt="img"
                      />
                    </div>
                    {item.userId.fullName}
                  </div>
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex items-center text-lg gap-1 bg-green-800/80 rounded-xl text-white font-medium  px-2">
                      {item.rating}
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 20 20"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                        // ml="4"
                        // iconSize="10"
                        className="sc-ftTHYK bmIaUL"
                      >
                        <g>
                          <path
                            d="M19.5399 6.85L13.6199 5.5L10.5099 0.29C10.3999 0.11 10.2099 0 9.99993 0C9.78993 0 9.59993 0.11 9.48993 0.29L6.37993 5.5L0.45993 6.85C0.25993 6.9 0.0899297 7.05 0.0299297 7.25C-0.0300703 7.45 0.00992969 7.67 0.14993 7.83L4.13993 12.4L3.58993 18.44C3.56993 18.65 3.65993 18.85 3.82993 18.98C3.99993 19.1 4.21993 19.13 4.41993 19.05L9.99993 16.64L15.5799 19.03C15.6599 19.06 15.7399 19.08 15.8099 19.08C15.8099 19.08 15.8099 19.08 15.8199 19.08C16.1199 19.09 16.4199 18.82 16.4199 18.48C16.4199 18.42 16.4099 18.36 16.3899 18.31L15.8499 12.38L19.8399 7.81C19.9799 7.65 20.0199 7.43 19.9599 7.23C19.9099 7.04 19.7399 6.89 19.5399 6.85Z"
                            fill="#ffffff"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0">
                            <rect width="20" height="19.08" fill="white"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">
                      Posted on {dateFormat(item.createdAt)}
                    </p>
                  </div>
                  <p>{item.comment}</p>
                  <div className="flex gap-3 flex-wrap">
                    {item.images.length > 0 &&
                      item.images.map((img, index) => (
                        <div key={index} className="flex items-center">
                          <img
                            src={img.url}
                            className="w-16 h-16 rounded-sm"
                            alt="img"
                          />
                        </div>
                      ))}
                  </div>
                  <div className="text-gray-500 flex items-center gap-2">
                    <svg
                      viewBox="0 0 16 16"
                      width={18}
                      height={18}
                      fill="greyT1"
                      xmlns="http://www.w3.org/2000/svg"
                      size="16"
                      // iconSize="20"
                      className="sc-ftTHYK kpbgFG cursor-pointer"
                    >
                      <path
                        d="M4.712 5.245 8.68 1.13a1.039 1.039 0 0 1 1.51-.008c.258.268.366.647.294 1.018l-.68 3.402h4.046c1.54 0 2.578 1.635 1.977 3.106L13.492 14.3c-.229.542-.745.899-1.318.899H5.73c-.788 0-1.432-.669-1.432-1.486V6.293c0-.394.15-.773.415-1.048Zm-1.847 8.471c0 .818-.645 1.486-1.433 1.486-.787 0-1.432-.668-1.432-1.486V7.773c0-.817.645-1.486 1.432-1.486.788 0 1.433.67 1.433 1.486v5.943Z"
                        fill="#666"
                      ></path>
                    </svg>
                    Helpful <span>({item.helpful})</span>
                  </div>
                </div>
              ))}

              {reviewLoading && <p>Loading...</p>}

              {reviews.length === 0 && <p>No reviews yet</p>}

              <span className="border-b border-gray-400 block min-w-40 sm:min-w-xs"></span>

              {/* user review */}
              {/* <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 font-medium text-lg text-gray-600">
                  <div>
                    <img
                      src="https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764"
                      className="w-10 h-10 rounded-full"
                      alt="img"
                    />
                  </div>
                  Khushboo Kumari
                </div>
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center text-lg gap-1 bg-green-800/80 rounded-xl text-white font-medium  px-2">
                    4.2
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 20 20"
                      fill="#ffffff"
                      xmlns="http://www.w3.org/2000/svg"
                      // ml="4"
                      // iconSize="10"
                      className="sc-ftTHYK bmIaUL"
                    >
                      <g>
                        <path
                          d="M19.5399 6.85L13.6199 5.5L10.5099 0.29C10.3999 0.11 10.2099 0 9.99993 0C9.78993 0 9.59993 0.11 9.48993 0.29L6.37993 5.5L0.45993 6.85C0.25993 6.9 0.0899297 7.05 0.0299297 7.25C-0.0300703 7.45 0.00992969 7.67 0.14993 7.83L4.13993 12.4L3.58993 18.44C3.56993 18.65 3.65993 18.85 3.82993 18.98C3.99993 19.1 4.21993 19.13 4.41993 19.05L9.99993 16.64L15.5799 19.03C15.6599 19.06 15.7399 19.08 15.8099 19.08C15.8099 19.08 15.8099 19.08 15.8199 19.08C16.1199 19.09 16.4199 18.82 16.4199 18.48C16.4199 18.42 16.4099 18.36 16.3899 18.31L15.8499 12.38L19.8399 7.81C19.9799 7.65 20.0199 7.43 19.9599 7.23C19.9099 7.04 19.7399 6.89 19.5399 6.85Z"
                          fill="#ffffff"
                        ></path>
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="20" height="19.08" fill="white"></rect>
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-400">Posted on 4 Oct 2025</p>
                </div>
                <p>
                  Acha h saree lekin mamy boli ki pooja me kala nhi chahiye
                  esliye cancel krna chahti thi lekin ab nhi boli mamy ki rhn do
                  kbhi kbhi pahn lugi
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764"
                    className="w-16 h-16 rounded-sm"
                    alt="img"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1760126130338-4e6c9043ee2d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=764"
                    className="w-16 h-16 rounded-sm"
                    alt="img"
                  />
                </div>
                <div className="text-gray-500 flex items-center gap-2">
                  <svg
                    viewBox="0 0 16 16"
                    width={18}
                    height={18}
                    fill="greyT1"
                    xmlns="http://www.w3.org/2000/svg"
                    size="16"
                    // iconSize="20"
                    className="sc-ftTHYK kpbgFG cursor-pointer"
                  >
                    <path
                      d="M4.712 5.245 8.68 1.13a1.039 1.039 0 0 1 1.51-.008c.258.268.366.647.294 1.018l-.68 3.402h4.046c1.54 0 2.578 1.635 1.977 3.106L13.492 14.3c-.229.542-.745.899-1.318.899H5.73c-.788 0-1.432-.669-1.432-1.486V6.293c0-.394.15-.773.415-1.048Zm-1.847 8.471c0 .818-.645 1.486-1.433 1.486-.787 0-1.432-.668-1.432-1.486V7.773c0-.817.645-1.486 1.432-1.486.788 0 1.433.67 1.433 1.486v5.943Z"
                      fill="#666"
                    ></path>
                  </svg>
                  Helpful <span>(9)</span>
                </div>
              </div>
              <span className="border-b border-gray-400 block min-w-[10rem] sm:min-w-xs"></span> */}

              <div className="text-[#9f2089] font-bold flex items-center gap-1 cursor-pointer">
                VIEW ALL REVIEWS
                <svg
                  width="20"
                  height="20"
                  fill="pinkBase"
                  xmlns="http://www.w3.org/2000/svg"
                  // iconSize="20"
                  className="sc-ftTHYK cvKlbq"
                >
                  <path
                    d="M7.31 4.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L8.81 4.305a1.06 1.06 0 0 0-1.5.01Z"
                    fill="##9f2089"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-evenly w-full h-full border rounded-sm bg-[#e7eeff] gap-6 p-2">
            <div className="flex flex-col items-center gap-2 text-xs font-medium text-black">
              <img
                src="https://images.meesho.com/images/value_props/lowest_price_new.png"
                className="w-10 h-10 rounded-full"
                alt="png img"
              />
              Lowest Price
            </div>
            <span className="bg-white h-8 w-px "></span>
            <div className="flex flex-col items-center gap-2 text-xs font-medium text-black">
              <img
                src="https://images.meesho.com/images/value_props/cod_new.png"
                className="w-10 h-10 rounded-full"
                alt="png img"
              />
              Cash on Delivery
            </div>
            <span className="bg-white h-8 w-px "></span>
            <div className="flex flex-col items-center gap-2 text-xs font-medium text-black">
              <img
                src="https://images.meesho.com/images/value_props/return_new.png"
                className="w-10 h-10 rounded-full"
                alt="png img"
              />
              7-day Returns
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-xl">People also viewed</h1>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 mb-20">
          {products.map((product) => (
            <Card key={product.id} data={product} />
          ))}
          {isLoading && <h1>No products found</h1>}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ProductDetails;
