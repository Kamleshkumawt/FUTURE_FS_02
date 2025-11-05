import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 pt-10 pb-3 px-5 sm:px-20 w-full">
  <div className="max-w-8xl flex flex-col sm:flex-row justify-center text-gray-800 dark:text-gray-200 gap-3 text-sm">
    
    {/* Column 1: Main Info */}
    <div className=' max-w-lg p-2'>
      <h1 className="text-2xl font-semibold mb-5 font-poppins">Shop Non-Stop on ApanaStore</h1>
      <p className='text-lg text-gray-600 dark:text-gray-400'>Trusted by crores of Indians</p>
      <p className='text-lg text-gray-600 dark:text-gray-400 mt-2'>Cash on Delivery | Free Delivery</p>
      <div className='flex gap-2 mt-5'>
      <div className=' w-35 lg:w-50 h-full'>
      <img src="https://images.meesho.com/images/pow/playstore-icon-big_400.webp" className='object-cover w-full h-full' alt="image" />
      </div>
      <div className=' w-35 lg:w-50 h-full'>
      <img src="https://images.meesho.com/images/pow/appstore-icon-big_400.webp" className='object-cover w-full h-full' alt="image" />
      </div>
      </div>
    </div>

    <div className='w-full  grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 '>
        {/* Column 2: Explore */}
    <div className='text-xl gap-4 flex flex-col '>
      <p className="hover:text-blue-500 cursor-pointer">Careers</p>
      <Link to="/sellerSignUp" className="hover:text-blue-500 cursor-pointer">Become a Supplier</Link>
      <p className="hover:text-blue-500 cursor-pointer">Hall of Fame</p>
      <p className="hover:text-blue-500 cursor-pointer">Sitemap</p>
    </div>

    {/* Column 3: Company */}
    <div className='flex flex-col gap-3 text-xl'>
      <p className="hover:text-blue-500 cursor-pointer">Legal and Policies</p>
      <p className="hover:text-blue-500 cursor-pointer">ApanaStore Tech Blog</p>
      <p className="hover:text-blue-500 cursor-pointer">Notices and Returns</p>
    </div>

    {/* Column 4: Social / Contact */}
    <div>
      <h2 className="font-medium text-xl mb-2">Reach Out To Us</h2>
      {/* Replace with actual icons */}
      {/* <div className="flex gap-3">
        <span className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center">F</span>
        <span className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center">T</span>
        <span className="bg-gray-300 w-6 h-6 rounded-full flex items-center justify-center">I</span>
      </div> */}
       <div className="flex gap-3 justify-start mt-4">
          <a href="https://github.com/Kamleshkumawt" target="_blank" rel="noopener noreferrer" >
            <div className="flex flex-col items-center">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="h-6 w-6 dark:bg-gray-200 rounded-full" />
              {/* <span className="text-xs text-gray-200 mt-1">GitHub</span> */}
            </div>
          </a>
          <a href="https://www.linkedin.com/in/kamlesh-kumawat-598988330/" target="_blank" rel="noopener noreferrer" >
            <div className="flex flex-col items-center">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" alt="LinkedIn" className="h-6 w-6 " />
              {/* <span className="text-xs text-gray-200 mt-1">LinkedIn</span> */}
            </div>
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" >
            <div className="flex flex-col items-center">
              <img src="https://cdn.simpleicons.org/youtube" alt="Twitter" className="h-6 w-6" />
              {/* <span className="text-xs text-gray-200 mt-1">Twitter</span> */}
            </div>
          </a>
          <a href="mailto:kamleshkumwt12th@gmail.com" >
            <div className="flex flex-col items-center">
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Email" className="h-6 w-6 " />
              {/* <span className="text-xs text-gray-200 mt-1">Email</span> */}
            </div>
          </a>
          <a href="https://www.instagram.com/kamleshkumawat68" target="_blank" rel="noopener noreferrer" 
        //   className="group hover:scale-125 transition-transform duration-200"
          >
            <div className="flex flex-col items-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-6 w-6 " />
              {/* <span className="text-xs text-gray-200 mt-1">Instagram</span> */}
            </div>
          </a>
        </div>


    </div>

    {/* Column 5: Address */}
    <div>
      <h2 className="font-medium text-xl mb-2">Contact Us</h2>
      <p className='text-[12px]'>
        ApanaStore Technologies Private Limited <br />
        CIN: U62099KA2024PTC186568 <br />
        3rd Floor, Wing-E, Hellos Business Park, <br />
        Kadubeesanahali Village, Varthur Hobli, <br />
        Outer Ring Road, Bellandur, Bangalore <br />
        Email: <a href="mailto:example@gmail.com" className="text-blue-600">example@gmail.com</a>
      </p>
    </div>

    </div>
  </div>
  <span className="block w-full border-b border-gray-300 dark:border-gray-600 mt-3"></span>
  <span className='w-full flex items-center justify-center dark:text-gray-400 text-[12px] mt-2'> © 1996-2025, ApanaStore.com, Inc. or its affiliates</span>
</div>
  )
}

export default Footer