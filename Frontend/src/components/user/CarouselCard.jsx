import React from "react";
import { useNavigate } from "react-router-dom";
import { setCategories } from "../../store/slices/categorySlice";
import { useDispatch } from "react-redux";
import { formatAmount } from "../../lib/formatAmount";

const CarouselCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        const category = data?.categoryId;
        const categoryName = category?.name;

        if (categoryName) {
          dispatch(setCategories(category)); // ✅ Dispatch on click
          navigate(`/category/search/${categoryName}`);
          window.scrollTo(0, 0);
        } else {
          console.warn("Category name is missing");
        }
      }}
      className="max-w-[13rem] min-w-[10rem] overflow-hidden p-3 space-y-2 bg-white"
    >
      {/* Image container */}
      <div className="w-full h-48 flex items-center justify-center">
        <img
          // src="https://rukminim1.flixcart.com/image/420/420/xif0q/headphone/3/m/u/nb111-wireless-headphone-magnetic-neckband-250h-standby-200mah-original-imah77cwrvwjzbyt.jpeg?q=60"
          src={data?.frontImage}
          alt={data?.name}
          className="h-full object-contain"
        />
      </div>

      {/* Text content */}
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-gray-500  font-medium text-sm">
          From {data?.name.slice(0, 20)}
        </span>
        <span className="text-sm font-semibold text-gray-900">
          From{" "}
          {formatAmount(data?.price)}*
        </span>
      </div>
    </div>
  );
};

export default CarouselCard;
