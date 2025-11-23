import { LayersIcon, LayoutDashboardIcon, ListCollapseIcon, PackageIcon, PlusSquareIcon, Settings, ShoppingCart, Store, User2 } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearAdminUser } from '../../store/slices/authSlice'
import logo from '../../assets/profile.png'
import { useLogoutAdminMutation } from '../../store/api/admin/authApi'
import {toast} from 'react-hot-toast'

const AdminSidebar = () => {

    // const admin = useSelector((state) => state.auth.admin);
    
    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: logo,
    }

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [logoutAdmin,  {isLoading}] = useLogoutAdminMutation();
    
        const logoutHandler = async () => {
        try {
          await logoutAdmin().unwrap();
          toast.success('Logged out successfully!');
           dispatch(clearAdminUser()); 
           localStorage.removeItem('token');
          navigate('/');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    const adminNAvlinks = [
        {name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon},
        {name: 'Add Category', path: '/admin/add-category', icon: PlusSquareIcon},
        {name: 'List Users', path: '/admin/show/all-user', icon: User2},
        {name: 'List Blocked Users', path: '/admin/show/all-blocked-user', icon: ListCollapseIcon},
        {name: 'List Seller', path: '/admin/show/all-seller', icon: Store},
        {name: 'List Blocked Sellers', path: '/admin/show/all-blocked-seller', icon: ListCollapseIcon},
        {name: 'List Products', path: '/admin/show/all-products', icon: PackageIcon},
        {name: 'List Orders', path: '/admin/show/all-orders', icon: ShoppingCart},
        {name: 'List categories', path: '/admin/show/all-categories', icon: LayersIcon},
        {name: 'Settings', path: '/admin/ret-stting', icon: Settings},
    ]

  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/30 text-sm'>
        <img src={user.imageUrl} alt="sidebar" />
        <p className='mt-2 text-base max-md:hidden'>{user.firstName} {user.lastName}</p>
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
            <span className=' cursor-pointer min-md:ml-10 ml-5 text-gray-400 flex items-center gap-2' disabled={isLoading} onClick={()=> {logoutHandler();scrollTo(0,0);}} ><img src="https://cdn-icons-png.flaticon.com/128/1286/1286853.png" className='w-5 h-5 object-cover opacity-30' alt="icon" /> <span className='max-md:hidden'>{'SignOut'}</span></span>
        </div>
    </div>
  )
}

export default AdminSidebar