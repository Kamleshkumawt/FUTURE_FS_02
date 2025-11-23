import React, { useEffect, useState } from 'react'
import { dateFormat } from '../../lib/dateFormat';
import Title from '../../components/sellerPanel/Title';
import { formatAmount } from '../../lib/formatAmount';
import { useGetSellerOrdersQuery } from '../../store/api/user/orderApi';

const ShowAllDeliveredOrders = () => {
   const [orders, setOrders] = useState([]);
    //  console.log("seller :", seller);
  
    const {data, isLoading} = useGetSellerOrdersQuery();
  
    useEffect(() => {
      if(data) {
        // console.log('data is fetched : ', data);
        const filteredOrders = data.orders.filter(order => order.status === 'Delivered');
        setOrders(filteredOrders);
      }
    }, [data]);

  return !isLoading && (
    <>
      <Title text1="Delivered Orders" text2="List" />
      <div className="max-w-7xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead className="bg-primary/20 text-left dark:text-white ">
          <tr>
            <th className="p-2 font-medium pl-5">Product Image</th>
            <th className="p-2 font-medium pl-5">User Name</th>
            <th className="p-2 font-medium pl-5">User Email</th>
            <th className="p-2 font-medium pl-5">User Address</th>
            <th className="p-2 font-medium">Product Name</th>
            <th className="p-2 font-medium">Product Price</th>
            <th className="p-2 font-medium">Quantity</th>
            <th className="p-2 font-medium">Order Date</th>
            <th className="p-2 font-medium">Total Amount</th>
            <th className="p-2 font-medium">Status</th>
            {/* <th className="p-2 font-medium">Payment Method</th> */}
          </tr>
          </thead>
          <tbody className="text-sm font-light">
            {orders.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 font-medium"
              >
                <td className="p-2 pl-10 ">{item.items.map((item) => <><img className="w-10 rounded" src={item.thumbnail} alt="" /></>)}</td>
                <td className="p-2 min-w-45 pl-5">{item.user.fullName}</td>
                <td className="p-2 min-w-45 pl-5">{item.user.email}</td>
                <td className="p-2 min-w-45 pl-5">{item.shipping_address.city}</td>
                <td className="p-2 ">{item.items.map((item) => item.title.slice(0, 20))}</td>
                <td className="p-2 ">{formatAmount(item.items.map((item) => (item.price)))}</td>
                <td className="p-2 ">{item.items.map((item) => item.quantity)}</td>
                <td className="p-2">{dateFormat(item.createdAt)}</td>
                <td className="p-2">{formatAmount(item?.total_amount)}</td>
                <td className="p-2 text-green-700">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ShowAllDeliveredOrders