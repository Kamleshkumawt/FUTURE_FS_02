import {useSelector } from 'react-redux';
import ThemeToggle from '../user/ThemeToggle';

const AdminNavbar = () => {
    const admin = useSelector((state) => state.auth.admin);
  return  (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-400/30 bg-gray-100 dark:bg-[#2A1C20] text-gray-900 dark:text-gray-100'>
        {/* <Link to={'/seller'} >
            <img src={logo} alt="logo" className='w-40 h-auto' />
        </Link> */}
         <ThemeToggle />
        <div className='text-xl font-medium text-gray-500 dark:text-gray-300'>ApanaStore</div>
        <div className='flex items-center gap-2'>
            <div className='w-10 h-10'>
                <img className='w-full h-full object-cover rounded-full' src={admin?.profilePicture} alt="name" />
            </div>
            <div className='flex flex-col items-start'>
                <h1 className='text-lg font-medium'>{admin?.fullName}</h1>
                <p className='font-medium text-[10px] text-gray-400 -mt-1'>Product Designer</p>
            </div>
        </div>
    </div>
  );
}
export default AdminNavbar;