import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSellerUser } from "../../store/slices/authSlice";
import Loading from "../../components/Loading";
import Title from "../../components/sellerPanel/Title";
import { useGetSellerProfileMutation } from "../../store/api/seller/sellerApi";
import {
  useGetOrdersByStatusForSellerQuery,
  useGetSellerIncomeQuery,
  useGetSellerOrderStatsQuery,
} from "../../store/api/user/orderApi";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { formatAmount } from "../../lib/formatAmount";

const MONTHS = Object.freeze([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);

const Dashboard = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState({});
  const [incomeChartData, setIncomeChartData] = useState([]);
  const [orderChartData, setOrderChartData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const [getSellerProfile, { isLoading }] = useGetSellerProfileMutation();
  const { data: incomeData } = useGetSellerIncomeQuery();
  const { data: ordersByStatus } = useGetOrdersByStatusForSellerQuery();
  const { data: orderStats } = useGetSellerOrderStatsQuery();

  useEffect(() => {
    getSellerProfile()
      .unwrap()
      .then((res) => {
        if (res?.data) dispatch(setSellerUser(res.data));
      });
  }, []);

  useEffect(() => {
    if (!ordersByStatus?.orders) return;
    // console.log(ordersByStatus.orders);
    setProducts(ordersByStatus.orders);
  }, [ordersByStatus]);

  const totalOrders = Object.values(products).reduce(
    (sum, val) => sum + (val || 0),
    0
  );

  const statusData = [
    {
      label: "Delivered",
      color: "#22c55e",
      percentage: totalOrders ? (products.delivered / totalOrders) * 100 : 0,
    },
    {
      label: "Pending",
      color: "#eab308",
      percentage: totalOrders ? (products.pending / totalOrders) * 100 : 0,
    },
    {
      label: "Cancelled",
      color: "#ef4444",
      percentage: totalOrders ? (products.cancelled / totalOrders) * 100 : 0,
    },
  ];

  useEffect(() => {
    if (!incomeData?.stats) return;

    const stats = incomeData.stats;

    // console.log(stats);

    const delivered = stats.find((s) => s._id === "Delivered");

    setTotalIncome(Number(delivered?.totalIncome?.toFixed(2)) || 0);
    setTotalSales(delivered?.totalSales || 0);

    // const testStats = [
    //   {
    //     _id: "Delivered",
    //     totalIncome: 3999.2,
    //     totalSales: 80,
    //     monthly: [
    //       {
    //         month: 11,
    //         sales: 1,
    //         income: 7099.2,
    //       },
    //       {
    //         month: 12,
    //         sales: 1,
    //         income: 359.2,
    //       },
    //       {
    //         month: 4,
    //         sales: 1,
    //         income: 3150.2,
    //       },
    //       {
    //         month: 1,
    //         sales: 65,
    //         income: 39959.2,
    //       },
    //     ],
    //   },
    //   {
    //     _id: "Cancelled",
    //     totalIncome: 12999.1,
    //     totalSales: 90,
    //     monthly: [
    //       {
    //         month: 11,
    //         sales: 2,
    //         income: 0,
    //       },
    //       {
    //         month: 3,
    //         sales: 15,
    //         income: 1540,
    //       },
    //       {
    //         month: 5,
    //         sales: 50,
    //         income: 9000,
    //       },
    //     ],
    //   },
    // ];

    const chartBase = MONTHS.map((m) => ({
      month: m,
      income: 0,
      sales: 0,
    }));
    const allMonthly = stats.flatMap((item) => item.monthly || []);

    // stats?.forEach((m) => {
    //   const i = m.month - 1;
    //   chartBase[i].income = Number(m.income?.toFixed(2)) || 0;
    //   chartBase[i].sales = m.sales ?? 0;
    // });

    allMonthly.forEach((m) => {
      const i = (m.month || 1) - 1;
      chartBase[i].income += Number(m.income?.toFixed(2)) || 0;
      chartBase[i].sales += m.sales ?? 0;
    });

    setIncomeChartData(chartBase);
  }, [incomeData]);

  useEffect(() => {
    if (!orderStats?.stats) return;

    const base = MONTHS.map((m) => ({
      month: m,
      delivered: 0,
      cancelled: 0,
    }));

    orderStats.stats.forEach((item) => {
      item.monthly.forEach((m) => {
        const i = m.month - 1;
        if (item._id === "Delivered") base[i].delivered += m.count;
        if (item._id === "Cancelled") base[i].cancelled += m.count;
      });
    });

    // console.log(base);

    // const base1 = [
    //   { month: "January", delivered: 1, cancelled: 1 },
    //   { month: "February", delivered: 15, cancelled: 3 },
    //   { month: "March", delivered: 5, cancelled: 0 },
    //   { month: "April", delivered: 9, cancelled: 0 },
    //   { month: "May", delivered: 4, cancelled: 5 },
    //   { month: "June", delivered: 2, cancelled: 3 },
    //   { month: "July", delivered: 0, cancelled: 3 },
    //   { month: "August", delivered: 5, cancelled: 4 },
    //   { month: "September", delivered: 15, cancelled: 2 },
    //   { month: "October", delivered: 6, cancelled: 1 },
    //   { month: "November", delivered: 1, cancelled: 2 },
    //   { month: "December", delivered: 8, cancelled: 2 },
    // ];

    setOrderChartData(base);
  }, [orderStats]);

  const maxValue = Math.max(totalSales, totalIncome);

  const incomeSummary = [
    {
      label: "Total Sales",
      color: "#3b82f6",
      percentage: maxValue
        ? parseFloat(totalSales / maxValue).toFixed(2) * 100
        : 0,
    },
    {
      label: "Total Income",
      color: "#10b981",
      percentage: maxValue
        ? parseFloat(totalIncome / maxValue).toFixed(2) * 100
        : 0,
    },
  ];

  const totalPercentage = statusData.reduce((acc, s) => acc + s.percentage, 0);

  return !isLoading ? (
    <div>
      {/* {seller && seller.store_name && <h1>{seller.store_name}</h1>} */}
      <Title text1={"Dashboard"} text2={"Details"} />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 w-full gap-4 sm:gap-8 p-2">
          <div className="border border-gray-400 p-2 sm:p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Pending Order's
            </span>{" "}
            <span className="text-2xl font-bold w-full text-end">
              {(products?.pending ?? 0).toString()}
            </span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Ongoing Order's
            </span>{" "}
            <span className="text-2xl font-bold text-end">
              {(products?.shipped ?? 0).toString()}
            </span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Move To delivered
            </span>
            <span className="text-2xl font-bold text-end">
              {(products?.delivered ?? 0).toString()}
            </span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Move To cancelled
            </span>
            <span className="text-2xl font-bold text-end">
              {(products?.cancelled ?? 0).toString()}
            </span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Total Order's
            </span>
            <span className="text-2xl font-bold text-end">
              {(
                (products?.pending ?? 0) +
                (products?.shipped ?? 0) +
                (products?.delivered ?? 0) +
                (products?.cancelled ?? 0)
              ).toString()}
            </span>
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
              {(formatAmount(totalIncome) ?? 0).toString()}
            </span>
          </div>
          <div className="border border-gray-400 p-5 rounded-sm font-medium flex flex-col w-full gap-5">
            <span className="flex items-center gap-3">
              <img
                src="https://img.icons8.com/?size=96&id=QDgOnr6UAOmg&format=png"
                alt="icon"
                className="sm:w-8 w-5 h-5 sm:h-8 object-cover"
              />
              Total Sales
            </span>
            <span className="text-2xl font-bold text-end">
              {(totalSales ?? 0).toString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-2 lg:gap-10 xl:gap-30  justify-center items-center">
          <div className="w-full border border-gray-200 rounded-lg p-4 mt-6 bg-white dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <h1 className="text-base sm:text-xl font-semibold">
                Order Summary
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

                  {/* FIXED BARS — always visible */}
                  <Bar
                    dataKey="delivered"
                    fill="#22c55e"
                    radius={4}
                    fillOpacity={1}
                    isAnimationActive={false}
                    activeBar={{ fill: "#16a34a" }}
                  />

                  <Bar
                    dataKey="cancelled"
                    fill="#ef4444"
                    radius={4}
                    fillOpacity={1}
                    isAnimationActive={false}
                    activeBar={{ fill: "#dc2626" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="max-w-lg border border-gray-200 rounded-lg shadow-sm p-5 mt-2 sm:mt-10 bg-white dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Order Status
                </h1>
                <p className="text-gray-400 font-medium text-sm">
                  Total Earnings
                </p>
              </div>
              <img
                src="https://cdn-icons-png.flaticon.com/128/17723/17723498.png"
                alt="icon"
                className="w-10 h-10 object-cover"
              />
            </div>

            {/* Center Circle */}
            <div className="relative w-32 h-32 mx-auto mt-10">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                {/* Background circle */}
                <circle
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  fill="transparent"
                  r="16"
                  cx="18"
                  cy="18"
                />

                {
                  statusData.reduce(
                    (acc, s, i) => {
                      const prevPercent = acc.prevPercent || 0;
                      const radius = 16;
                      const circumference = 2 * Math.PI * radius;

                      // Arc length in pixels
                      const arcLength = (s.percentage / 100) * circumference;
                      const remaining = circumference - arcLength;

                      acc.prevPercent = prevPercent + s.percentage;

                      acc.circles.push(
                        <circle
                          key={i}
                          stroke={s.color}
                          strokeWidth="3"
                          fill="transparent"
                          r={radius}
                          cx="18"
                          cy="18"
                          strokeDasharray={`${arcLength} ${remaining}`}
                          strokeDashoffset={
                            circumference * 0.25 -
                            (prevPercent / 100) * circumference
                          } // rotate start
                          // strokeLinecap="round"
                        />
                      );

                      return acc;
                    },
                    { circles: [] }
                  ).circles
                }
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Ratio
                </span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {totalPercentage}%
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              {statusData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-xs sm:text-sm font-medium"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.label} ({item.percentage}%)
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-2 lg:gap-10 xl:gap-30 justify-center items-center">
          <div className="max-w-md mt-2 sm:mt-10 border border-gray-200 rounded-lg shadow-sm p-5 bg-white dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Total Income & Sales
                </h1>
                <p className="text-gray-400 font-medium text-sm">
                  Overview of earnings and orders
                </p>
              </div>
              <img
                src="https://cdn-icons-png.flaticon.com/128/2331/2331941.png"
                alt="icon"
                className="w-10 h-10 object-cover"
              />
            </div>

            {/* Half Circle Chart */}
            <div className="relative w-48 h-24 mx-auto mt-6">
              <svg viewBox="0 0 36 18" className="w-full h-full">
                {/* Background semi-circle */}
                <path
                  d="M2 18 A16 16 0 0 1 34 18"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                  fill="transparent"
                />
                {/* Sales arc */}
                <path
                  d={`
                    M2 18 
                    A16 16 0 0 1 ${
                      2 + 32 * (totalSales / Math.max(totalSales, totalIncome))
                    } 18
                  `}
                  stroke="#3b82f6"
                  strokeWidth="4"
                  fill="transparent"
                />
                {/* Income arc */}
                <path
                  d={`
                    M2 18 
                    A16 16 0 0 1 ${
                      2 + 32 * (totalIncome / Math.max(totalSales, totalIncome))
                    } 18
                  `}
                  stroke="#10b981"
                  strokeWidth="4"
                  fill="transparent"
                />
              </svg>

              {/* <div className="absolute inset-0 flex flex-col items-center justify-center -mt-2">
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-base font-bold text-blue-600">
                {totalSales || 0}25555
              </p>
              <p className="text-sm text-gray-500 mt-1">Income</p>
              <p className="text-base font-bold text-green-600">
                {totalIncome || 0}
              </p>
            </div> */}
            </div>

            <div className="flex justify-center gap-5 sm:gap-20 mt-6">
              {incomeSummary.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-xs sm:text-sm font-medium"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.label} ({item.percentage}%)
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[18rem] sm:max-w-2xl border border-gray-200 rounded-sm p-2 mt-4 sm:mt-10">
            <div className="flex items-center justify-between gap-10 p-1">
              <h1 className="text-sm sm:text-xl py-2 font-medium">Revenue</h1>

              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-1 text-xs">
                  <span className="bg-blue-500 h-[7px] w-[7px] rounded-full"></span>
                  Income
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="bg-blue-300 h-[7px] w-[7px] rounded-full"></span>
                  Sales
                </div>
              </div>
            </div>

            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={incomeChartData}
                  layout="vertical"
                  margin={{ top: 20, right: 20, left: 80, bottom: 20 }}
                >
                  {/* Grid */}
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} />

                  {/* Month Axis */}
                  {/* <YAxis
                    dataKey="month"
                    type="category"
                    tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />

                  
                  <XAxis
                    type="number"
                    // Show tick labels with formatting
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en-IN", {
                        maximumFractionDigits: 0,
                      }).format(value)
                    }
                    axisLine={false}
                    tickLine={false}
                    domain={[0, "dataMax"]}
                    tickCount={5}
                  /> */}

                  <YAxis
                    dataKey="month"
                    type="category"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />

                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
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

                  {/* Bars */}
                  <Bar
                    dataKey="income"
                    fill="#3b82f6"
                    barSize={14}
                    radius={[4, 4, 4, 4]}
                  />

                  <Bar
                    dataKey="sales"
                    fill="#93c5fd"
                    barSize={14}
                    radius={[4, 4, 4, 4]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
