import React from 'react'
import ThemeToggle from '../components/user/ThemeToggle'

const Home = () => {
  return (
    <div className='text-gray-800 dark:text-gray-100 bg-white dark:bg-black w-full h-screen'>
      Home
    <ThemeToggle/>
    </div>
  )
}

export default Home