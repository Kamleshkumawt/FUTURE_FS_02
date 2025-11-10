import React, { useMemo, } from "react";
import Card from "../components/user/Card";
// import { useGetProductByCategoryQuery } from "../store/api/productApi";
import { useSearchParams } from "react-router-dom";
import { useSearchProductsQuery } from "../store/api/seller/productApi";
import CategorySideBar from "../components/user/CategorySidebar";
import { useGetAllCategoriesQuery } from "../store/api/user/categoryApi";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const SearchCategoryRoutes = () => {
  // const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");


  const { data, isLoading } = useSearchProductsQuery(query.trim(), {
      skip: !query || query.length === 0, // skip if no query
  });

  const { data: categoryData } = useGetAllCategoriesQuery();
  const products = data?.products || [];
  const categories = categoryData?.categories || [];
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
  
   

    // const { data, isLoading } = useGetProductByCategoryQuery(categoryId?.category?._id);

    // useEffect(() => {
    //  if (categoryId) {
    //     // console.log('categoryId from category API : ',categoryId);
    //  }
    // }, [categoryId]);
  
    // useEffect(() => {
    //   if (data) {
    //     console.log('products : ',data);
    //     // console.log('category data API se  : ',categories);
    //     setProducts(data.products);
    //   }
    // }, [data, query]);
    
    // useEffect(() => {
    //   if (data2) {
    //     console.log('category data API se  : ',data);
    //   }
    // }, [data2]);
  

  if (isLoading) return <Loading />;

  return !isLoading && (
    <div className="w-full h-full flex flex-col items-center justify-center px-10 sm:px-20 pt-20 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
      <div className="w-full h-full flex flex-col items-start justify-start gap-2">
        <h1 className="text-[24px] font-semibold mt-5">{query}</h1>
      </div>
      <div className="w-full h-full flex items-start justify-center">
        <div className="w-[23%] hidden sm:flex h-full  flex-col items-start justify-start py-5 gap-3">
          <CategorySideBar categories={categories} />
        </div>
        <div className="w-full sm:w-[77%] h-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 p-1 sm:p-5 gap-3">
         {filteredProducts.map((product) => (
          <Card key={product._id} data={product} />
        ))}
        {!filteredProducts.length && <h1>No products found</h1>}
        </div>
      </div>
    </div>
  );
};

export default SearchCategoryRoutes;
