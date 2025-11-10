import React  from "react";
import { useNavigate } from "react-router-dom";
import {formatAmount} from '../../lib/formatAmount';


const Card = React.memo(({ data }) => {
  const navigate = useNavigate();
  
  const discountedPrice =
    data?.price - (data?.price * data?.discount) / 100;
  const originalPrice = data?.price;


  return (
    <article
      className="max-w-[15rem] min-w-[14rem] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 hover:shadow-md transition"
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
          src={data?.frontImage}
          alt={data?.name || "Product Image"}
          className="object-contain h-full w-full"
          loading="lazy"
          itemProp="image"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3
          onClick={() => {
            navigate(`/product/${data?.slug || data?.name}`);
            scrollTo(0, 0);
          }}
          className="text-[14px] dark:text-gray-100 line-clamp-2 cursor-pointer hover:text-blue-600"
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
          <span className="text-sm dark:text-gray-300 text-gray-500 font-medium">
            {data?.numOfReviews || 0} Reviews
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-2" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <div className="flex items-center space-x-2">
            <span
              className="text-lg font-bold dark:text-gray-200"
              itemProp="price"
              content={discountedPrice}
            >
              {formatAmount(discountedPrice)}
            </span>
            <span className="line-through text-xs dark:text-gray-300 text-gray-500">
              {formatAmount(originalPrice)}
            </span>
            {data?.discount && (
              <span className="text-green-700 font-medium text-sm">
                {data?.discount}% off
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
