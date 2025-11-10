import CartHeader from "../components/CartHeader";
import { useDispatch, useSelector } from "react-redux";
import CartSidebar from "../components/CartSidebar";
import { useEffect, useState } from "react";
import CartAddressComponent from "../components/CartAddress";
import { setAddress } from "../store/slices/productsFilterSlice";

const CartAddress = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const dispatch = useDispatch();

  const itemsAndPrice = useSelector((state) => state.filters.itemsAndPrice);
  const user = useSelector((state) => state.auth.user);
  const addr = useSelector((state) => state.filters.address);

  useEffect(() => {
    if (user?.address) {
      dispatch(setAddress(user.address));
      // console.log("User address:", user.address);
    }
  }, [user]);

  useEffect(() => {
    if (addr?.length > 0) {
      const defaultAddr = addr.find((a) => a.isDefault);
      setSelectedAddressId(defaultAddr?._id || addr[0]._id);
    }
  }, [addr]);

  return (
    <div>
      <div className="w-full min-h-screen">
        <CartHeader address={2} />
        <div className="w-full h-full flex flex-col sm:flex-row items-start justify-center gap-3 p-3">
          <div className=" w-full sm:w-[60%] h-full flex flex-col items-end gap-2 sm:px-5 sm:border-r-2 sm:border-gray-200">
            <div className="space-y-3">
              <div className="text-lg font-medium text-gray-500 py-1 w-full flex items-center justify-between">
                Select Delivery Address
                <span
                  onClick={() => setOpenSideBar(true)}
                  className="text-purple-600 cursor-pointer"
                >
                  {" "}
                  + ADD NEW ADDRESS
                </span>
              </div>

              {addr?.length > 0 ? (
                addr?.map((addr, index) => (
                  <CartAddressComponent
                    key={index}
                    addr={addr}
                    openSideBar={openSideBar}
                    setOpenSideBar={setOpenSideBar}
                    isSelected={selectedAddressId === addr._id}
                    onSelect={() => setSelectedAddressId(addr._id)}
                  />
                ))
              ) : (
                <div className="text-lg font-medium text-gray-500 py-1 w-full flex items-center justify-between">
                  No Address Found
                </div>
              )}
            </div>
          </div>
          <div className="w-[40%] h-full flex flex-col items-start">
            {/* <div className="w-xs h-full flex flex-col items-start gap-3">
              <h1 className="text-lg font-medium text-gray-600 py-3">
                Price Details ({itemsAndPrice?.items} Items)
              </h1>
              <p className="flex items-center w-full justify-between ">
                <span className="border-b-2 border-gray-700 border-dotted font-medium text-gray-500">
                  Total Product Price{" "}
                </span>
                + {itemsAndPrice?.price}
              </p>
              <div className="text-green-700 font-medium w-full flex items-center justify-between">
                <span className="border-b-2 border-gray-700 border-dotted ">
                  Total Product Price{" "}
                </span>{" "}
                <span>- 81</span>
              </div>
              <span className="block w-full border-b-2 border-gray-300"></span>
              <h1 className="text-xl w-full font-medium flex items-center justify-between">
                {" "}
                Order Total <span>{itemsAndPrice?.price}</span>
              </h1>
              <div className="bg-green-300/30 w-full text-center p-2 px-4 rounded-sm mt-3 text-green-600">
                Yay! Your total discount is 81
              </div>
            </div> */}
            <CartSidebar
              items={{
                length: itemsAndPrice?.items,
                totalPrice: itemsAndPrice?.price,
              }}
              nav={"address"}
              viewPage={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartAddress;
