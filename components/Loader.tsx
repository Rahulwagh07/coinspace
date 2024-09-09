import React from 'react'
import "@/styles/loader.css"

function Loader() {
  return (
    <div className='flex flex-col gap-4 items-center justify-center mt-52'>
      <span className="loader"></span>
    </div>
  )
}

export default Loader