import React, { useState } from "react";
import Title from "../../components/sellerPanel/Title";
import {
  useGetProductBySlugQuery,
  useUpdateProductMutation,
} from "../../store/api/seller/productApi";
import Loading from "../../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

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

const EditProduct = () => {
  // ---------- State ----------
  const [name, setName] = useState("");
  const [hsn, setHsn] = useState("");
  const [styleCode, setStyleCode] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [length, setLength] = useState("");
  const [comboType, setComboType] = useState("");
  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showImage, setShowImage] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [material, setMaterial] = useState("");
  const [age, setAge] = useState("");
  const [product, setProduct] = useState(null);

  const navigate = useNavigate();

  const { id } = useParams();

  // ---------- API ----------
  const { data, isLoading } = useGetProductBySlugQuery(id, {
    skip: !id,
  });

  const [updateProduct, { isLoading: creating }] = useUpdateProductMutation();

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

  // const handleImageChange = (e) => {
  //   const files = Array.from(e.target.files);
  //   // setImages(files);
  //   setImages((prevImages) => [...prevImages, ...files]);
  // };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));
    setImages((prev) => [...prev, ...newImages].slice(0, 4)); // max 4 images
  };

  const handleReplaceImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...images];
    updated[index] = {
      url: URL.createObjectURL(file),
      file,
    };
    setImages(updated);
  };

  // ----------- category handlers --------------

  // ---------- Form Submit ----------
  const handleFormSubmit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("quantity", quantity);
      formData.append("color", color);
      formData.append("weight", weight);
      formData.append("description", description);
      formData.append("frontImage", frontImage);
      formData.append("hsnCode", hsn);
      formData.append("styleCode", styleCode);
      formData.append("size", size);
      formData.append("material", material);
      formData.append("age", age);
      formData.append("comboType", comboType);
      formData.append("productId", id);

      const dimensions = {
        width,
        height,
        depth: length,
      };

      formData.append("dimensions", JSON.stringify(dimensions));
      formData.append("tags", JSON.stringify(tags));

      images.forEach((file) => {
        formData.append("images", file);
      });

      await updateProduct(formData).unwrap();
      // console.log("Product created:", response);
      navigate("/seller/list-products");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFrontImage(file);

    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setShowImage(imageUrl);
  };

  useEffect(() => {
    return () => {
      if (showImage) URL.revokeObjectURL(showImage);
    };
  }, [showImage]);

  useEffect(() => {
    if (data) {
      console.log("data fatching :", data);
      setProduct(data.product);
      setHsn(data.product.hsnCode);
      setStyleCode(data.product.styleCode);
      setSize(data.product.size);
      setShowImage(data.product.frontImage.url);
      setFrontImage(data.product.frontImage);
      setName(data.product.name);
      setQuantity(data.product.quantity);
      setColor(data.product.color);
      setWeight(data.product.weight);
      setDescription(data.product.description);
      setWidth(data.product.dimensions.width);
      setHeight(data.product.dimensions.height);
      setLength(data.product.dimensions.depth);
      setComboType(data.product.comboType);
      setTags(data.product.tags);
      setImages(data.product.images);
      setMaterial(data.product.material);
      setAge(data.product.age);
    }
  }, [data]);

  // ---------- Loading Check ----------
  if (creating) return <Loading />;

  return !isLoading ? (
    <>
      <Title text1="Add" text2="Product" />

      <div className=" flex flex-col sm:flex-row items-start w-full gap-10 mb-10">
        <div className="w-full flex flex-col items-start">
          <h1 className="text-lg font-medium  text-gray-600 py-3 mt-2 border-b border-gray-400/30 w-full">
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
            <div className="relative">
              <input
                type="text"
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder=" " // Needed for `peer-placeholder-shown` to trigger, but space keeps it hidden
                className={inputClass}
              />
              <label htmlFor="size" className={labelClass(size)}>
                Size
              </label>
            </div>
          </div>
          <h1 className="text-lg font-medium  text-gray-600 py-3 mt-5 border-b border-gray-400/30 w-full">
            Product Details
          </h1>

          <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
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
          </div>
          <h1 className="text-lg font-medium  text-gray-600 py-3 mt-5 border-b border-gray-400/30 w-full">
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

            <div className="flex flex-wrap items-start gap-2">
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-28 border border-gray-300 rounded-md overflow-hidden group">
                  {showImage && (
                    <img
                      src={showImage}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Change Image
                  </div>
                </div>
                <p>front image</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((file, i) => (
                <div
                  key={i}
                  className="relative w-40 h-40 border border-gray-300 rounded-md overflow-hidden group"
                >
                  {/* Image Preview */}
                  <img
                    src={file.url}
                    alt={file.name || `Image ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-60"
                  />

                  {/* Reselect / Replace Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center text-white text-xs bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Change
                  </div>

                  {/* Hidden File Input for Reselect */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleReplaceImage(e, i)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ))}

              {/* Upload box (only visible if less than 4 images) */}
              {images.length < 4 && (
                <div className="relative w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center text-center text-gray-500 cursor-pointer hover:bg-gray-100 transition">
                  <span className="text-xs">Click to Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <p className="text-gray-700 text-sm font-medium">
              Please provide only a maximum of 4 sold images
            </p>
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
          onClick={() => handleFormSubmit(product._id)}
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

export default EditProduct;
