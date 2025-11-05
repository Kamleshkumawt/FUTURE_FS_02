import { useEffect } from 'react';
import Navbar from '../../components/sellerPanel/Navbar'
import Sidebar from '../../components/sellerPanel/Sidebar'
import { Outlet } from 'react-router-dom'
import { setSellerUser } from '../../store/slices/authSlice';
import { useGetSellerProfileMutation } from '../../store/api/seller/sellerApi';
import { useDispatch } from 'react-redux';
import Loading from '../../components/Loading';

const Layout = () => {
  const dispatch = useDispatch();

    const [getProfileSeller,{data, isLoading}] = useGetSellerProfileMutation();

  useEffect(() => {
      getProfileSeller();
  },[getProfileSeller]);

  useEffect(() => {
      if(data){
          // console.log('data : ',data);
          dispatch(setSellerUser(data.seller));
      }
  },[data, dispatch]);

  return !isLoading ? (
    <>
    <Navbar />
    <div className='flex bg-gray-100'>
        <Sidebar/>
        <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
            <Outlet />
        </div>
    </div>
    </>
  ) : <Loading/>
}

export default Layout