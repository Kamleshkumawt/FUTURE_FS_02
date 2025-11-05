import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon, Settings } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSellerLogoutMutation } from '../../store/api/seller/authApi';
import { useDispatch } from 'react-redux';


const Sidebar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [sellerLogout,  {isLoading}] = useSellerLogoutMutation();

    const logoutHandler = async () => {
    try {
      await sellerLogout().unwrap();
      //  dispatch(clearSellerUser()); 
       localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const adminNAvlinks = [
        {name: 'Dashboard', path: '/seller', icon: LayoutDashboardIcon},
        {name: 'Add Product', path: '/seller/new-category-product', icon: PlusSquareIcon},
        {name: 'List Products', path: '/seller/list-products', icon: ListIcon},
        {name: 'List Pending Orders', path: '/seller/list-orders', icon: ListCollapseIcon},
        {name: 'List Delivered Orders', path: '/seller/list-del-orders', icon: ListCollapseIcon},
        {name: 'List Shipped Orders', path: '/seller/list-ship-orders', icon: ListCollapseIcon},
        {name: 'List Returned Orders', path: '/seller/list-ret-orders', icon: ListCollapseIcon},
        {name: 'Settings', path: '/seller/list-ret-stting', icon: Settings},
    ]


  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-400/30 text-sm'>
        {/* <img src={user.imageUrl} alt="sidebar" /> */}
        {/* <p className='mt-2 text-base max-md:hidden'>{user.firstName} {user.lastName}</p> */}
        <div className='w-full'>
            {adminNAvlinks.map((link, index) => (
                <NavLink to={link.path} key={index} end  className={({ isActive }) => `relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-gray-400 ${isActive && 'bg-primary/15 text-primary group'}`}>
                {({isActive})=>(
                        <>
                            <link.icon className='w-5 h-5' />
                            <p className='max-md:hidden'>{link.name}</p>
                            <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-primary' }`}></span>
                        </>
                    )}
                </NavLink>
            ))}
            <span className=' cursor-pointer min-md:ml-10 ml-5 text-gray-400 flex items-center gap-2' disabled={isLoading} onClick={()=> {logoutHandler();scrollTo(0,0);}} ><img src="https://cdn-icons-png.flaticon.com/128/1286/1286853.png" className='w-5 h-5 object-cover opacity-30' alt="icon" /> <span className='max-md:hidden'>{'LogOut'}</span></span>
        </div>
    </div>
  )
}

export default Sidebar