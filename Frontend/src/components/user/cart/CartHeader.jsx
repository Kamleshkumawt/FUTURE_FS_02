import React from 'react'
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../../user/ThemeToggle';

const CartHeader = ({address}) => {

  const navigate = useNavigate();
  return (
      <div className='w-full h-[70px] flex items-center justify-evenly px-20 py-2 border-b-2 border-gray-300 dark:border-gray-500'>
        <ThemeToggle />
        <span  onClick={()=>{navigate("/");scrollTo(0,0);}} className="text-2xl cursor-pointer">ApanaStore</span>
        <div>
          <div className='hidden sm:flex  items-center justify-center font-medium text-gray-300'>
          <div className='text-xs flex flex-col items-center gap-2'><span className={`flex items-center justify-center border-2  p-2 rounded-full w-2 h-2 ${address >= 1 ? "border-purple-400 bg-purple-400" : "border-gray-400"}`}>1</span>Cart</div>
          <span className={`border  w-[6rem] mb-6 ${address === 2 ? "border-purple-400" : " border-gray-300 dark:border-gray-400"} `}></span>
          <div className='text-xs flex flex-col items-center gap-2 -ml-3'><span className={`flex items-center justify-center border-2 border-gray-400 p-2 rounded-full w-2 h-2 ${address >= 2 ? "border-purple-400 bg-purple-400" : " border-gray-300"}`}>2</span>address</div>
          <span className={`border  w-[6rem] mb-6 -ml-3 ${address === 3 ? "border-purple-400" : " border-gray-300 dark:border-gray-400"} `}></span>
          <div className='text-xs flex flex-col items-center gap-2 -ml-3'><span className={`flex items-center justify-center border-2 border-gray-400 p-2 rounded-full w-2 h-2 ${address >= 3 ? "border-purple-400 bg-purple-400" : " border-gray-300"}`}>3</span>Payment</div>
          <span className={`border  w-[6rem] mb-6 -ml-3 ${address === 4 ? "border-purple-400" : " border-gray-300 dark:border-gray-400"} `}></span>
          <div className='text-xs flex flex-col items-center gap-2 -ml-3'><span className={`flex items-center justify-center border-2 border-gray-400 p-2 rounded-full w-2 h-2 ${address === 4 ? "border-purple-400 " : " border-gray-300"}`}>4</span>Summary</div>
          </div>
        </div>
    </div>
  )
}

export default CartHeader