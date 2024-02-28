import React from 'react'

const Loader = () => {
  return (
    <div className='fixed inset-0 backdrop-blur-sm z-[9999] flex items-center justify-center text-white'>
      <div className='w-10 h-10 border-4 border-solid border-t-transparent rounded-full border-gray-600 animate-spin'>
      </div>
    </div>
  )
}

export default Loader
