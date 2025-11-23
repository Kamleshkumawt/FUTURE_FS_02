import React, { useEffect, useState } from 'react'
import { dateFormat } from '../../lib/dateFormat';
import Title from '../../components/sellerPanel/Title';
import {Link} from 'react-router-dom'
import { useBlockSellerMutation, useGetAllSellersQuery, } from '../../store/api/admin/adminApi';
import { toast } from 'react-hot-toast';


const ShowAllSellers = () => {
  const [sellers, setSellers] = useState([]);
  const {data, isLoading} = useGetAllSellersQuery();

  const [blockSeller, { loading }] = useBlockSellerMutation();
  

  useEffect(() => {
    if(data) {
      // console.log('data is fetched : ', data);
       const filteredUsers = data.sellers.filter((user) => user.isDisabled === false);
      setSellers(filteredUsers);
   }
  }, [data]);

  const handleBlocked = async (id) => {
    try {
      // console.log("Deleting product with ID:", id);
      await blockSeller(id).unwrap(); // unwrap() throws if the mutation fails
      toast.success("Seller blocked successfully!");
      setSellers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      // console.log("Deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  return !isLoading && (
    <>
      <Title text1="Sellers" text2="List" />
      <div className="max-w-7xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead className="bg-primary/20 text-left dark:text-white text-black">
          <tr>
            <th className="p-2 font-medium pl-5">Store Name</th>
            <th className="p-2 font-medium pl-5">Manger Name</th>
            <th className="p-2 font-medium pl-5">Contact Number</th>
            <th className="p-2 font-medium">GST Number</th>
            <th className="p-2 font-medium">Creating Date</th>
            <th className="p-2 font-medium">Rating</th>
            <th className="p-2 font-medium">description</th>
            <th className="p-2 font-medium">Action</th>
          </tr>
          </thead>
          <tbody className="text-sm font-light">
            {sellers.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 font-medium"
              >
                <td className="p-2 min-w-45 pl-5">{item.storeName}</td>
                <td className="p-2 min-w-45 pl-5">{item.fullName}</td>
                <td className="p-2 min-w-45 pl-5">{item.phoneNumber}</td>
                <td className="p-2 ">{item.gstNumber}</td>
                <td className="p-2">{dateFormat(item.createdAt)}</td>
                <td className="p-2">{item.averageRating}</td>
                  <td className="p-2">{item.storeDescription.slice(0, 20)}...</td>
                  <td className="p-2 text-white flex items-center gap-2">
                    <Link to={`/admin/seller/details/${item._id}`} className='p-1 px-2 rounded-xs bg-green-500'>Edit</Link>
                    <div
                      disabled={loading}
                      onClick={() => handleBlocked(item._id)}
                      className="p-1 px-2 rounded-xs bg-red-500 cursor-pointer"
                    >
                      Blocked
                    </div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ShowAllSellers