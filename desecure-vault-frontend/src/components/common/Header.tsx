import React from 'react'
import ConnectButton from '../auth/ConnectButton'

const Header = () => {
  return (
    <div className='flex justify-between items-center mb-8 pb-4 border-b border-border-color'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        
        <div className='flex items-center gap-4'>
          <div className="flex items-center bg-card border-border rounded-lg py-2 px-4 w-[300px]">
            <i className="fas fa-search text-muted"></i>
            <input 
              type="text" 
              placeholder="Search vault items..."
              className='bg-transparent border-none text-light outline-none w-full ml-2'
              ></input>
          </div>
          
          <ConnectButton/>
        </div>
      </div>
  )
}

export default Header
