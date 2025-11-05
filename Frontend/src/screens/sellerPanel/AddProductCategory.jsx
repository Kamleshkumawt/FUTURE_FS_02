import React, { useEffect, useState } from "react";
import Title from "../../components/sellerPanel/Title";
import {
  useGetAllCategoriesQuery,
  useGetCategoryByParentIdQuery,
} from "../../store/api/user/categoryApi";
import { useDispatch } from "react-redux";
import { setCategoryAndFrontImage } from "../..//store/slices/categorySlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

const AddProductCategory = () => {
  const [query, setQuery] = useState("");
  const [allCategoriesData, setAllCategoriesDate] = useState([]);
  const [selectedPath, setSelectedPath] = useState([]); // [mainId, subId, subSubId, ...]
  const [currentParentId, setCurrentParentId] = useState(null);
  const [categoryTree, setCategoryTree] = useState({});
  const [openAddProductImage, setOpenAddProductImage] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [sendImage, setSendImage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---------- API ----------
  const { data: allCategoriesDatas } = useGetAllCategoriesQuery();

  const shouldSkipSubCategoriesFetch = currentParentId === null || selectedPath.length >= 4;

  const { data: subCategoriesData } = useGetCategoryByParentIdQuery(
    currentParentId,
    {
      skip: shouldSkipSubCategoriesFetch, // Only run when parent is selected
    }
  );

  // ---------- Fetch All Categories on Mount ----------
  useEffect(() => {
    if (allCategoriesDatas) {
      setAllCategoriesDate(allCategoriesDatas.categories);
    }
  }, []);

  // ---------- Initialize root categories in categoryTree ----------
  // useEffect(() => {
  //   if (allCategoriesData.length) {
  //     const rootCategories = allCategoriesData.filter((cat) => !cat.parentId);
  //     setCategoryTree({ 0: rootCategories });
  //   }
  // }, [allCategoriesData]);

  useEffect(() => {
    if (allCategoriesData.length) {
      // filter root categories
      const rootCategories = allCategoriesData.filter((cat) => !cat.parentId);

      // ✅ if query exists, filter by category name
      const filteredCategories = query
        ? rootCategories.filter((cat) =>
            cat.name.toLowerCase().includes(query.toLowerCase().trim())
          )
        : rootCategories;

      setCategoryTree({ 0: filteredCategories });
    }
  }, [allCategoriesData, query]);

  // ---------- Update categoryTree when subcategories fetched ----------
//   useEffect(() => {
//     if (subCategoriesData?.categories) {
//       const level = selectedPath.length;
//       setCategoryTree((prev) => ({
//         ...prev,
//         [level]: subCategoriesData.categories,
//       }));
//     }
//   }, [subCategoriesData]);

useEffect(() => {
  if (subCategoriesData?.categories) {
    const level = selectedPath.length;
    if (level < 4) {   // <-- Add this check
      setCategoryTree((prev) => ({
        ...prev,
        [level]: subCategoriesData.categories,
      }));
    }
  }
}, [subCategoriesData]);

  // ---------- Handle selection change ----------
  const handleSelectChangeCategory = (level, categoryId) => {
    // Update path, cut off deeper levels if any
    const newPath = [...selectedPath.slice(0, level), categoryId];
    setSelectedPath(newPath);
    setCurrentParentId(categoryId);

    // Remove categoryTree levels deeper than current
    setCategoryTree((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((lvl) => {
        if (Number(lvl) > level) delete updated[lvl];
      });
      return updated;
    });
  };

  const getSelectedCategoryPath = () => {
  let path = [];

  Object.entries(selectedPath).forEach(([level, categoryId]) => {
    const categoriesAtLevel = categoryTree[level];
    const category = categoriesAtLevel?.find((cat) => cat._id === categoryId);
    if (category) {
      path.push(category.name);
    }
  });

  return path;
};

const handleAddProductCategory = () => {
  // console.log("Selected Category Path:", sendImage, selectedPath);
  dispatch(setCategoryAndFrontImage({
  image: sendImage,
  category: selectedPath[selectedPath.length - 1]
}));
navigate("/seller/add-product");
};

const handleImageUpload = (e) => {
  const file = e.target.files[0];

  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setSendImage(file);
    setShowImage(imageUrl);
  }
};

if (!categoryTree || Object.keys(categoryTree).length === 0) return <Loading/>

  return (
    <>
      <Title text1="Add" text2="Category" />

      {/* Search Bar */}
      <div className="w-full border border-gray-400 rounded-sm flex items-center gap-2 shadow-sm shadow-gray-300 p-[10px] bg-white mt-3">
        {/* Left Icon */}
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

        {/* Input */}
        <input
          type="text"
          placeholder="Try Saree, Kurti, Toys,Mugs adn more...."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          // onFocus={() => setShowDropdown(true)}
          //   onKeyDown={handleKeyDown}
          className="outline-none w-full bg-transparent placeholder:font-medium placeholder:text-[16px] placeholder:text-gray-400"
        />

        {/* Close Icon (optional) */}
        {query.length > 0 && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hover:cursor-pointer"
            onClick={() => {
              setQuery(""); // clear input
              // setShowDropdown(false); // optionally hide dropdown
            }}
          >
            <path
              d="M14.3034 15.7767L10.0124 11.4858L5.70897 15.7892C5.24694 16.2512 4.58159 16.3419 4.11956 15.8799C3.65753 15.4178 3.76954 14.7738 4.23157 14.3117L8.53496 10.0083L4.22267 5.69605C3.76064 5.23402 3.65753 4.58108 4.11956 4.11905C4.58159 3.65702 5.22039 3.77427 5.68243 4.2363L9.99472 8.54859L14.3123 4.23106C14.7743 3.76902 15.4183 3.65702 15.8804 4.11905C16.3424 4.58108 16.2517 5.24643 15.7897 5.70846L11.4721 10.026L15.7631 14.317C16.2251 14.779 16.3424 15.4178 15.8804 15.8799C15.4183 16.3419 14.7654 16.2388 14.3034 15.7767Z"
              fill="#666666"
            />
          </svg>
        )}
      </div>
      <div className="w-full flex flex-col sm:flex-row  gap-5  mt-4">
        <div className="max-w-6xl">
          <div className="w-full flex flex-col sm:flex-row gap-5 overflow-x-auto">
            {Object.entries(categoryTree).filter(([level]) => Number(level) < 4).map(([level, categories]) => (
              <div
                key={level}
                className="w-full flex flex-col bg-white rounded-sm min-w-[200px]"
              >
                <h1 className={`text-lg font-medium text-center border-b border-gray-300 py-3 ${Number(level) === 0 ? 'block' : ' hidden'}`}>
                  {Number(level) === 0
                    ? "Your Category"
                    : ``}   
                    {/* //Subcategories (Level ${level}) */}
                </h1>

                {categories.map((category) => (
                  <div
                    key={category._id}
                    onClick={() =>
                      handleSelectChangeCategory(Number(level), category._id)
                    }
                    className={`flex items-center p-2 cursor-pointer border-b border-gray-300 ${
                      selectedPath[Number(level)] === category._id
                        ? "bg-purple-300/40"
                        : ""
                    }`}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ---------- Final Selected Category ---------- */}
          {/* {selectedPath.length > 0 && (
            <div className="mt-6 bg-gray-100 p-4 rounded">
              <p className="font-semibold text-lg">Selected Category ID:</p>
              <p>{selectedPath[selectedPath.length - 1]}</p>
            </div>
          )} */}

        </div>
          {Object.keys(selectedPath).length === Object.keys(categoryTree).length && (
        <div className="max-w-xl bg-white rounded-sm flex flex-col items-center gap-5">
          <div className="bg-gray-200 w-full text-center p-2 max-w-sm">
            {getSelectedCategoryPath().join(" / ")}
          </div>
             {/* <div className="text-lg text-purple-600">
            Final Category: {getSelectedCategoryPath().slice(-1)[0]}
          </div> */}
        <div className="w-full flex flex-col  p-5 gap-5">
          <div className="grid grid-cols-2 gap-2">
            <img className="w-42 object-cover h-full" src="https://tse1.explicit.bing.net/th/id/OIP.AIVPgfM9nP5f3dC5-tFytQHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3" alt="img" />
            <img className="w-42 object-cover h-full" src="https://www.shutterstock.com/image-photo/mens-casual-outfit-fashion-clothing-260nw-1592874139.jpg" alt="img" />
            <img className="w-42 object-cover h-full" src="https://img.freepik.com/premium-photo/flat-lay-men-fashion-casual-outfits-with-accessories-gray-background_1207718-134286.jpg" alt="img" />
          <img className="w-42 object-cover h-full" src="https://tse4.mm.bing.net/th/id/OIP.-ckcGXBRnQjSTAjiLKO2NgHaFL?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3" alt="img" />
          </div>
           <p>Please provide only front image for each product</p>
         <div onClick={() => setOpenAddProductImage(true)} className="bg-purple-600 max-w-xs p-2 px-4 text-center rounded-sm font-medium text-white text-lg cursor-pointer">
          Add Product Images
         </div>
        </div>
        </div>
        )}
        </div>

        {openAddProductImage && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-gray-500/50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 flex flex-col items-center gap-5 min-w-xs">
              <h2 className="text-lg font-semibold mb-4 w-full flex items-center justify-between">Add Product Image  <span onClick={() => setOpenAddProductImage(false)} className="text-xl cursor-pointer hover:text-red-500">&times;</span></h2>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }} className="relative w-40 h-40 border border-gray-300 flex items-center justify-center">
                <img
                  src={showImage}
                  alt={showImage}
                  // onLoad={() => URL.revokeObjectURL(showImage)}
                  className="mb-4 absolute top-0 left-0 w-full h-full object-cover"
                />
                <h1>Click to Upload</h1>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mb-4 absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

              <button
                onClick={handleAddProductCategory}
                className="bg-purple-600 text-white py-2 px-4 rounded cursor-pointer"
              >
                Add Image
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default AddProductCategory;
