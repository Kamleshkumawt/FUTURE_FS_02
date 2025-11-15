import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {useUserLogoutMutation } from '../../store/api/user/authApi';
import {useUpdateUserProfileMutation, useUpdateUserProfilePasswordMutation } from '../../store/api/user/userApi';
import {setUser, clearUser } from '../../store/slices/authSlice';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditModalPass, setShowEditModalPass] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [userLogout,  {isLoading}] = useUserLogoutMutation();
  const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateUserProfile,{error}] = useUpdateUserProfileMutation();
  const [updateUserProfilePassword] = useUpdateUserProfilePasswordMutation();
  const [previewImage, setPreviewImage] = useState('https://tse3.mm.bing.net/th/id/OIP.Ip2y_2_KabgvNaHIZhYoJgHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await userLogout().unwrap();
       dispatch(clearUser()); 
       localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    // console.log(file);

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      // console.log(imageUrl);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
    formData.append('profile_picture', profileImage); // 'profile_picture' must match Multer field name
    formData.append('username', username);
    formData.append('email', email);
    formData.append('phone', phone);

//    formData.forEach((value, key) => {
//   console.log(key + ':', value);
// });
    
      const response = await updateUserProfile(formData).unwrap();
      // console.log('Profile updated successfully:', response);
      dispatch(setUser(response.data));
      setShowEditModal(false);
    } catch(error) {
      console.error('Save changes error:', error);
    }
  };

  const handleSaveChangesPass = async () => {
    try {
      await updateUserProfilePassword({ oldPassword, newPassword }).unwrap();
      // console.log('Password updated successfully:', response);
      setShowEditModal(false);
    } catch(error) {
      console.error('Save changes error:', error);
    }
  };

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="relative z-50 "
    >
      {/* Trigger */}
      <div className="flex flex-col items-center gap-1 pt-2 cursor-pointer group">
        <svg
          width="24"
          height="24"
          fill="currentColor"
          className="text-gray-900 dark:text-gray-300 group-hover:text-yellow-600 transition-colors"
          viewBox="0 0 24 24"
        >
          <path d="M15.316 13.016c1.512-1.058 2.516-2.797 2.516-4.784A5.835 5.835 0 0 0 12 2.4a5.835 5.835 0 0 0-5.832 5.832 5.79 5.79 0 0 0 2.517 4.784C4.343 14.291 1.2 17.996 1.2 22.37v.022c0 .896.843 1.609 1.825 1.609h17.95c.983 0 1.825-.713 1.825-1.61v-.02c0-4.375-3.143-8.08-7.484-9.354ZM7.853 8.232a4.148 4.148 0 0 1 8.294 0 4.148 4.148 0 0 1-8.294 0Zm13.122 14.083H3.025a.245.245 0 0 1-.14-.032c.054-4.45 4.126-8.057 9.115-8.057 4.99 0 9.05 3.596 9.115 8.057a.245.245 0 0 1-.14.032Z" />
        </svg>
        <span className="text-[16px] group-hover:text-yellow-600 transition-colors">
          Profile
        </span>
        <span className="w-20 h-[3px] mt-1 bg-gray-300 opacity-0 group-hover:opacity-100 group-hover:bg-yellow-600 transition-all duration-200"></span>
      </div>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute top-full  right-0 w-64 shadow-md rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          {/* Profile */}
          {user && <div className="flex items-center gap-3">
            <img
              // src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2"
              src={user?.profilePicture ?? ''}
              className="h-10 w-10 rounded-full object-cover"
              lazy="loading"
              alt="Profile"
            />
            <div>
              <h1 className="text-lg font-semibold">{user.username}</h1>
              <p className="text-sm dark:text-gray-400 text-gray-600">+91 {user.phone}</p>
            </div>
          </div>}
          
          {!user &&<div className="flex flex-col items-start gap-3">
            <div>
              <h1 className="text-lg font-semibold">Hello User</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">To access your ApanaStore account</p>
            </div>
             <div
             onClick={() => navigate('/signIn')}
              className="bg-purple-800 w-full text-center p-2 px-4 rounded-sm text-white font-medium cursor-pointer"
            //   disabled={!paymentMethod}
            >
              Sign Up
            </div>
          </div>}

          <hr />

          {/* Orders */}
          <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
            {/* <svg
              className="w-6 h-6 text-gray-900 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 11h14l-1.5 9h-11L5 11z" />
            </svg> */}
            <span onClick={() => {navigate('/user/orders');scrollTo(0,0)}} className="text-lg font-semibold">My Orders</span>
          </div>

          <hr />

          {/* My Wishlist */}
          {/* <div className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
            <span onClick={() => {navigate('/wishlist');scrollTo(0,0)}} className="text-lg font-semibold">My Wishlist</span>
          </div>

          <hr /> */}

          {/* Edit Profile */}
          {user && <> <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-yellow-600 w-full text-left cursor-pointer"
          >
            ✏️ Edit Profile
          </button>
          <hr />
          </>
          }

          {/* Delete Account */}
          <button onClick={()=> navigate('/account/delete')} className="text-lg font-semibold text-red-600 cursor-pointer">
            Delete Account
          </button>

          <hr />

          {/* Logout */}
          {user && <div 
          onClick={()=> {logoutHandler();scrollTo(0,0)}}
          disabled={isLoading}
          className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            <span className="text-lg font-semibold">Logout</span>
          </div>}

        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md space-y-4 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 cursor-pointer"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <p className="text-gray-600 text-sm">Make changes to your profile. Click save when you're done.</p>
           <div className='w-full flex items-center justify-center'>
            <div className='w-20 h-20 rounded-full relative bg-gray-600 overflow-hidden cursor-pointer'>
      <input
        type="file"
        accept="image/*"
        className='hidden'
        id="profile-upload"
        onChange={handleImageChange}
      />
      <label htmlFor="profile-upload" className='block w-full h-full'>
        <img
          src={previewImage ? previewImage : profileImage}
          alt="Profile"
          className='w-full h-full object-cover absolute top-0 left-0 cursor-pointer'
        />
      </label>
    </div>
           </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input
                  type="text"
                  defaultValue={`@${user?.username}`}
                  // value={username}
                  onChange={(e)=> setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Mobile Number</label>
                <input
                  type="tel"
                  defaultValue={user?.phone}
                  maxLength={10}
                  // value={phone}
                  onChange={(e)=> setPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="text"
                  defaultValue={user?.email}
                  // value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
                 <p onClick={() => setShowEditModalPass(true)} className="text-purple-400 hover:underline cursor-pointer mt-3">Forgat Password?</p>
              </div>
              {error && <p>Error: {error.data?.message || "save changes error"}</p>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button onClick={handleSaveChanges} disabled={isLoading} className="px-4 py-2 bg-yellow-600 text-white rounded-md cursor-pointer">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
       {showEditModalPass && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md space-y-4 relative">
            <button
              onClick={() => setShowEditModalPass(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 cursor-pointer"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold">Edit Password</h2>
            <p className="text-gray-600 text-sm">Make changes to your Password. Click save when you're done.</p>
           <div className='w-full flex items-center justify-center'>
           </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">OldPassword</label>
                <input
                  type="tel"
                  maxLength={50}
                  value={oldPassword}
                  placeholder="Enter oldPassword"
                  onChange={(e)=> setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">NewPassword</label>
                <input
                  type="text"
                  value={newPassword}
                  placeholder="Enter NewPassword"
                  onChange={(e)=> setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              {error && <p>Error: {error.data?.message || "save changes error"}</p>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowEditModalPass(false)}
                  className="px-4 py-2 border rounded-md text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button onClick={handleSaveChangesPass} disabled={isLoading} className="px-4 py-2 bg-yellow-600 text-white rounded-md cursor-pointer">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
