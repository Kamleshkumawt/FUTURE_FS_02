import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setSellerUser } from "../../store/slices/authSlice";
import Loading from "../../components/Loading";
import Title from "../../components/sellerPanel/Title";
import {
  useGetProductStatusForSellerMutation,
} from "../../store/api/seller/productApi";
import { useGetSellerProfileMutation } from "../../store/api/seller/sellerApi";

const Dashboard = () => {
  const [products, setProducts] = useState("");
  const [orderChartData, setOrderChartData] = useState("");
  const [chartData, setIncomeChartData] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  const dispatch = useDispatch();

  const [getSellerProfile, { data, isLoading }] = useGetSellerProfileMutation();
  const [getIncomeBySellerId, { data: idData }] =
    useGetProductStatusForSellerMutation();
    
  const [getProductStatusForSeller, { data: PTRs }] =
    useGetProductStatusForSellerMutation();

  useEffect(() => {
    getSellerProfile();
    getProductStatusForSeller();
    getIncomeBySellerId();
  }, []);

  const months = [
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
  ];

  useEffect(() => {
    if (data) {
      // console.log('data : ',data);
      dispatch(setSellerUser(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (idData) {
      console.log("data for income  : ", idData);

      // const statsFromDB = idData?.stats[0]; // example: Delivered status
      // // console.log("totalAmount : ", idData?.stats[0].totalIncome);
      // // console.log("totalAmount : ", idData?.stats[0].totalSales);
      // setTotalIncome(Number(idData?.stats[0].totalIncome));
      // setTotalSales(Number(idData?.stats[0].totalSales));

      // // Initialize chart data with 0s
      // const baseChartData = months.map((month) => ({
      //   month,
      //   income: 0,
      //   sales: 0,
      // }));

      // // Fill in the actual data from stats
      // statsFromDB.monthly.forEach((m) => {
      //   const index = m.month - 1; // MongoDB $month returns 1-12
      //   baseChartData[index].income = m.totalAmount;
      //   baseChartData[index].sales = m.sales;
      // });

      // // console.log("for income : ", baseChartData);
      // setIncomeChartData(baseChartData);
    }
  }, [idData, dispatch]);

  useEffect(() => {
    if (PTRs) {
      console.log("data : ", PTRs?.products);
      setProducts(PTRs?.products);
      // const orderChartData = months.map((month, index) => {
      //   const monthNumber = index + 1;
      //   const getCount = (key) => {
      //     const found = PTRs?.response[key]?.monthly?.find(
      //       (m) => m.month === monthNumber
      //     );
      //     return found ? found.count : 0;
      //   };

      //   return {
      //     month,
      //     cancelled: getCount("cancelled"),
      //     delivered: getCount("delivered"),
      //   };
      // });

      // setOrderChartData(orderChartData);
    }
  }, [PTRs, dispatch]);

  // const chartData = [
  //   { month: "January", income: 186, sales: 80 },
  //   { month: "February", income: 305, sales: 200 },
  //   { month: "March", income: 237, sales: 120 },
  //   { month: "April", income: 73, sales: 190 },
  //   { month: "May", income: 209, sales: 140 },
  //   { month: "June", income: 214, sales: 150 },
  // ];

  const chartConfig = {
    income: {
      label: "income",
      color: "#2563eb",
    },
    sales: {
      label: "sales",
      color: "#60a5fa",
    },
  };

  // const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // // Build chart data
  // const orderChartDat = monthNames.slice(0,6).map((monthName, index) => {
  //   const monthNumber = index + 1;

  //   const delivered =
  //     (chart?.pending.monthly.find(m => m.month === monthNumber)?.count || 0) +
  //     (chart?.shipped.monthly.find(m => m.month === monthNumber)?.count || 0) +
  //     (chart?.delivered.monthly.find(m => m.month === monthNumber)?.count || 0);

  //   const cancelled = chart?.cancelled.monthly.find(m => m.month === monthNumber)?.count || 0;

  //   return { month: monthName, delivered, cancelled };
  // });

  // console.log(orderChartData);

  const orderChartConfig = {
    delivered: {
      label: "delivered",
      color: "#DC143C",
    },
    cancelled: {
      label: "cancelled",
      color: "#F75270",
    },
  };

  // Total number of orders
  const totalOrders = Object.values(products).reduce(
    (sum, val) => sum + val,
    0
  );

  // If totalOrders = 0, avoid division by zero
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
    // { label: "Shipped", color: "#3b82f6", percentage: totalOrders ? (products.shipped / totalOrders) * 100 : 0 },
    {
      label: "Cancelled",
      color: "#ef4444",
      percentage: totalOrders ? (products.cancelled / totalOrders) * 100 : 0,
    },
  ];

  const maxValue = Math.max(totalSales || 0, totalIncome || 0);

  const incomeData = [
    {
      label: "Total Sales",
      color: "#3b82f6",
      percentage: maxValue ? ((totalSales || 0) / maxValue) * 100 : 0,
    },
    {
      label: "Total Income",
      color: "#10b981",
      percentage: maxValue ? ((totalIncome || 0) / maxValue) * 100 : 0,
    },
  ];

  // Total percentage (should be 100 or 0 if no orders)
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
              Pending PR's
            </span>{" "}
            <span className="text-2xl font-bold w-full text-end">
              {(
                (products?.pending ?? 0)
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
              Ongoing PR's
            </span>{" "}
            <span className="text-2xl font-bold text-end">
              {(
                (products?.shipped ?? 0)
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
              Move To delivered
            </span>
            <span className="text-2xl font-bold text-end">
              {(
                (products?.delivered ?? 0)
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
              Total PR's
            </span>
            <span className="text-2xl font-bold text-end">
              {(
                (products?.pending ?? 0) +
                (products?.shipped ?? 0) +
                (products?.delivered ?? 0)
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
              {(
                (totalIncome ?? 0)
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
              Total Sales
            </span>
            <span className="text-2xl font-bold text-end">
              {(
                (totalSales ?? 0)
              ).toString()}
            </span>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-2 lg:gap-10 xl:gap-30  justify-center items-center">
          <div className="max-w-[18rem] sm:max-w-2xl border border-gray-200 rounded-sm p-2 mt-2 sm:mt-10">
            <div className="flex items-center justify-between gap-10 p-1">
              <h1 className="text-sm sm:text-xl py-2 font-medium">
                Order Success
              </h1>
              <div className="flex items-center justify-between gap-10">
                <div className="flex items-center gap-1 text-xs">
                  <span className="bg-red-500 h-[7px] w-[7px] rounded-full"></span>
                  delivered
                </div>
                <div className="flex items-center gap-1 text-xs ">
                  <span className="bg-red-300 h-[7px] w-[7px] rounded-full"></span>
                  Cancelled
                </div>
              </div>
            </div>
            {/* <ChartContainer
              config={orderChartConfig}
              className="min-h-[150px] sm:min-h-[200px] lg:min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={orderChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="delivered"
                  fill="var(--color-delivered)"
                  radius={2}
                />
                <Bar
                  dataKey="cancelled"
                  fill="var(--color-cancelled)"
                  radius={2}
                />
              </BarChart>
            </ChartContainer> */}
          </div>

          <div className="max-w-lg border border-gray-200 rounded-lg shadow-sm p-5 mt-2 sm:mt-10 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="sm:text-xl font-semibold text-gray-800">
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
                <span className="text-gray-600 text-sm font-medium">Ratio</span>
                <span className="text-xl font-bold text-gray-800">
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
                    className="h-[8px] w-[8px] rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.label} ({item.percentage}%)
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-2 lg:gap-10 xl:gap-30 justify-center items-center">
          <div className="max-w-md mt-2 sm:mt-10 border border-gray-200 rounded-lg shadow-sm p-5 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="sm:text-xl font-semibold text-gray-800">
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
              {incomeData.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-xs sm:text-sm font-medium"
                >
                  <span
                    className="h-[8px] w-[8px] rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                  {item.label} ({item.percentage}%)
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-[18rem] sm:max-w-2xl border border-gray-200 rounded-sm p-2 mt-2 sm:mt-10">
            <div className="flex items-center justify-between gap-10 p-1">
              <h1 className="text-sm sm:text-xl py-2 font-medium">Revenue</h1>
              <div className="flex items-center justify-between gap-10">
                <div className="flex items-center gap-1 text-xs">
                  <span className="bg-blue-500 h-[7px] w-[7px] rounded-full"></span>
                  Income
                </div>
                <div className="flex items-center gap-1 text-xs ">
                  <span className="bg-blue-300 h-[7px] w-[7px] rounded-full"></span>
                  sales
                </div>
              </div>
            </div>
            {/* <ChartContainer
              config={chartConfig}
              className="min-h-[150px] sm:min-h-[200px] lg:min-h-[250px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="income" fill="var(--color-income)" radius={2} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={2} />
              </BarChart>
            </ChartContainer> */}
          </div>

        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Dashboard;
