import React, { useEffect, useState } from 'react'
import { dateFormat } from '../../lib/dateFormat';
import Title from '../../components/sellerPanel/Title';
import {Link} from 'react-router-dom'
import { useDeleteProductMutation, useGetProductsBySellerQuery } from '../../store/api/seller/productApi';


const ShowAllProduct = () => {
  const [products, setProducts] = useState([]);
  // console.log("user :", seller);

  const {data, isLoading} = useGetProductsBySellerQuery();

  const [deleteProduct,{ loading }] = useDeleteProductMutation();
  
  const handleDelete = async (id) => {
    try {
    console.log('Deleting product with ID:', id);
    await deleteProduct(id).unwrap(); // unwrap() throws if the mutation fails
    // console.log('Deleted successfully');
  } catch (error) {
    console.error('Delete failed:', error);
  }
  }

  useEffect(() => {
    if(data) {
      // console.log('data is fetched : ', data);
      setProducts(data.products);
    }
  }, [data]);

  return !isLoading && (
    <>
      <Title text1="Products" text2="List" />
      <div className="max-w-7xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead className="bg-primary/20 text-left text-gray-900 dark:text-gray-100">
          <tr>
            <th className="p-2 font-medium pl-5">Product Image</th>
            <th className="p-2 font-medium pl-5">Name</th>
            <th className="p-2 font-medium">Quantity</th>
            <th className="p-2 font-medium">Listing Date</th>
            <th className="p-2 font-medium">Rating</th>
            <th className="p-2 font-medium">Reviews count</th>
            <th className="p-2 font-medium">Amount</th>
            <th className="p-2 font-medium">Color</th>
            <th className="p-2 font-medium">Weight</th>
            <th className="p-2 font-medium">Status</th>
            <th className="p-2 font-medium">Discount</th>
            <th className="p-2 font-medium">Action</th>
          </tr>
          </thead>
          <tbody className="text-sm font-light">
            {products.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 font-medium"
              >
                <td className="p-2 pl-10 "><img className="w-10 rounded" src={item.frontImage} alt="" /></td>
                <td className="p-2 min-w-45 pl-5">{item.name.slice(0, 20)}</td>
                <td className="p-2 ">{item.quantity}</td>
                <td className="p-2">{dateFormat(item.createdAt)}</td>
                <td className="p-2">{item.averageRating}</td>
                <td className="p-2">{item.numOfReviews}</td>
                <td className="p-2">
                  {Number(
                    String(item?.price)?.replace(/[^0-9.-]+/g, "")
                  ).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  })}
                </td>
                  <td className="p-2">{item.color}</td>
                  <td className="p-2">{item.weight}g</td>
                  <td className="p-2 text-green-700">{item.stockStatus}</td>
                  <td className="p-2 text-green-700">{item.discount}% off</td>
                  <td className="p-2 text-white flex items-center gap-2">
                    <Link to={`/seller/edit-product/${item._id}`} className='p-1 px-2 rounded-xs bg-green-500'>Edit</Link>
                    <div disabled={loading}  onClick={()=> handleDelete(item._id)} className='p-1 px-2 rounded-xs bg-red-500 '>Delete</div>
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ShowAllProduct