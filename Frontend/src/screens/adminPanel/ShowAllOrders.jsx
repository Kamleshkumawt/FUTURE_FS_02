import React, { useEffect, useState } from "react";
import { dateFormat } from "../../lib/dateFormat";
import Title from "../../components/sellerPanel/Title";
import { Link } from "react-router-dom";
import { useGetAllOrdersQuery } from "../../store/api/admin/adminApi";
import Loading from "../../components/Loading";

const ShowAllOrders = () => {
  const [products, setProducts] = useState([]);
  const { data, isLoading } =
    useGetAllOrdersQuery();

  // const [deleteProduct, { loading }] = useDeleteProductByAdminMutation();

  // const handleDelete = async (id) => {
  //   try {
  //     console.log("Deleting product with ID:", id);
  //     await deleteProduct(id).unwrap(); // unwrap() throws if the mutation fails
  //     console.log("Deleted successfully");
  //   } catch (error) {
  //     console.error("Delete failed:", error);
  //   }
  // };


  useEffect(() => {
    if (data) {
      // console.log("data is fetched : ", data);
      setProducts(data.orders);
    }
  }, [data]);

  return (
    !isLoading ? (
      <>
        <Title text1="Orders" text2="List" />
        <div className="max-w-7xl mt-6 overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
            <thead className="bg-primary/20 text-left dark:text-white text-black">
              <tr>
                <th className="p-2 font-medium pl-5">Name</th>
                <th className="p-2 font-medium">Contact</th>
                <th className="p-2 font-medium">Product Quantity</th>
                <th className="p-2 font-medium">Listing Date</th>
                <th className="p-2 font-medium">Amount</th>
                <th className="p-2 font-medium">Payment type</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light">
              {products.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 font-medium"
                >
                  <td className="p-2 min-w-45 pl-5">
                    {item.shipping_address.name}
                  </td>
                  <td className="p-2 ">{item.shipping_address.contact}</td>
                  <td className="p-2 ">{item?.items?.reduce((sum, i) => sum + i.quantity, 0)}</td>
                  <td className="p-2">{dateFormat(item.createdAt)}</td>
                  <td className="p-2">
                    {Number(
                      String(item?.total_amount)?.replace(/[^0-9.-]+/g, "")
                    ).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="p-2 text-green-700">{item.payment_method}</td>
                  <td className="p-2 text-green-700">{item.status}</td>
                  <td className="p-2 text-white flex items-center gap-2">
                    <Link
                      to={`/admin/order/details/${item._id}`}
                      className="p-1 px-2 rounded-xs bg-green-500"
                    >
                      Edit
                    </Link>
                    {/* <div
                      disabled={loading}
                      onClick={() => handleDelete(item._id)}
                      className="p-1 px-2 rounded-xs bg-red-500 "
                    >
                      Delete
                    </div> */}
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

export default ShowAllOrders;
