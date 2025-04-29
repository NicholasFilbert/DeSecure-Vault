'use client'
import Image from 'next/image'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '@/styles/common/sidebar.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { faHome, faSync } from '@fortawesome/free-solid-svg-icons'
import '@/utils/fontawesome'
import { faFolder, faHome, faSync } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
  const pathName = usePathname();
  return (
    <div className='w-[280px] border-r border-border pt-4 fixed h-screen bg-dark z-5'>
      <div className="flex items-center p-4 pb-3 mb-6">
        <Image 
          src="https://64.media.tumblr.com/12595bc7f34fd153f49f8dc902e988ae/c2042d7082148f98-b8/s1280x1920/72705f664df86bad56d6209144c0c7d871141c6b.jpg" 
          alt="Shadow Vault Logo"
          width={50}
          height={50}
          className='me-3 rounded'
        ></Image>
        <h1 className='text-2xl font-extrabold'>Shadow Vault</h1>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Main</div>
          <Link href="/app" className={`nav-item ${pathName === '/app' ? "active" : ""}`}>
            <FontAwesomeIcon className='sidebar-icon' icon={faHome} />
            <span>Dashboard</span>
          </Link>

          <Link href="/app/files" className={`nav-item ${pathName === '/app/files' ? "active" : ""}`}>
            <FontAwesomeIcon className='sidebar-icon' icon={faFolder} />
            <span>My Files</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar
