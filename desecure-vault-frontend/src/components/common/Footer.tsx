import React from 'react'
import '@/styles/app/dashboard.css'

const Footer = () => {
  return (
    <footer className="footer py-4 px-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-2 md:mb-0">&copy; 2025 Shadow Vault. All rights reserved.</div>
        <div className="footer-links flex gap-4">
          <a href="#" className="footer-link text-blue-600 hover:text-blue-800">Privacy Policy</a>
          <a href="#" className="footer-link text-blue-600 hover:text-blue-800">Terms of Service</a>
          <a href="#" className="footer-link text-blue-600 hover:text-blue-800">Help</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;