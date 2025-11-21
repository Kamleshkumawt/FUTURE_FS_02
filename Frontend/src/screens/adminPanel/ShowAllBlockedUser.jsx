import React, { useEffect, useState } from 'react'
import { dateFormat } from '../../lib/dateFormat';
import Title from '../../components/sellerPanel/Title';
import { useBlockUserMutation, useGetAllUsersQuery } from '../../store/api/admin/adminApi';


const ShowAllBlockedUser = () => {
  const [users, setUsers] = useState([]);

  const {data, isLoading} = useGetAllUsersQuery();

  const [blockUser, { loading }] = useBlockUserMutation();

  useEffect(() => {
    if(data) {
      // console.log('data is fetched : ', data);
       const filteredUsers = data.users.filter((user) => user.isDisabled === true);
      setUsers(filteredUsers);
    }
  }, [data]);

  const handleBlocked = async (id) => {
    try {
      // console.log("Deleting product with ID:", id);
      await blockUser(id).unwrap(); // unwrap() throws if the mutation fails
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      // console.log(" successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  return !isLoading && (
    <>
      <Title text1="Users" text2="List" />
      <div className="max-w-7xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead className="bg-primary/20 text-left dark:text-white text-black">
          <tr>
            <th className="p-2 font-medium pl-5">Name</th>
            <th className="p-2 font-medium">Email</th>
            <th className="p-2 font-medium">Phone Number</th>
            <th className="p-2 font-medium">Register Date</th>
            <th className="p-2 font-medium">Role</th>
            <th className="p-2 font-medium">Action</th>
          </tr>
          </thead>
          <tbody className="text-sm font-light">
            {users.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10 font-medium"
              >
                <td className="p-2 min-w-45 pl-5">{item.username}</td>
                <td className="p-2 ">{item.email}</td>
                <td className="p-2">{item.phone}</td>
                <td className="p-2">{dateFormat(item.createdAt)}</td>
                <td className="p-2">{item.role}</td>
                  <td className="p-2 text-white flex items-center gap-2">
                    <div
                      disabled={loading}
                      onClick={() => handleBlocked(item._id)}
                      className="p-1 px-2 rounded-xs bg-yellow-500 cursor-pointer"
                    >
                      Unblocked
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

export default ShowAllBlockedUser