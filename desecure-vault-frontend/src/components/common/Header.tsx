import React from 'react'
import ConnectButton from '../auth/ConnectButton'

const Header = ({
  title
}: {
  title: string
}) => {
  return (
    <div className='flex justify-between items-center mb-8 pb-4 border-b border-border-color'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        
        <div className='flex items-center gap-4'>
          <ConnectButton/>
        </div>
      </div>
  )
}

export default Header
