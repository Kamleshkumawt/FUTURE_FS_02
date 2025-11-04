import React, { useState, useMemo, useCallback } from "react";
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
} from "../store/slices/productsFilterSlice";

// ✅ Utility reusable component for each collapsible section
const FilterSection = React.memo(({ title, isOpen, toggleMenu, children }) => (
  <section className="flex flex-col gap-3 w-full" aria-label={title}>
    <button
      onClick={() => toggleMenu(title)}
      className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-800 hover:text-pink-600 transition"
      aria-expanded={isOpen}
    >
      {title}
      <svg
        viewBox="0 0 7 12"
        width="12"
        height="12"
        className={`transition-transform duration-300 ${
          isOpen ? "rotate-270" : "rotate-90"
        }`}
      >
        <path
          d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z"
          fill="#666"
        />
      </svg>
    </button>
    {isOpen && <div className="ml-3 flex flex-col gap-2">{children}</div>}
    <hr className="border-gray-200" />
  </section>
));

const CategorySideBar = ({ categories }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch();

  // ✅ Extract Redux filters
  const filters = useSelector((state) => state.filters);

  // ✅ useMemo for filtered categories (avoids re-filtering on each render)
  const filteredCategories = useMemo(
    () =>
      categories
        .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, showAll ? 40 : 12),
    [categories, query, showAll]
  );

  // ✅ Generic toggle helper to reduce duplicate code
  const handleToggle = useCallback((setter, value, array) => {
    const updated = array.includes(value)
      ? array.filter((v) => v !== value)
      : [...array, value];
    dispatch(setter(updated));
  }, [dispatch]);

  const toggleMenu = (menu) => setOpenMenu((prev) => (prev === menu ? null : menu));

  return (
    <aside className="w-full h-full p-4 bg-white border rounded-md shadow-sm">
      {/* Sort Header */}
      <header className="flex items-center justify-between border p-2 rounded text-gray-700 font-medium mb-3">
        <span>Sort by: <strong>Relevance</strong></span>
        <svg viewBox="0 0 7 12" width="12" height="12" className="rotate-90">
          <path d="M.31.316a1.079 1.079 0 0 0 0 1.515l4.125 4.17-4.124 4.17a1.079 1.079 0 0 0 0 1.515 1.05 1.05 0 0 0 1.499 0l4.88-4.933a1.079 1.079 0 0 0 0-1.515L1.81.305a1.06 1.06 0 0 0-1.5.01Z" fill="#666"/>
        </svg>
      </header>

      {/* =================== Filters =================== */}

      {/* Category Section */}
      <FilterSection title="Category" isOpen={openMenu === "Category"} toggleMenu={toggleMenu}>
        <div className="flex items-center gap-2 border p-2 rounded">
          <input
            type="text"
            placeholder="Search categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent text-sm"
            aria-label="Search categories"
          />
        </div>

        {filteredCategories.map((cat) => (
          <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.selectedCategories.includes(cat._id)}
              onChange={() =>
                handleToggle(setSelectedCategories, cat._id, filters.selectedCategories)
              }
              className="accent-pink-500"
            />
            <span className="text-gray-600 text-sm">{cat.name}</span>
          </label>
        ))}

        {categories.length > 12 && (
          <button
            onClick={() => setShowAll((p) => !p)}
            className="text-pink-500 text-sm mt-1 self-start hover:underline"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}
      </FilterSection>

      {/* Gender Section */}
      <FilterSection title="Gender" isOpen={openMenu === "Gender"} toggleMenu={toggleMenu}>
        {["Men", "Women", "Boys", "Girls"].map((gender) => (
          <button
            key={gender}
            onClick={() =>
              handleToggle(setSelectedGenders, gender, filters.selectedGenders)
            }
            className={`px-3 py-1 text-sm rounded-full border transition ${
              filters.selectedGenders.includes(gender)
                ? "bg-pink-100 border-pink-400 text-pink-600"
                : "text-gray-500 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {gender}
          </button>
        ))}
      </FilterSection>

      {/* You can repeat <FilterSection> for Color, Fabric, Size, Price, Rating, etc.
          using the same handleToggle logic to keep code DRY and consistent. */}
    </aside>
  );
};

export default CategorySideBar;
