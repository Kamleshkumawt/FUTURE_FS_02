import {
  useGetAllCancelledOrdersByAdminCountQuery,
  useGetAllDeliveredOrdersByAdminCountQuery,
  useGetAllOrdersByAdminCountQuery,
  useGetAllProductByAdminCountQuery,
  useGetAllSellerByAdminCountQuery,
  useGetAllUsersByAdminCountQuery,
} from "../../store/api/admin/adminApi";
import Title from "../../components/admin/Title";
import { useState } from "react";
import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [orderChartData, setOrderChartData] = useState([]);
  const [userData, setUserData] = useState("");
  const [sellerData, setSellerData] = useState("");

  const { data: products } = useGetAllProductByAdminCountQuery();
  const { data: sellers } = useGetAllSellerByAdminCountQuery();
  const { data: users } = useGetAllUsersByAdminCountQuery();
  const { data: deliveredOrders } = useGetAllDeliveredOrdersByAdminCountQuery();
  const { data: cancelledOrders } = useGetAllCancelledOrdersByAdminCountQuery();
  const { data } = useGetAllOrdersByAdminCountQuery();

  const productCount = products?.count ?? 0;
  const deliveredCount = deliveredOrders?.count ?? 0;
  const cancelledCount = cancelledOrders?.count ?? 0;

  useEffect(() => {
    if (users) {
      // console.log("seller stats data", users);
      setUserData(users.stats);
    }
  }, [users]);

  useEffect(() => {
    if (sellers) {
      // console.log("seller stats data", sellers);
      setSellerData(sellers.stats);
    }
  }, [sellers]);

  useEffect(() => {
    if (data) {
      // console.log("order stats data", data);
      const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const base = MONTHS.map((m) => ({
        month: m,
        delivered: 0,
        cancelled: 0,
        pending: 0,
        shipped: 0,
      }));
      data.status.forEach((item) => {
        item.monthly.forEach((m) => {
          const i = m.month - 1;
          if (item._id === "Delivered") base[i].delivered += m.count;
          if (item._id === "Cancelled") base[i].cancelled += m.count;
          if (item._id === "Pending") base[i].pending += m.count;
          if (item._id === "Shipped") base[i].shipped += m.count;
        });
      });

      setOrderChartData(base);
    }
  }, [data]);

  const userBars = [
  {
    label: "Active",
    count: userData.active || 0,
    color: "#10b981", // Green 
  },
  {
    label: "Blocked",
    count: userData.blocked || 0,
    color: "#f59e0b", // Amber/Yellow 
  },
];

  const totalUsers = userData.active + userData.blocked;
  
  const sellerBars = [
    {
      label: "Active",
      count: sellerData.active || 0,
      color: "#3b82f6", // Blue
    },
    {
      label: "Blocked",
      count: sellerData.blocked || 0,
      color: "#ef4444", // Red
    },
  ];

  const totalSellers = sellerData.active + sellerData.blocked;

  return (
    <div>
      {/* {seller && seller.store_name && <h1>{seller.store_name}</h1>} */}
      <Title text1={"Dashboard"} text2={"Details"} />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 sm:gap-8 p-2">
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Move To Delivered Order's
            </span>
            <span className="text-2xl font-bold text-end">
              {deliveredCount}
            </span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Move To Cancelled Order's
            </span>
            <span className="text-2xl font-bold text-end">
              {cancelledCount}
            </span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Total Product's
            </span>
            <span className="text-2xl font-bold text-end">{productCount}</span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Total Income
            </span>
            <span className="text-2xl font-bold text-end">
              {productCount * 20}
            </span>
          </div>
        </div>
        
          <div className="flex flex-col xl:flex-row gap-2 lg:gap-10 xl:gap-30  justify-center items-center">
          <div className="w-full border border-gray-200 rounded-lg p-4 mt-6 bg-white dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100 shadow-sm">
            <h1 className="text-base sm:text-xl font-semibold">
                Total Users : {totalUsers}
              </h1>
            <div className="space-y-3 mt-4 w-full">
              {userBars.map((item) => {
                const percentage =
                  totalSellers > 0 ? (item.count / totalSellers) * 100 : 0;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 sm:gap-4 w-full"
                  >
                    {/* Label */}
                    <span className="sm:w-24 text-sm font-medium shrink-0">
                      {item.label}
                    </span>

                    {/* Bar container */}
                    <div className="flex-1 w-full bg-gray-200 h-2 rounded overflow-hidden min-w-0 block">
                      <div
                        className="h-2 rounded transition-all duration-500 block"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>

                    {/* Count */}
                    <span className="w-10 text-right font-semibold">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full border border-gray-200 rounded-lg p-4 mt-6 bg-white dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100 shadow-sm">
            <h1 className="text-base sm:text-xl font-semibold">
                Total Sellers : {totalSellers}
              </h1>
            <div className="space-y-3 mt-4 w-full">
              {sellerBars.map((item) => {
                const percentage =
                  totalSellers > 0 ? (item.count / totalSellers) * 100 : 0;

                return (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 sm:gap-4 w-full"
                  >
                    {/* Label */}
                    <span className="sm:w-24 text-sm font-medium shrink-0">
                      {item.label}
                    </span>

                    {/* Bar container */}
                    <div className="flex-1 w-full bg-gray-200 h-2 rounded overflow-hidden min-w-0 block">
                      <div
                        className="h-2 rounded transition-all duration-500 block"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>

                    {/* Count */}
                    <span className="w-10 text-right font-semibold">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          </div>
          <div className="flex flex-col xl:flex-row gap-2 lg:gap-10 xl:gap-30  justify-center items-center">
          <div className="w-full border border-gray-200 rounded-lg p-4 mt-6 bg-white dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <h1 className="text-base sm:text-xl font-semibold">
                Total Orders : {cancelledCount + deliveredCount || 0}
              </h1>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                  Delivered
                </div>

                <div className="flex items-center gap-1">
                  <span className="bg-red-500 h-2 w-2 rounded-full"></span>
                  Cancelled
                </div>
                <div className="flex items-center gap-1">
                  <span className="bg-yellow-500 h-2 w-2 rounded-full"></span>
                  Pending
                </div>

                <div className="flex items-center gap-1">
                  <span className="bg-blue-500 h-2 w-2 rounded-full"></span>
                  Shipped
                </div>
              </div>
            </div>
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderChartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="4 4" />

                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    height={30}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#111827",
                      color: "#e5e7eb",
                      borderRadius: "10px",
                      border: "1px solid rgba(96,165,250,0.4)",
                      boxShadow: "0 0 8px rgba(96,165,250,0.3)",
                      padding: "10px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar
                    dataKey="delivered"
                    fill="#22c55e" // green
                    radius={4}
                    fillOpacity={1}
                    isAnimationActive={false}
                    activeBar={{ fill: "#16a34a" }}
                  />

                  <Bar
                    dataKey="cancelled"
                    fill="#ef4444" // red
                    radius={4}
                    fillOpacity={1}
                    isAnimationActive={false}
                    activeBar={{ fill: "#dc2626" }}
                  />

                  <Bar
                    dataKey="pending"
                    fill="#facc15" // yellow
                    radius={4}
                    fillOpacity={1}
                    isAnimationActive={false}
                    activeBar={{ fill: "#eab308" }}
                  />

                  <Bar
                    dataKey="shipped"
                    fill="#3b82f6" // blue
                    radius={4}
                    fillOpacity={1}
                    isAnimationActive={false}
                    activeBar={{ fill: "#2563eb" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
