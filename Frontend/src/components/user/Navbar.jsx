import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "../user/ProfileDropdown";
import Loading from "../Loading";
import { useSearchProductsQuery } from "../../store/api/seller/productApi";
import ThemeToggle from "../user/ThemeToggle";

const popularSearches = [
  "saree",
  "short kurti",
  "tshirt",
  "watch",
  "kurti",
  "earring",
  "shoes",
  "kurti set",
  "top for women",
  "jeans",
  "slipper",
  "top",
  "bangle",
  "blouse",
  "cotton saree",
  "shirt for men",
];

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const containerRef = useRef(null);
  // const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const [searchTrigger, setSearchTrigger] = useState(""); // trigger RTK Query manually

  // RTK Query
  const { data, isLoading } = useSearchProductsQuery(searchTrigger, {
    skip: searchTrigger.length < 1,
  });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (data?.success) {
      // console.log("Search Results:", data.products);
      // Navigate to search results page with query param
      navigate(`/products/search?query=${encodeURIComponent(searchTrigger)}`);
    }
  }, [data, navigate, searchTrigger]);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(term) {
    const trimmed = term.trim();
    if (!trimmed) return;

    const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)];
    const limited = updated.slice(0, 5);
    setRecentSearches(limited);
    localStorage.setItem("recentSearches", JSON.stringify(limited));

    setSearchTrigger(trimmed);

    setQuery(trimmed);
    setShowDropdown(false);
    // console.log("Search:", trimmed);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  }

  const filteredRecent = recentSearches.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPopular = popularSearches.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return !isLoading ? (
    <div className="fixed w-full z-50 bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100">
      <div className=" w-full h-[70px] flex items-center justify-between sm:px-20 px-5 py-2 border-b-2 border-gray-300 dark:border-gray-600 z-50">
        <span
          onClick={() => {
            navigate("/");
            scrollTo(0, 0);
          }}
          className="text-xl sm:text-2xl  cursor-pointer "
        >
          {/* <ThemeToggle /> */}
          ApanaStore
        </span>
        <div
          className="relative w-full max-w-2xl mx-auto px-4"
          ref={containerRef}
        >
          {/* Search Bar */}
          <div className="w-full border border-gray-400 dark:border-gray-800 rounded-sm flex items-center gap-2 shadow-sm shadow-gray-300 p-[10px] bg-gray-50 dark:bg-neutral-950">
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
              placeholder="Try Saree, Kurti or Search by Product Code"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
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
                  setShowDropdown(false); // optionally hide dropdown
                }}
              >
                <path
                  d="M14.3034 15.7767L10.0124 11.4858L5.70897 15.7892C5.24694 16.2512 4.58159 16.3419 4.11956 15.8799C3.65753 15.4178 3.76954 14.7738 4.23157 14.3117L8.53496 10.0083L4.22267 5.69605C3.76064 5.23402 3.65753 4.58108 4.11956 4.11905C4.58159 3.65702 5.22039 3.77427 5.68243 4.2363L9.99472 8.54859L14.3123 4.23106C14.7743 3.76902 15.4183 3.65702 15.8804 4.11905C16.3424 4.58108 16.2517 5.24643 15.7897 5.70846L11.4721 10.026L15.7631 14.317C16.2251 14.779 16.3424 15.4178 15.8804 15.8799C15.4183 16.3419 14.7654 16.2388 14.3034 15.7767Z"
                  fill="#666666"
                />
              </svg>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown &&
            (filteredRecent.length > 0 || filteredPopular.length > 0) && (
              <div className="absolute top-full left-0 mt-2 w-full bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-gray-800 shadow-lg rounded-md z-50 max-h-72 overflow-y-auto">
                {/* Recent Searches */}
                {filteredRecent.length > 0 && (
                  <div className="px-4 py-3 border-b">
                    <h4 className="text-base text-gray-700 dark:text-gray-200 font-semibold mb-2">
                      Recent Searches
                    </h4>
                    <ul className="space-y-2">
                      {filteredRecent.map((item) => (
                        <li
                          key={item}
                          className="cursor-pointer text-sm text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900  flex items-center gap-2 px-2 py-1 rounded"
                          onClick={() => handleSearch(item)}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.167 2.717A10 10 0 0 1 10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10a.833.833 0 1 1 1.667 0 8.333 8.333 0 1 0 2.608-6.042h1.8a.833.833 0 0 1 0 1.667H2.333a.833.833 0 0 1-.833-.833V1.05a.833.833 0 0 1 1.667 0v1.667Zm6 3.95a.833.833 0 1 1 1.667 0v3.591l3.774.742a.838.838 0 0 1-.166 1.667h-.167l-4.441-.892a.833.833 0 0 1-.667-.833V6.667Z"
                              fill="#666"
                            />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Popular Searches */}
                {filteredPopular.length > 0 && (
                  <div className="px-4 py-3">
                    <h4 className="text-base text-gray-700 dark:text-gray-200 font-semibold mb-2">
                      Popular Searches
                    </h4>
                    <ul className="flex flex-wrap gap-2">
                      {filteredPopular.map((item) => (
                        <li
                          key={item}
                          className="cursor-pointer text-sm text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 shadow-xs shadow-gray-400 border border-gray-300 px-4 py-2 rounded-full"
                          onClick={() => handleSearch(item)}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
        </div>

        <div className="flex items-center justify-between gap-7">
          <span
            onClick={() => {
              navigate("/seller/SignUp");
              scrollTo(0, 0);
            }}
            className="text-[16px] hidden sm:flex cursor-pointer"
          >
            Become a Supplier
          </span>
          <span className=" h-9 w-px bg-gray-300 dark:bg-gray-400 sm:flex hidden"></span>
          {/* <span className="text-[16px] cursor-pointer">Investor Relations</span>
          <span className="w-[2px] h-9 bg-gray-300"></span> */}

          <div className="flex items-center gap-6">
            {/* Profile Icon */}
            <div
              className="flex flex-col items-center  group"
              aria-label="Profile"
            >
              <ProfileDropdown />
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className=" flex-col items-center gap-1 sm:flex hidden cursor-pointer"
              aria-label="Cart"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-900 dark:text-gray-300"
              >
                <path
                  d="m4.987 5.469 1.848 7.2a1 1 0 0 0 .968.752h8.675a1 1 0 0 0 .962-.726l1.697-5.952a1 1 0 0 0-.962-1.274H4.987Zm0 0-.943-3.248a1 1 0 0 0-.96-.721H1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="9.421"
                  cy="16.744"
                  rx="1.243"
                  ry="1.256"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <ellipse
                  cx="15.221"
                  cy="16.744"
                  rx="1.243"
                  ry="1.256"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>

              <span>Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Navbar;
