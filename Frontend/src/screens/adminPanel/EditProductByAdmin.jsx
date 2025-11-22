import React, { useState } from "react";
import Title from "../../components/sellerPanel/Title";
import Loading from "../../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetProductBySlugQuery } from "../../store/api/seller/productApi";
import { useUpdateProductByAdminMutation } from "../../store/api/admin/adminApi";

const inputClass =
  "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

const labelClass = (value) =>
  `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;

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

const EditProductByAdmin = () => {
  // ---------- State ----------
  const [name, setName] = useState("");
  const [hsn, setHsn] = useState("");
  const [styleCode, setStyleCode] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");
  const [comboType, setComboType] = useState("");
  const [tags, setTags] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [material, setMaterial] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [price, setPrice] = useState("");
  const [packerName, setPackerName] = useState("");
  const [packerAdd, setPackerAdd] = useState("");
  const [packerPin, setPackerPin] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  // ---------- API ----------
  const { data, isLoading } = useGetProductBySlugQuery(id, {
    skip: !id,
  });

  const [updateProductByAdmin, { isLoading: creating }] = useUpdateProductByAdminMutation();

  // ---------- Handlers ----------
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  
  const toggleSize = (size) => {
  let updated = [];

  if (selectedSizes.includes(size)) {
    updated = selectedSizes.filter((s) => s !== size);
  } else {
    updated = [...new Set([...selectedSizes, size])];
  }

  // Sort by predefined order
  updated = updated.sort(
    (a, b) => sizeOptions.indexOf(a) - sizeOptions.indexOf(b)
  );

  setSelectedSizes(updated);
};

  // ---------- Form Submit ----------
  const handleFormSubmit = async () => {
    try {
      // const formData = new FormData();
      // formData.append("name", name);
      // formData.append("quantity", quantity);
      // formData.append("color", color);
      // formData.append("weight", weight);
      // formData.append("hsnCode", hsn);
      // formData.append("styleCode", styleCode);
      // formData.append("size", size);
      // formData.append("material", material);
      // formData.append("comboType", comboType);
      // formData.append("productId", id);

      // formData.append("tags", JSON.stringify(tags));

      const data = {
        name,
        quantity,
        color,
        weight,
        hsnCode: hsn,
        styleCode,
        size,
        material,
        comboType,
        price,
        productId: id,
        tags,
      };

      await updateProductByAdmin(data).unwrap();
      // console.log("Product created:", response);
      navigate("/seller/list-products");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };


  useEffect(() => {
    if (data) {
      console.log("data", data);
      setHsn(data.product.hsnCode);
      setStyleCode(data.product.styleCode);
      setSize(data.product.size);
      setName(data.product.name);
      setQuantity(data.product.quantity);
      setColor(data.product.color);
      setWeight(data.product.weight);
      setComboType(data.product.comboType);
      setTags(data.product.tags);
      setMaterial(data.product.material);
      setPrice(data.product.price);
      setPackerName(data.product.packerName);
      setPackerAdd(data.product.packerAdd);
      setPackerPin(data.product.packerPin);
      setSelectedSizes(data.product.size || []);
    }
  }, [data]);

  // ---------- Loading Check ----------
  if (creating) return <Loading />;

  return !isLoading ? (
    <>
      <Title text1="Update" text2="Product" />

      <div className=" flex flex-col sm:flex-row items-start w-full gap-10 mb-10">
        <div className="w-full flex flex-col items-start">
          <h1 className="text-lg font-medium  text-gray-600 dark:text-gray-200 py-3 mt-2 border-b border-gray-400/30 w-full">
            Product,Size and Inventory
          </h1>
          
          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {/*HSN Code */}
            <div className="relative">
              <input
                type="text"
                id="hsn"
                name="hsn"
                value={hsn}
                onChange={(e) => setHsn(e.target.value)}
                placeholder=" "
                className={inputClass} //"peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
              />

              <label htmlFor="hsn" className={labelClass(hsn)}>
                HSN Code
              </label>
            </div>

            {/* weight Field */}
            <div className="relative">
              <input
                type="text"
                id="weight"
                name="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder=" "
                className={inputClass}
                required
              />
              <label htmlFor="weight" className={labelClass(weight)}>
                Net Weight(gms)
              </label>
            </div>

            {/* product id/Style Code Field */}
            <div className="relative">
              <input
                type="text"
                id="styleCode"
                name="styleCode"
                value={styleCode}
                onChange={(e) => setStyleCode(e.target.value)}
                placeholder=" "
                className={inputClass} //"peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
              />

              <label htmlFor="styleCode" className={labelClass(styleCode)}>
                StyleCode/ProductID(optional)
              </label>
            </div>

            {/* Name Field */}
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                className={inputClass} //"peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
              />

              <label htmlFor="name" className={labelClass(name)}>
                Product Name
              </label>
            </div>

            {/* Size Field */}
            <div className="relative w-64 mt-4">
              {/* Input field (acts like a select) */}
              <div
                className="border-b-2 px-2 py-1 cursor-pointer flex justify-between items-center font-medium border-gray-300 text-gray-400"
                onClick={() => setOpen(!open)}
              >
                <span>
                  {selectedSizes.length > 0
                    ? selectedSizes.join(", ")
                    : "Select sizes"}
                </span>
                <span className="ml-2">&#9662;</span> 
              </div>

              {/* Options dropdown */}
              {open && (
                <div className="absolute left-0 right-0 border-b-2 border-b-gray-300 mt-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 dark:border-gray-400 z-10 max-h-40 overflow-auto hide-scrollbar scrollbar-none rounded shadow-lg">
                  {sizeOptions.map((size) => (
                    <div
                      key={size}
                      className="px-2 py-1 hover:bg-pink-100 dark:hover:bg-gray-400 cursor-pointer flex items-center gap-2"
                      onClick={() => toggleSize(size)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        readOnly
                        className="accent-pink-400"
                      />
                      <span>{size}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
          <h1 className="text-lg font-medium  text-gray-600 dark:text-gray-200 py-3 mt-5 border-b border-gray-400/30 w-full">
            Product Details
          </h1>

          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
              {/* price Field */}
            <div className="relative">
              <input
                type="text"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder=" "
                className={inputClass}
              />
              <label htmlFor="price" className={labelClass(price)}>
                Price
              </label>
            </div>
            {/* Quantity Field */}
            <div className="relative">
              <input
                type="text"
                id="quantity"
                placeholder=" "
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={inputClass}
              />
              <label htmlFor="quantity" className={labelClass(quantity)}>
                Net Quantity
              </label>
            </div>

            {/* tags Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="tags"
                name="tags"
                value={inputValue} // show tags as comma separated string
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isFocused ? "e.g. #phone, #iphone, #smartphone" : ""
                }
                className={inputClass}
                required
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <label htmlFor="tags" className={labelClass(tags.length > 0)}>
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-200 text-purple-800 px-2 py-1 rounded flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-800 hover:text-red-600 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="relative mt-2">
              <label htmlFor="comboType" className={labelClass(comboType)}>
                Combo Type
              </label>
              <select
                id="comboType"
                name="comboType"
                value={comboType}
                onChange={(e) => setComboType(e.target.value)}
                required
                className={inputClass}
                autoFocus
              >
                <option value="" disabled hidden></option>
                {comboOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Packer Name Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="packerName"
                name="packerName"
                value={packerName}
                onChange={(e) => setPackerName(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label htmlFor="packerName" className={labelClass(packerName)}>
                Packer Name
              </label>
            </div>

            {/* Packer Address Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="packerAdd"
                name="packerAdd"
                value={packerAdd}
                onChange={(e) => setPackerAdd(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label htmlFor="packerAdd" className={labelClass(packerAdd)}>
                Packer Address
              </label>
            </div>

            {/* Packer Pincode Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="packerPin"
                name="packerPin"
                value={packerPin}
                onChange={(e) => setPackerPin(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label htmlFor="packerPin" className={labelClass(packerPin)}>
                Packer PinCode
              </label>
            </div>
          </div>
          <h1 className="text-lg font-medium  text-gray-600 dark:text-gray-200 py-3 mt-5 border-b border-gray-400/30 w-full">
            Other Attributes
          </h1>
          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {/* Color Field */}
            <div className="relative ">
              <input
                type="text"
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
                className={inputClass}
              />
              <label htmlFor="color" className={labelClass(color)}>
                Color
              </label>
            </div>

            {/* material Field */}
            <div className="relative ">
              <input
                type="text"
                id="material"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
                className={inputClass}
              />
              <label htmlFor="material" className={labelClass(material)}>
                Material
              </label>
            </div>

          </div>
        </div>
      </div>

      <div className="w-full h-16 bg-white dark:bg-[#1f1518] text-gray-900 dark:text-gray-100 fixed bottom-0 right-0 flex items-center justify-between px-10">
        <div
          onClick={() => {
            navigate("/seller");
            scrollTo(0, 0);
          }}
          className="border border-purple-600 max-w-xs p-2 px-4 text-center rounded-sm font-medium text-purple-600 text-lg cursor-pointer"
        >
          Cancel
        </div>
        <button
          onClick={() => handleFormSubmit()}
          className=" px-4 py-2 text-white font-medium bg-purple-600 rounded-md hover:bg-purple-700 cursor-pointer"
        >
          Add Product
        </button>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default EditProductByAdmin