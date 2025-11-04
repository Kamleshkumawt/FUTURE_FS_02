import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddToWishlistProductMutation,
  useRemoveFromWishlistProductMutation,
} from "../store/api/userApi";

/**
 * Product Card Component
 * - SEO-friendly
 * - Wishlist toggle (Add / Remove)
 * - Optimized performance
 */
const Card = React.memo(({ data }) => {
  const navigate = useNavigate();
  const [isAddedToWishlist, setIsAddedToWishlist] = useState(
    data?.isInWishlist || false
  );

  const [addToWishlistProduct, { isLoading: adding }] =
    useAddToWishlistProductMutation();
  const [removeFromWishlistProduct, { isLoading: removing }] =
    useRemoveFromWishlistProductMutation();

  const handleWishlistToggle = useCallback(
    async (productId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signIn");
        return;
      }

      try {
        if (isAddedToWishlist) {
          await removeFromWishlistProduct({ productId }).unwrap();
          setIsAddedToWishlist(false);
        } else {
          await addToWishlistProduct({ productId }).unwrap();
          setIsAddedToWishlist(true);
        }
      } catch (error) {
        console.error("Wishlist action failed:", error);
      }
    },
    [isAddedToWishlist, navigate, addToWishlistProduct, removeFromWishlistProduct]
  );

  const discountedPrice =
    data?.price - (data?.price * data?.discount?.percentage) / 100;

  const formattedPrice = discountedPrice?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const originalPrice = data?.price?.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

  const isProcessing = adding || removing;

  return (
    <article
      className="max-w-[15rem] min-w-[14rem] rounded-lg overflow-hidden border border-gray-200 bg-white hover:shadow-md transition"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Image & Wishlist */}
      <div
        onClick={() => {
          navigate(`/product/${data?.slug || data?.name}`);
          scrollTo(0, 0);
        }}
        className="relative w-full h-48 flex items-center justify-center cursor-pointer p-2"
      >
        <img
          src={data?.frontImage?.url}
          alt={data?.name || "Product Image"}
          className="object-contain h-full w-full"
          loading="lazy"
          itemProp="image"
        />

        {/* Wishlist Button */}
        <button
          aria-label={
            isAddedToWishlist ? "Remove from wishlist" : "Add to wishlist"
          }
          disabled={isProcessing}
          onClick={(e) => {
            e.stopPropagation();
            handleWishlistToggle(data?._id);
          }}
          className={`absolute top-3 right-3 transition-colors ${
            isAddedToWishlist ? "text-red-600" : "text-gray-400 hover:text-red-500"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={isAddedToWishlist ? "currentColor" : "none"}
            viewBox="0 0 20 18"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 16.982l-1.32-1.222C4.68 11.48 2 8.98 2 5.75 2 3.403 3.903 1.5 6.25 1.5c1.474 0 2.895.657 3.75 1.707A4.8 4.8 0 0 1 13.75 1.5C16.097 1.5 18 3.403 18 5.75c0 3.23-2.68 5.73-6.43 10.01l-1.32 1.222z"
            />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3
          onClick={() => {
            navigate(`/product/${data?.slug || data?.name}`);
            scrollTo(0, 0);
          }}
          className="text-[14px] text-gray-800 line-clamp-2 cursor-pointer hover:text-blue-600"
          itemProp="name"
        >
          {data?.name || data?.description?.slice(0, 70)}
        </h3>

        {/* Rating */}
        <div className="flex items-center text-sm text-gray-600 mt-2 space-x-2">
          {data?.rating && (
            <div className="flex items-center bg-green-700 text-white px-1.5 py-0.5 rounded text-xs font-medium">
              <span itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                <span itemProp="ratingValue">{data?.rating}</span>
              </span>
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMyIgaGVpZ2h0PSIxMiI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTYuNSA5LjQzOWwtMy42NzQgMi4yMy45NC00LjI2LTMuMjEtMi44ODMgNC4yNTQtLjQwNEw2LjUuMTEybDEuNjkgNC4wMSA0LjI1NC40MDQtMy4yMSAyLjg4Mi45NCA0LjI2eiIvPjwvc3ZnPg=="
                alt="star"
                className="ml-1 w-3 h-3"
              />
            </div>
          )}
          <span className="text-sm text-gray-500 font-medium">
            {data?.reviews_count || 0} Reviews
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <div className="flex items-center space-x-2">
            <span
              className="text-lg font-bold text-gray-900"
              itemProp="price"
              content={discountedPrice}
            >
              {formattedPrice}
            </span>
            <span className="line-through text-xs text-gray-500">
              {originalPrice}
            </span>
            {data?.discount?.percentage > 0 && (
              <span className="text-green-700 font-medium text-sm">
                {data?.discount?.percentage}% off
              </span>
            )}
          </div>
          <meta itemProp="priceCurrency" content="INR" />
        </div>
      </div>
    </article>
  );
});

export default Card;
