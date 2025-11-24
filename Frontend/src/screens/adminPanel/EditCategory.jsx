import React, { useEffect, useState } from "react";
import Title from "../../components/sellerPanel/Title";
import Loading from "../../components/Loading";
import { useUpdateCategoryMutation } from "../../store/api/admin/adminApi";
import { useGetCategoryByIdQuery } from "../../store/api/user/categoryApi";
import { useNavigate, useParams } from "react-router-dom";
import {toast} from "react-hot-toast";


const inputClass =
  "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

const labelClass = (value) =>
  `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;


const EditCategory = () => {
  const [name, setName] = useState("");
  const [categoryData, setCategoryData] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [inputValueKeywords, setInputValueKeywords] = useState("");
  const [isFocusedKeywords, setIsFocusedKeywords] = useState(false);
   const [description, setDescription] = useState("");
  const [isOpen,setIsOpen] = useState(false)

  const {id} =  useParams();
  const navigate = useNavigate();

  // ---------- API ----------
  // const [getAllCategories] = useGetAllCategoriesMutation();
  const [updateCategory, {isLoading, error}] = useUpdateCategoryMutation();

  const { data } = useGetCategoryByIdQuery(
    id,
    {
      skip: !id, 
    }
  );

  // ---------- Fetch All Categories on Mount ----------
  useEffect(() => {
    if (data) {
    //   console.log("data is fetched : ", data);
      setCategoryData(data.data);
      setName(data.data.name);
      setDescription(data.data.description);
      setKeywords(data.data.keywords || []);
    }
  }, [data]);

  // ---------- Handle selection change ----------

  const handleInputChangeKeywords = (e) => {
    setInputValueKeywords(e.target.value);
  };

   const handleKeyDownKeywords = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = inputValueKeywords.trim();
      if (newTag && !keywords.includes(newTag)) {
        setKeywords([...keywords, newTag]);
      }
      setInputValueKeywords("");
    }
  };

  const removeTagKeywords = (tagToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== tagToRemove));
  };

  const handleAddProductCategory = async() => {
    try {
        const data = { name, description, keywords };
      await updateCategory({ id, data }).unwrap();
      // console.log('res :', res)
      toast.success("Category updated successfully!");
      setIsOpen(false)
      navigate(-1);
    } catch(error){
      console.error("category creation error :",error)
    }
  };

  return (
    <>
      <Title text1="Update" text2="Category" />

      <div className="w-full flex items-center justify-between sm:flex-row gap-5  mt-4">       
          
            <div className="p-2">
            Category Name :   {categoryData?.name}
            </div>

            <div className="p-4">
              <div
              onClick={() => setIsOpen(true)}
              className="bg-purple-600 max-w-xs p-2 px-4 text-center rounded-sm font-medium text-white text-lg cursor-pointer hover:bg-purple-700 transition-all"
            >
              update Category
            </div>
            </div>
      </div>

      {isOpen && (
          <div className="absolute top-0 left-0 w-screen h-screen bg-gray-500/50 flex items-center justify-center">
            <div className="bg-white dark:bg-[#2A1C20] rounded-lg p-6 flex flex-col items-center gap-5 min-w-xs">
              <h2 className="text-lg font-semibold mb-4 w-full flex items-center justify-between">Update Category  <span onClick={() => setIsOpen(false)} className="text-xl cursor-pointer hover:text-red-500">&times;</span></h2>

            {/* Name Field */}
            <div className="relative w-full">
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
                Category Name
              </label>
            </div>


              {/* description Field */}
            <div className="relative w-full">
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

             {/* keywords Field */}
            <div className="relative w-full">
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={inputValueKeywords} // show tags as comma separated string
                onChange={handleInputChangeKeywords}
                onKeyDown={handleKeyDownKeywords}
                placeholder={
                  isFocusedKeywords ? "e.g. #phone, #iphone, #smartphone" : ""
                }
                className={inputClass}
                required
                onFocus={() => setIsFocusedKeywords(true)}
                onBlur={() => setIsFocusedKeywords(false)}
              />
              <label htmlFor="keywords" className={labelClass(keywords.length > 0)}>
                Keywords
              </label>
              <div className="flex flex-wrap gap-2 mb-1">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-purple-200 text-purple-800 px-2 py-1 rounded flex items-center space-x-1"
                  >
                    <span>{keyword}</span>
                    <button
                      type="button"
                      onClick={() => removeTagKeywords(keyword)}
                      className="text-purple-800 hover:text-red-600 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
             

             {error && (
              <><p>{error?.message || 'Something went wrong!'}</p></>
             )}

              <button
                onClick={handleAddProductCategory}
                disabled={isLoading}
                className="bg-purple-600 text-white py-2 px-4 rounded cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default EditCategory;
