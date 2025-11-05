import React, { useState } from "react";
import Title from "../../components/sellerPanel/Title";
import { useCreateProductMutation } from "../../store/api/seller/productApi";
import { useSelector } from "react-redux";
import { useGetCategoryByIdQuery } from "../../store/api/user/categoryApi";
import Loading from "../../components/Loading";
import { useNavigate } from "react-router-dom";

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

const AddProduct = () => {
  // ---------- State ----------
  const [name, setName] = useState("");
  const [gst, setGst] = useState("");
  const [hsn, setHsn] = useState("");
  const [styleCode, setStyleCode] = useState("");
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [weight, setWeight] = useState("");
  // const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [length, setLength] = useState("");
  const [comboType, setComboType] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  // const [discountPer, setDiscountPer] = useState("");
  // const [discountDate, setDiscountDate] = useState("");
  const [showImage, setShowImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  // const statusOptions = ["Active", "Inactive", "Out of Stock"];
  const [battery, setBattery] = useState("");
  const [material, setMaterial] = useState("");
  const [age, setAge] = useState("");
  const [manufacturerName, setManufacturerName] = useState("");
  const [manufacturerAdd, setManufacturerAdd] = useState("");
  const [manufacturerPin, setManufacturerPin] = useState("");
  const [packerName, setPackerName] = useState("");
  const [packerAdd, setPackerAdd] = useState("");
  const [packerPin, setPackerPin] = useState("");

  const navigate = useNavigate();

  // ---------- API ----------
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const image = useSelector((state) => state.category.image);
  const category = useSelector((state) => state.category.category);
  const { data: subCategoriesData } = useGetCategoryByIdQuery(category, {
    skip: category === null, // Only run when parent is selected
  });
  // console.log("category",category,image);
  // console.log("subCategoriesData",subCategoriesData);

  // ---------- Handlers ----------
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // setImages(files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  // ----------- category handlers --------------

  // ---------- Form Submit ----------
  const handleFormSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("color", color);
      formData.append("brand", brand);
      formData.append("weight", weight);
      // formData.append("status", status);
      formData.append("description", description);
      formData.append("frontImage", image || frontImage);
      formData.append(
        "category",
        subCategoriesData?.categories?.name || "Smartphone"
      );
      formData.append("gst_number", gst);
      formData.append("hsnCode", hsn);
      formData.append("styleCode", styleCode);
      formData.append("size", selectedSizes);
      formData.append("battery", battery);
      formData.append("material", material);
      formData.append("age", age);
      formData.append("manufacturerName", manufacturerName);
      formData.append("manufacturerAdd", manufacturerAdd);
      formData.append("manufacturerPin", manufacturerPin);
      formData.append("packerName", packerName);
      formData.append("packerAdd", packerAdd);
      formData.append("packerPin", packerPin);
      formData.append("comboType", comboType);

      const dimensions = {
        width,
        height,
        depth: length,
      };

      const manufacturerAddr = {
        name: manufacturerName,
        street: manufacturerAdd,
        postalCode: manufacturerPin,
      };

      const packerAddr = {
        name: packerName,
        street: packerAdd,
        postalCode: packerPin,
      };

      formData.append("manufacturerAddr", manufacturerAddr);
      formData.append("packerAddr", packerAddr);
      formData.append("dimensions", JSON.stringify(dimensions));
      formData.append("tags", JSON.stringify(tags));

      images.forEach((file) => {
        formData.append("images", file);
      });

      const response = await createProduct(formData).unwrap();
      console.log("Product created:", response);
      navigate("/seller/new-category-product");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFrontImage(file);
      setShowImage(imageUrl);
    }
  };

  // ---------- Loading Check ----------
  if (creating) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Product" />

      <div className=" flex flex-col sm:flex-row items-start w-full gap-10 mb-10">
        <div className="w-full flex flex-col items-start">
          <h1 className="text-lg font-medium  text-gray-600 py-3 mt-2 border-b border-gray-400/30 w-full">
            Product,Size and Inventory
          </h1>
          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {/* GST Number */}
            <div className="relative">
              <input
                type="text"
                id="gst"
                name="gst"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                placeholder=" "
                className={inputClass} //"peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600"
              />

              <label htmlFor="gst" className={labelClass(gst)}>
                GST
              </label>
            </div>
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
            <div className="relative w-64 mt-3">
              {/* Input field (acts like a select) */}
              <div
                className="border rounded px-2 py-1 cursor-pointer flex justify-between items-center font-medium text-gray-400"
                onClick={() => setOpen(!open)}
              >
                <span>
                  {selectedSizes.length > 0
                    ? selectedSizes.join(", ")
                    : "Select sizes"}
                </span>
                <span className="ml-2">&#9662;</span> {/* down arrow */}
              </div>

              {/* Options dropdown */}
              {open && (
                <div className="absolute left-0 right-0 border mt-1 bg-white z-10 max-h-40 overflow-auto hide-scrollbar scrollbar-none rounded shadow-lg">
                  {sizeOptions.map((size) => (
                    <div
                      key={size}
                      className="px-2 py-1 hover:bg-pink-100 cursor-pointer flex items-center gap-2"
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
          <h1 className="text-lg font-medium  text-gray-600 py-3 mt-5 border-b border-gray-400/30 w-full">
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

            {/* discount Field */}
            {/* <div className="relative mt-2">
            <input
              type="text"
              id="discount"
              name="discount"
              value={discountPer}
              onChange={(e) => setDiscountPer(e.target.value)}
              placeholder=" "
              required
              className={inputClass}
            />
            <label htmlFor="discount" className={labelClass(discountPer)}>
              Discount Percentage
            </label>
          </div> */}

            {/* discount Field */}
            {/* <div className="relative mt-2">
            <input
              type="datetime-local"
              id="discountDate"
              name="discountDate"
              value={discountDate}
              onChange={(e) => setDiscountDate(e.target.value)}
              placeholder=" "
              required
              className={inputClass}
            />
            <label
              htmlFor="discountDate"
              className={`absolute left-2 transition-all duration-200 font-medium cursor-pointer
              ${
                discountDate
                  ? "top-1 text-xs text-purple-600"
                  : "top-1 text-base text-gray-400"
              }
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`}
            >
              Discount Last Date And Time
            </label>
          </div> */}

            {/* width Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="width"
                name="width"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label htmlFor="width" className={labelClass(width)}>
                Width
              </label>
            </div>

            {/* height Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="height"
                name="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label htmlFor="height" className={labelClass(height)}>
                Height
              </label>
            </div>

            {/* length Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="length"
                name="length"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label htmlFor="length" className={labelClass(length)}>
                Length
              </label>
            </div>

            {/* ComboType Field */}
            {/* <div className="relative mt-2">
            <input
              type="text"
              id="comboType"
              name="comboType"
              value={comboType}
              onChange={(e) => setComboType(e.target.value)}
              placeholder=" "
              required
              className={inputClass}
            />
            <label htmlFor="length" className={labelClass(comboType)}>
              ComboType
            </label>
          </div> */}

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

            {/* Manufacturer Name Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="manufacturerName"
                name="manufacturerName"
                value={manufacturerName}
                onChange={(e) => setManufacturerName(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label
                htmlFor="manufacturerName"
                className={labelClass(manufacturerName)}
              >
                Manufacturer Name
              </label>
            </div>

            {/* Manufacturer Address Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="manufacturerAdd"
                name="manufacturerAdd"
                value={manufacturerAdd}
                onChange={(e) => setManufacturerAdd(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label
                htmlFor="manufacturerAdd"
                className={labelClass(manufacturerAdd)}
              >
                Manufacturer Address
              </label>
            </div>

            {/* Manufacturer Pincode Field */}
            <div className="relative mt-2">
              <input
                type="text"
                id="manufacturerPin"
                name="manufacturerPin"
                value={manufacturerPin}
                onChange={(e) => setManufacturerPin(e.target.value)}
                placeholder=" "
                required
                className={inputClass}
              />
              <label
                htmlFor="manufacturerPin"
                className={labelClass(manufacturerPin)}
              >
                Manufacturer PinCode
              </label>
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

            {/* status Field */}
            {/* <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-500">Status</p>
            <div className="flex gap-4">
              {statusOptions.map((option) => (
                <div key={option} className="relative">
                  <input
                    type="radio"
                    id={option}
                    name="status"
                    value={option}
                    checked={status === option}
                    onChange={(e) => setStatus(e.target.value)}
                    className={"peer hidden"}
                  />
                  <label
                    htmlFor={option}
                    className={`inline-block px-4 py-2 border rounded-md cursor-pointer transition-colors duration-200
                  ${
                    option === status
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700 border-gray-300"
                  }
                  hover:border-purple-600 hover:text-purple-600 `}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div> */}

            {/* images Field */}
            {/* <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {images.map((file, i) => {
                const url = URL.createObjectURL(file);
                return (
                  <img
                    key={i}
                    src={url}
                    alt={file.name}
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                    onLoad={() => URL.revokeObjectURL(url)}
                  />
                );
              })}
            </div>
          </div> */}
          </div>
          <h1 className="text-lg font-medium  text-gray-600 py-3 mt-5 border-b border-gray-400/30 w-full">
            Other Attributes
          </h1>
          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
            {/* Battery Field */}
            <div className="relative ">
              <input
                type="text"
                id="battery"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
                className={inputClass}
              />
              <label htmlFor="battery" className={labelClass(battery)}>
                Battery Included
              </label>
            </div>

            {/* brand Number Field */}
            <div className="relative ">
              <input
                type="text"
                id="brand"
                name="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder=" "
                className={inputClass}
                required
              />
              <label htmlFor="brand" className={labelClass(brand)}>
                Brand
              </label>
            </div>

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

            {/* age Field */}
            <div className="relative ">
              <input
                type="text"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
                className={inputClass}
              />
              <label htmlFor="age" className={labelClass(age)}>
                Recommended Age
              </label>
            </div>

            {/* description Field */}
            <div className="relative">
              <textarea
                type="text"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder=" "
                required
                maxLength={200}
                className={inputClass}
              />
              <label htmlFor="description" className={labelClass(description)}>
                Description
              </label>
            </div>
          </div>
        </div>

        <div className="max-w-xl bg-white rounded-sm flex flex-col items-center gap-5">
          <div className="w-full flex flex-col  p-5 gap-5">
            <p className="text-lg font-semibold font-poppins">
              Images Guidelines
            </p>
            <div className="flex gap-2 text-sm items-center">
              <span className="bg-purple-600/40 rounded-full p-1 px-2">1</span>
              Images with a clear view of the product
            </div>
            <div className="flex gap-2 text-sm items-center">
              <span className="bg-purple-600/40 rounded-full p-1 px-2">2</span>
              Product images should be of good quality
            </div>
            <div className="flex gap-2 text-sm items-center">
              <span className="bg-purple-600/40 rounded-full p-1 px-2">3</span>
              Please add sold images
            </div>
            <p className="text-lg font-semibold font-poppins">
              Add images with details of the product
            </p>
            <div className="grid grid-cols-2 gap-2">
              <img
                className="w-42 object-cover h-full"
                src="https://tse1.explicit.bing.net/th/id/OIP.AIVPgfM9nP5f3dC5-tFytQHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="img"
              />
              <img
                className="w-42 object-cover h-full"
                src="https://www.shutterstock.com/image-photo/mens-casual-outfit-fashion-clothing-260nw-1592874139.jpg"
                alt="img"
              />
              <img
                className="w-42 object-cover h-full"
                src="https://img.freepik.com/premium-photo/flat-lay-men-fashion-casual-outfits-with-accessories-gray-background_1207718-134286.jpg"
                alt="img"
              />
              <img
                className="w-42 object-cover h-full"
                src="https://tse4.mm.bing.net/th/id/OIP.-ckcGXBRnQjSTAjiLKO2NgHaFL?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="img"
              />
            </div>

            <div className="flex flex-wrap items-start gap-2">
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 border border-gray-300 flex items-center justify-center">
                  <img
                    src={showImage || (image ? URL.createObjectURL(image) : "")}
                    alt={image?.name}
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
                <p>front image</p>
              </div>

              {/* <div className="w-30 h-30">
             <img
              src={showImage}
              alt={showImage}
              // onLoad={() => URL.revokeObjectURL(showImage)}
              className=" w-full h-full object-cover"
            />
           </div> */}
              <p>Please provide only maximum of 4 sold images</p>
              <div style={{ marginTop: 10 }} className="flex flex-wrap gap-2">
                {images.map((file, i) => {
                  const url = URL.createObjectURL(file);
                  return (
                    <img
                      key={i}
                      src={url}
                      alt={file.name}
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                      onLoad={() => URL.revokeObjectURL(url)}
                    />
                  );
                })}
              </div>

              {images.length < 4 && (
                <div className="flex items-center">
                  <div className="relative w-25 h-25 border border-gray-300 text-center flex items-center justify-center">
                    <h1>Click to Upload</h1>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mb-4 absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* <p>Please provide only front image for each product</p> */}
            {/* <div className="bg-purple-600 max-w-xs p-2 px-4 text-center rounded-sm font-medium text-white text-lg cursor-pointer">
          Add Product Images
         </div> */}
          </div>
        </div>
      </div>

      <div className="w-full h-16 bg-white fixed bottom-0 right-0 flex items-center justify-between px-10">
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
  );
};

export default AddProduct;
