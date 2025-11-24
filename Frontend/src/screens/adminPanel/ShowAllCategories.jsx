import React, { useEffect, useState } from "react";
import { dateFormat } from "../../lib/dateFormat";
import Title from "../../components/sellerPanel/Title";
import { Link } from "react-router-dom";
import { useDeleteCategoryMutation } from "../../store/api/admin/adminApi";
import { useGetAllCategoriesQuery } from "../../store/api/user/categoryApi";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";

const ShowAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const { data, isLoading } =
    useGetAllCategoriesQuery();

  const [deleteCategory, { loading }] = useDeleteCategoryMutation();

  const handleDelete = async (id) => {
    try {
      // console.log("Deleting product with ID:", id);
      await deleteCategory(id).unwrap(); // unwrap() throws if the mutation fails
      toast.success("Category deleted successfully!");
       setCategories((prevUsers) => prevUsers.filter((user) => user._id !== id));
      // console.log("Deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    if (data) {
      // console.log("data is fetched : ", data);
      setCategories(data.categories);
    }
  }, [data]);

  return (
    !isLoading ? (
      <>
        <Title text1="Categories" text2="List" />
        <div className="max-w-7xl mt-6 overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
            <thead className="bg-primary/20 text-left dark:text-white text-black">
              <tr>
                <th className="p-2 font-medium pl-5">Name</th>
                <th className="p-2 font-medium">Slug</th>
                <th className="p-2 font-medium">Listing Date</th>
                <th className="p-2 font-medium">description</th>
                <th className="p-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {categories.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 font-medium"
                >
                  <td className="p-2 min-w-45 pl-5">{item.name}</td>
                  <td className="p-2 ">{item.slug}</td>
                  <td className="p-2">{dateFormat(item.createdAt)}</td>
                  <td className="p-2">{item.description.slice(0, 20)}....</td>
                  <td className="p-2 text-white flex items-center gap-2">
                    <Link
                      to={`/admin/category/update/${item._id}`}
                      className="p-1 px-2 rounded-xs bg-green-500"
                    >
                      Edit
                    </Link>
                    <div
                      disabled={loading}
                      onClick={() => handleDelete(item._id)}
                      className="p-1 px-2 rounded-xs bg-red-500 cursor-pointer"
                    >
                      Delete
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ) : <Loading />
  ) 
};

export default ShowAllCategories;
