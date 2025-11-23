import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Card from "../components/user/Card";
import HomePageCard from "../components/user/HomePageCard";
import ManualCarousel from "../components/user/Carousel";
import CategorySideBar from "../components/user/CategorySidebar";
import Loading from "../components/Loading";
import {useGetAllProductsQuery } from "../store/api/seller/productApi";
import { useGetAllCategoriesQuery } from "../store/api/user/categoryApi";

// ✅ Helper — unique products by category
const getUniqueCategoryProducts = (products, limit = 8) => {
  // console.log('products : ',products);
  const result = [];
  const seenCategories = new Set();

  for (const product of products) {
    const category = product.category?.name;
    if (!category || seenCategories.has(category)) continue;

    result.push(product);
    seenCategories.add(category);
    if (result.length >= limit) break;
  }
  // console.log('result : ',result);
  return result;
};

const Home = () => {
  // ✅ Data fetching using RTK Query (no manual state)
  const { data, isLoading } = useGetAllProductsQuery();
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

  // ✅ Derived data
  const uniqueProducts = useMemo(() => getUniqueCategoryProducts(products), [products]);
  const mid = Math.ceil(uniqueProducts.length / 2);
  const firstHalf = uniqueProducts.slice(0, mid);
  const secondHalf = uniqueProducts.slice(mid);
  const topDeals = products.slice(0, 9);

  // ✅ Render
  if (isLoading) return <Loading />;

  return (
    <div className="w-full min-h-screen px-4 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 py-30">
      {/* Hero Banner */}
      <div>
        <img
          src="https://rukminim2.flixcart.com/fk-p-flap/3600/3600/image/a85bf06bede8464f.jpg?q=80"
          alt="Banner"
          className="w-full"
        />
      </div>

      {/* Top Deals Carousel */}
      <section className="w-full px-2 bg-white dark:bg-neutral-800 my-4">
        <h1 className="text-2xl font-semibold mb-2">Top Deals Product</h1>
        <ManualCarousel data={topDeals} />
      </section>

      {/* Promo Banners */}
      <div className="w-full flex justify-center gap-2 flex-wrap my-6">
        {Array(4)
          .fill(
            "https://rukminim1.flixcart.com/fk-p-flap/1600/660/image/cb7abaa53e8b0fdb.jpg?q=60"
          )
          .map((src, i) => (
            <img key={i} src={src} alt="promo" className="w-[23%] rounded-md" />
          ))}
      </div>

      {/* Category Highlight Sections */}
      <div className="w-full flex flex-wrap justify-center gap-3 mb-10">
        {/* Left Block */}
        <div className="w-[32%] bg-white dark:bg-neutral-800 p-3 rounded shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold">Make Your Style</h1>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full cursor-pointer">
              {">"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {firstHalf.map((product) => (
              <HomePageCard key={product.id} data={product} />
            ))}
          </div>
        </div>

        {/* Middle Block */}
        <div className="w-[32%] bg-white dark:bg-neutral-800 p-3 rounded shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold">Shop Your Favorites</h1>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full cursor-pointer">
              {">"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {secondHalf.map((product) => (
              <HomePageCard key={product.id} data={product} />
            ))}
          </div>
        </div>

        {/* Right Image Block */}
        <div className="w-[32%] h-152">
          <img
            src="https://rukminim1.flixcart.com/www/1060/1460/promos/26/09/2023/6c3c5fe2-c236-4fa2-8d97-595e1e01da01.jpg?q=60"
            className="object-cover w-full h-full rounded"
            alt="style-banner"
          />
        </div>
      </div>

      {/* Product Section */}
      <h1 className="text-3xl font-semibold px-5 mb-3">Products For You</h1>
      <div className="flex px-5 gap-3">
        <div className="w-[23%]">
          <CategorySideBar categories={categories} />
        </div>
        <div className="w-[77%] grid grid-cols-4 gap-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} data={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
