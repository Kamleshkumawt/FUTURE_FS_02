import React, { useMemo } from "react";
import Card from "../components/user/Card";
// import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";
import { useGetProductsByCategoryQuery } from "../store/api/seller/productApi";
import CategorySideBar from "../components/user/CategorySidebar";

const CategoryProduct = () => {
  // const [getAllProduct, { data }] = useGetAllProductMutation();
  
  const category = useSelector((state) => state.category.list);
  // console.log('category data redux : ',category);
  const categoryArray = [category];
  // console.log('category array : ',categoryArray);

  // console.log('categories data redux : ',categories);

  // Find the matching category from the Redux store
  // const category = categories.find(
  //   (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  // );

  const categoryId = category?._id;

    const { data, isLoading } = useGetProductsByCategoryQuery(categoryId);

    // useEffect(() => {
    //   getAllProduct();
    //   // getProductByCategory(id);
    // }, []);
  
    // useEffect(() => {
    //   if (data) {
    //     // console.log('products : ',data.products);
    //     // console.log('category data API se  : ',categories);
    //     setProducts(data.products);
    //   }
    // }, [data]);
    
    // useEffect(() => {
    //   if (data2) {
    //     console.log('category data API se  : ',data);
    //   }
    // }, [data2]);
    const products = data?.products || [];
    // const categories = categoryData?.categories || [];
    const categories = categoryArray || [];
     // ✅ Redux filter states
      const {
        selectedCategories,
        selectedColors,
        selectedFabrics,
        checkedRatings,
        selectedCombos,
        selectedGenders,
        selectedPrice,
        selectedDiscounts,
        selectedSize,
      } = useSelector((state) => state.filters);
    
      // ✅ Filter products efficiently (memoized)
      const filteredProducts = useMemo(() => {
        return products.filter((product) => {
          const {
            categoryId,
            color = "",
            material = "",
            rating = 0,
            comboType,
            gender,
            price,
            discount,
            size,
          } = product;
    
          // category filter
          if (
            selectedCategories.length > 0 &&
            !selectedCategories.includes(categoryId?._id)
          )
            return false;
    
          // color filter
          if (
            selectedColors.length > 0 &&
            !selectedColors.some(
              (c) => c.toLowerCase().trim() === color.toLowerCase().trim()
            )
          )
            return false;
    
          // fabric filter
          if (
            selectedFabrics.length > 0 &&
            !selectedFabrics.some(
              (f) => f.toLowerCase().trim() === material.toLowerCase().trim()
            )
          )
            return false;
    
          // rating filter
          if (
            checkedRatings.length > 0 &&
            !checkedRatings.includes(Math.floor(rating))
          )
            return false;
    
          // combo filter
          if (selectedCombos.length > 0 && !selectedCombos.includes(comboType))
            return false;
    
          // gender filter
          if (selectedGenders.length > 0 && !selectedGenders.includes(gender))
            return false;
    
          // price filter
          if (selectedPrice.length > 0) {
            const match = selectedPrice.some((range) => {
              if (range === "under100") return price < 100;
              if (range === "100to500") return price >= 100 && price <= 500;
              if (range === "above500") return price > 500;
              return false;
            });
            if (!match) return false;
          }
    
          // discount filter
          if (
            selectedDiscounts.length > 0 &&
            !selectedDiscounts.includes(discount)
          )
            return false;
    
          // size filter (handles both string and array)
          if (
            selectedSize.length > 0 &&
            !(
              Array.isArray(size)
                ? size
                : [size]
            ).some((s) =>
              selectedSize
                .map((x) => x.toLowerCase().trim())
                .includes(String(s).toLowerCase().trim())
            )
          )
            return false;
    
          return true;
        });
      }, [
        products,
        selectedCategories,
        selectedColors,
        selectedFabrics,
        checkedRatings,
        selectedCombos,
        selectedGenders,
        selectedPrice,
        selectedDiscounts,
        selectedSize,
      ]);

if (isLoading) return <Loading />;

  return !isLoading ? (
    <div className="w-full h-full flex flex-col items-center justify-center px-2 sm:px-20 pt-20">
      <div className="w-full h-full flex flex-col items-start justify-start gap-2 pt-10">
        {/* <p className="text-[16px] mt-2">
          Home/Women/Women Western Wear/Palazzo Pants
        </p> */}
        <h1 className="text-[24px] font-semibold">{category?.name}</h1>
        <p className="text-[17px] hidden sm:flex text-gray-700 dark:text-gray-400 font-medium">
          Showing 21-40 out of 10000 products
        </p>
        <p className="text-[14px] text-gray-500 hidden sm:flex dark:text-gray-300">
          {/* We love to be fashionable and always try to experiment with different
          types of styles so is the case with bottom wear as well. There are
          lots of bottom wear available but palazzos are getting very popular
          these days. Palazzos were very much in trend in the ’60s, 70’s, and in
          retro time from daily wear to occasional, ethnic to formal, normal as
          well as ramp walk also. Since then from Bollywood to Hollywood
          everyone is making space for this bottom wear and Meesho provides you
          a wide range of palazzo from simple to stylish to choose from. */}
          {category?.description}
        </p>
      </div>
      <div className="w-full h-full flex items-start justify-center">
        <div className="w-[23%] hidden sm:flex h-full  flex-col items-start justify-start py-5 gap-3">
          <CategorySideBar categories={categories} />
        </div>
        <div className="w-[77%] h-full grid  xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 p-2 sm:p-5 gap-3">
         {filteredProducts.map((product) => (
          <Card key={product._id} data={product} />
        ))}
         {!filteredProducts.length && <h1>No products found</h1>}
        </div>
      </div>
    </div>
  ) : <Loading/>
};

export default CategoryProduct;
