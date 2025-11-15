import React from 'react'

const DeleteAccount = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen bg-gray-50 dark:bg-neutral-950 text-gray-900 dark:text-gray-100 '>
      <div className='flex flex-col items-start gap-3 mt-30'>
        <h1 className='text-red-500 text-lg font-medium'>Delete Account</h1>
      <p className='dark:text-gray-200 text-gray-500 text-base'>You will not be able to access your personal data including your old orders, saved addresses, payment methods etc.</p>
      </div>
    </div>
  )
}

export default DeleteAccount