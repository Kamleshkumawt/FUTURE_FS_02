import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedCategories,
  setSelectedColors,
  setSelectedFabrics,
  setCheckedRatings,
  setSelectedCombos,
  setSelectedGenders,
  setSelectedPrice,
  setSelectedDiscounts,
  setSelectedSize,
} from "../../store/slices/productsFilterSlice";

const ratingOptions = [
  { label: "2.0 and above", value: "2.0" },
  { label: "3.0 and above", value: "3.0" },
  { label: "3.5 and above", value: "3.5" },
  { label: "4.0 and above", value: "4.0" },
  { label: "M-Trusted", value: "m_trusted" },
];

const fabricOptions = [
  "Acrylic",
  "Chambray",
  "Chiffon",
  "Cotton",
  "Cotan",
  "Cotton Blend",
  "Cotton Linen",
  "Cotton Silk",
  "Crepe",
  "Hosiery",
  "Khadi Cotton",
  "Linen",
  "Lycra",
  "Mulmul",
  "Net",
  "Nylon",
  "Nylon Elastane",
  "Nylon Spandex",
  "Poly Cotton",
  "Polyester",
  "Rayon",
  "Satin",
  "Silk",
  "Silk Blend",
  "Spandex",
  "Viscose",
  "Viscose Spandex",
];

const colorOptions = [
  "Beige",
  "Black",
  "Brown",
  "Grey",
  "Maroon",
  "Multicolor",
  "Nude",
  "Olive",
  "Orange",
  "Pink",
  "Purple",
  "Red",
  "Silver",
  "Skin", // "Skin" appears twice in your list — keep only one
  "White",
  "multiColour",
];

const comboOptions = [
  "Combos",
  "Pack of 1",
  "Pack of 2",
  "Pack of 3",
  "Pack of 4",
  "Pack of 5",
  "Pack of 6",
  "Single",
];

const discountOptions = [
  "10% And Above",
  "20% And Above",
  "30% And Above",
  "40% And Above",
  "50% And Above",
  "All Discounted",
  "Deals",
];

const genderOptions = ["Men", "Women", "Boys", "Girls"];

const priceOptions = [
  { label: "Under 100", value: "under100" },
  { label: "100 to 500", value: "100to500" },
  { label: "Above 500", value: "above500" },
];

const sizeOptions = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
  "7XL",
  "8XL",
  "9XL",
  "10XL",
  "FreeSize",
];

const CategorySideBar = ({ categories }) => {
  const [openMenu, setOpenMenu] = useState(null);
  // const [checkedSize, setCheckedSize] = useState(false);
  const [checkedStyling, setCheckedStyling] = useState(false);
  // const [selectedGenders, setSelectedGenders] = useState([]);
  // const [price, setPrice] = useState(false);
  // const [checkedRatings, setCheckedRatings] = useState([]);
  // const [selectedColors, setSelectedColors] = useState([]);
  // const [selectedFabrics, setSelectedFabrics] = useState([]);
  // const [selectedCombos, setSelectedCombos] = useState([]);
  // const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [query, setQuery] = useState("");
  const [showAllFabrics, setShowAllFabrics] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const selectedCategories = useSelector(
    (state) => state.filters.selectedCategories
  );
  const selectedColors = useSelector((state) => state.filters.selectedColors);
  const selectedFabrics = useSelector((state) => state.filters.selectedFabrics);
  const checkedRatings = useSelector((state) => state.filters.checkedRatings);
  const selectedCombos = useSelector((state) => state.filters.selectedCombos);
  const selectedGenders = useSelector((state) => state.filters.selectedGenders);
  const selectedPrice = useSelector((state) => state.filters.selectedPrice);
  const selectedDiscounts = useSelector(
    (state) => state.filters.selectedDiscounts
  );
  const selectedSize = useSelector((state) => state.filters.selectedSize);

  const dispatch = useDispatch();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(query.toLowerCase())
  );

  const visibleCategories = showAllCategories
    ? filteredCategories.slice(0, 40)
    : filteredCategories.slice(0, 12);

  const visibleFabrics = showAllFabrics
    ? fabricOptions
    : fabricOptions.slice(0, 12);

  const toggleValue = (value, array) =>
    array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];

  const handleRatingChange = (value) => {
    const updated = toggleValue(value, checkedRatings);
    dispatch(setCheckedRatings(updated));
  };

  const togglePrice = (color) => {
    const updated = toggleValue(color, selectedPrice);
    dispatch(setSelectedPrice(updated));
  };
  const toggleColor = (color) => {
    const updated = toggleValue(color, selectedColors);
    dispatch(setSelectedColors(updated));
  };

  const toggleFabric = (fabric) => {
    const updated = toggleValue(fabric, selectedFabrics);
    dispatch(setSelectedFabrics(updated));
  };

  const toggleCombo = (combo) => {
    const updated = toggleValue(combo, selectedCombos);
    dispatch(setSelectedCombos(updated));
  };

  const toggleDiscount = (discount) => {
    const updated = toggleValue(discount, selectedDiscounts);
    dispatch(setSelectedDiscounts(updated));
  };
  const toggleSize = (discount) => {
    const updated = toggleValue(discount, selectedSize);
    dispatch(setSelectedSize(updated));
  };

  const handleGenderClick = (gender) => {
    const updated = toggleValue(gender, selectedGenders);
    dispatch(setSelectedGenders(updated));
  };

  const handleClick = (categoryId) => {
    const upload = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    dispatch(setSelectedCategories(upload));
  };

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };
  return (
    <div className="w-full h-full flex flex-col items-start justify-start py-5 gap-3 dark:bg-neutral-900 text-gray-900 dark:text-gray-100">
      <div className="border border-gray-200 dark:border-gray-600 rounded-sm p-2 w-full flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 dark:text-gray-200 font-medium"> Sort by :</span>{" "}
          Relevance
        </div>
        <svg
          viewBox="0 0 7 12"
          width="12"
          height="12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          // ml="9.5"
          className="rotate-90"
        >
          <path
            d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
            fill="#666"
          ></path>
        </svg>
      </div>

      <div className="border border-gray-200 dark:border-gray-600 rounded-sm p-2 w-full flex flex-col gap-4 px-3">
        <div className="flex flex-col items-start gap-1">
          <h1 className="font-semibold text-black dark:text-gray-200">FILTERS</h1>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">1000+ Products</p>
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>
        {/* Category */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-[18px] font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("category")}
          >
            <span className="flex gap-2 items-center">Category</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "category" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "category" && (
            <div className="ml-1 flex flex-col gap-2">
              <div className="w-full border border-gray-400 dark:border-gray-600 rounded-sm flex items-center gap-2 text-sm shadow-sm shadow-gray-300 p-[5px] bg-white">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.7695 18.6698L16.0096 14.9098C17.3296 13.3298 18.1296 11.2999 18.1296 9.07989C18.1296 4.05995 14.0697 0 9.05978 0C4.0599 0 0 4.05995 0 9.07989C0 14.0998 4.0599 18.1598 9.05978 18.1598C11.2897 18.1598 13.3297 17.3498 14.9096 16.0098L18.6695 19.7698C18.9695 20.0698 19.4695 20.0698 19.7695 19.7698C20.0795 19.4698 20.0795 18.9698 19.7695 18.6698ZM9.05978 16.5998C4.91988 16.5998 1.54996 13.2298 1.54996 9.07989C1.54996 4.92994 4.91988 1.55998 9.05978 1.55998C13.1997 1.55998 16.5696 4.92994 16.5696 9.07989C16.5696 13.2298 13.1997 16.5998 9.05978 16.5998Z"
                    fill="#8B8BA3"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search... "
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="outline-none w-full bg-transparent placeholder:font-medium placeholder:text-[16px] placeholder:text-gray-400"
                />
              </div>
              {visibleCategories?.map((category) => (
                <div
                  className="flex gap-2 group hover:cursor-pointer"
                  key={category._id}
                >
                  <div
                    className="ml-6 flex gap-2 group hover:cursor-pointer"
                    onClick={() => handleClick(category._id)}
                  >
                    <input
                      type="checkbox"
                      className="transition w-4 cursor-pointer accent-pink-400 "
                      checked={selectedCategories.includes(category._id)}
                      onChange={() => {}} // Required to suppress React warning
                    />
                    <span className="text-gray-500">{category?.name}</span>
                  </div>
                </div>
              ))}

              {/* Show More / Show Less Toggle */}
              {categories.length > 12 && (
                <button
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  className="text-pink-600 text-sm font-medium mt-2 self-start cursor-pointer"
                >
                  {showAllCategories ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600 "></span>

        {/* Gender */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-lg font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("gender")}
          >
            <span className="flex gap-2 items-center">Gender</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "gender" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "gender" && (
            <div className="flex gap-2 flex-wrap">
              {genderOptions.map((gender) => (
                <div
                  key={gender}
                  onClick={() => handleGenderClick(gender)}
                  className={`border rounded-full px-3 py-1 w-20 text-center text-gray-400 cursor-pointer ${
                    selectedGenders.includes(gender)
                      ? "bg-pink-400/20 text-pink-500 font-medium border-pink-400"
                      : ""
                  }`}
                >
                  {gender}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>

        {/*color */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-lg font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("color")}
          >
            <span className="flex gap-2 items-center">Color</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "color" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "color" && (
            <div className="ml-6 flex flex-wrap gap-3">
              {colorOptions.map((color) => {
                const isSelected = selectedColors.includes(color);
                return (
                  <div
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`border rounded-full px-3 py-1 text-center cursor-pointer capitalize
                          ${
                            isSelected
                              ? "bg-pink-400/20 text-pink-500 font-medium border-pink-400"
                              : "text-gray-400 border-gray-300"
                          }
                        `}
                  >
                    {color}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>

        {/*fabric */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-[18px] font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("fabric")}
          >
            <span className="flex gap-2 items-center">Fabric</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "fabric" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "fabric" && (
            <div className="ml-6 flex flex-col gap-2">
              {visibleFabrics.map((fabric) => (
                <div
                  key={fabric}
                  className="flex gap-2 group hover:cursor-pointer"
                  onClick={() => toggleFabric(fabric)}
                >
                  <input
                    type="checkbox"
                    className="transition w-4 cursor-pointer accent-pink-400"
                    checked={selectedFabrics.includes(fabric)}
                    onChange={() => {}}
                  />
                  <span className="text-gray-500">{fabric}</span>
                </div>
              ))}

              {/* Show More / Show Less Toggle */}
              {fabricOptions.length > 12 && (
                <button
                  onClick={() => setShowAllFabrics((prev) => !prev)}
                  className="text-pink-500 text-sm font-medium mt-2 self-start cursor-pointer"
                >
                  {showAllFabrics ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>

        {/* size */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-[18px] font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("size")}
          >
            <span className="flex gap-2 items-center">Size</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "size" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "size" && (
            <div className="ml-6 flex flex-wrap gap-3">
              {sizeOptions.map((size) => (
                <div
                  key={size}
                  className="flex items-center gap-2 group hover:cursor-pointer"
                  onClick={() => toggleSize(size)}
                >
                  <input
                    type="checkbox"
                    className="transition w-4 h-4 cursor-pointer accent-pink-400"
                    checked={selectedSize.includes(size)}
                    onChange={() => {}} // To suppress React warning
                  />
                  <span className="text-gray-500">{size}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>

        {/* Price */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-lg font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("price")}
          >
            <span className="flex gap-2 items-center">Price</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "price" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "price" && (
            <div className="flex gap-2 flex-wrap">
              {priceOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => togglePrice(option.value)}
                  className={`border rounded-full px-3 py-1 text-center text-gray-400 cursor-pointer ${
                    selectedPrice.includes(option.value)
                      ? "bg-pink-400/20 text-pink-500 font-medium border-pink-400"
                      : ""
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>
        {/* rating */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-[18px] font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("rating")}
          >
            <span className="flex gap-2 items-center">Rating</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "rating" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "rating" && (
            <div className="ml-6 flex flex-col gap-2">
              {ratingOptions.map(({ label, value }) => (
                <div
                  key={value}
                  className="flex gap-2 group hover:cursor-pointer"
                  onClick={() => handleRatingChange(value)}
                >
                  <input
                    type="checkbox"
                    className="transition w-4 cursor-pointer accent-pink-400"
                    checked={checkedRatings.includes(value)}
                    onChange={() => {}} // still needed for React's controlled warning
                  />
                  <span className="text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>
        {/* Combo */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-[18px] font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("combo")}
          >
            <span className="flex gap-2 items-center">Combo</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "combo" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "combo" && (
            <div className="ml-6 flex flex-col gap-2">
              {comboOptions.map((combo) => (
                <div
                  key={combo}
                  className="flex gap-2 group hover:cursor-pointer"
                  onClick={() => toggleCombo(combo)}
                >
                  <input
                    type="checkbox"
                    className="transition w-4 cursor-pointer accent-pink-400"
                    checked={selectedCombos.includes(combo)}
                    onChange={() => {}} // Prevents React warning
                  />
                  <span className="text-gray-500">{combo}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600"></span>
        {/* discount */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-lg font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("discount")}
          >
            <span className="flex gap-2 items-center">Discount</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "discount" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "discount" && (
            <div className="ml-6 flex flex-wrap gap-5">
              {discountOptions.map((option) => {
                const isSelected = selectedDiscounts.includes(option);
                return (
                  <div
                    key={option}
                    onClick={() => toggleDiscount(option)}
                    className={`border rounded-full px-3 py-1 text-center cursor-pointer 
                          ${
                            isSelected
                              ? "bg-pink-400/20 text-pink-500 font-medium border-pink-400"
                              : "text-gray-400 border-gray-300"
                          }
                        `}
                  >
                    {option}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <span className=" block w-full border border-gray-200 dark:border-gray-600 "></span>
        {/* surface styling */}
        <div className="flex flex-col gap-3 ">
          <div
            className="text-[18px] font-semibold flex items-center justify-between cursor-pointer group  "
            onClick={() => toggleMenu("surface styling")}
          >
            <span className="flex gap-2 items-center">Surface Styling</span>
            <svg
              viewBox="0 0 7 12"
              width="12"
              height="12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              // ml="9.5"
              className={`transition-transform duration-300 ${
                openMenu === "surface styling" ? "rotate-270" : "rotate-90"
              }`}
            >
              <path
                d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
                fill="#666"
              ></path>
            </svg>
          </div>
          {openMenu === "surface styling" && (
            <div
              className="ml-6 flex gap-2 group hover:cursor-pointer"
              onClick={() => setCheckedStyling(!checkedStyling)}
            >
              <input
                type="checkbox"
                className="transition w-4 cursor-pointer accent-pink-400 "
                checked={checkedStyling}
                onChange={() => {}} // Required to suppress React warning
              />
              <span className="text-gray-500">{"Bow"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategorySideBar;
