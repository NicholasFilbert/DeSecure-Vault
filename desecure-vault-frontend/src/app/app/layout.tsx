import Header from '@/components/common/Header'
import Sidebar from '@/components/common/Sidebar'
import React, { ReactNode } from 'react'

const AppLayout = ({ children } : { children: ReactNode }) => {
  return (
    <div className='flex min-h-[100vh]'>
      <Sidebar />
      <div className='flex-1 ml-[280px] p-8'>
        <Header />
        {children}
      </div>
    </div>
  )
}

export default AppLayout
