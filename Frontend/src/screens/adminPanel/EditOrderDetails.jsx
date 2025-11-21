import React, { useState } from "react";
import Title from "../../components/sellerPanel/Title";
import Loading from "../../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useGetOrderByIdQuery, useUpdateOrderStatusByAdminMutation } from "../../store/api/admin/adminApi";

const inputClass =
  "peer w-full border-b-2 border-gray-300 px-4 pt-5 pb-2 text-sm focus:outline-none focus:border-purple-600";

const labelClass = (value) =>
  `absolute left-2 transition-all duration-200 font-medium cursor-pointer
     ${
       value ? "top-1 text-xs text-purple-600" : "top-3 text-base text-gray-400"
     }
     peer-focus:top-1 peer-focus:text-xs peer-focus:text-purple-600`;

const comboOptions = [
  'Pending','Shipped','Delivered','Cancelled'
];

const EditOrderDetails = () => {
  // ---------- State ----------
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState('');
  const navigate = useNavigate();

  const { id } = useParams();

  // ---------- API ----------
  const { data, isLoading } = useGetOrderByIdQuery(id, {
    skip: !id,
  });

  const [updateOrderStatusByAdmin, { isLoading: creating }] = useUpdateOrderStatusByAdminMutation();

  // ---------- Form Submit ----------
  const handleFormSubmit = async (id) => {
    try {
      // const formData = new FormData();
      // formData.append("status", status);
      // formData.append("orderId", id);

      // formData.forEach((value, key) => {
      //   console.log(key + ":", value);
      // });

      const data = {
        status,
        orderId: id,
      }
      await updateOrderStatusByAdmin(data).unwrap();
      // console.log("Product created:", response);
      navigate("/admin/show/all-orders");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      setOrder(data.orders);
      setStatus(data.orders.status);
    }
  }, [data]);

  // ---------- Loading Check ----------
  if (creating) return <Loading />;

  return !isLoading ? (
    <>
      <Title text1="Update" text2="Order" />

      <h1></h1>

      <div className=" flex flex-col sm:flex-row items-start justify-between w-full gap-10 mb-10">
       <div className="relative mt-2">
              <label htmlFor="status" className={labelClass(status)}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className={inputClass}
                autoFocus
              >
                <option value="" disabled hidden></option>
                {comboOptions.map((option) => (
                  <option key={option} value={option} className="dark:bg-[#1b1316] dark:text-white border-none">
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button
          onClick={() => handleFormSubmit(order._id)}
          className=" px-4 py-2 text-white font-medium bg-purple-600 rounded-md hover:bg-purple-700 cursor-pointer"
        >
          update order
        </button>

      </div>

      {/* <div className="w-full h-16 bg-white dark:bg-[#1b1316] fixed bottom-0 right-0 flex items-center justify-between px-10">
        <div
          onClick={() => {
            navigate("/admin");
            scrollTo(0, 0);
          }}
          className="border border-purple-600 max-w-xs p-2 px-4 text-center rounded-sm font-medium text-purple-600 text-lg cursor-pointer"
        >
          Cancel
        </div>
        <button
          onClick={() => handleFormSubmit(order._id)}
          className=" px-4 py-2 text-white font-medium bg-purple-600 rounded-md hover:bg-purple-700 cursor-pointer"
        >
          update order
        </button>
      </div> */}
    </>
  ) : (
    <Loading />
  );
};

export default EditOrderDetails;