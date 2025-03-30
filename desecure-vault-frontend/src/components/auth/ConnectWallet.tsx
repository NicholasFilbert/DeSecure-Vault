'use client'

import React, { useEffect, useRef, useState } from 'react'

const ConnectWallet = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false)
      }
    }

    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const connectWallet = async(type: string) => {
    console.log(type)
  }


  return (
    <div>
      <button
        className="bg-primary hover:bg-primary-dark text-light transition px-4 py-2 rounded cursor-pointer"
        onClick={() => setIsPopupOpen(true)}
      >
        Connect Wallet
      </button>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div ref={modalRef} className="bg-card text-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl cursor-pointer"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-sm text-gray-300 mb-6">
              Choose your preferred wallet to connect to ShadowVault.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg cursor-pointer"
                onClick={() => connectWallet('metamask')}
              >
                MetaMask
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg cursor-pointer">
                WalletConnect
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg cursor-pointer">
                Coinbase Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConnectWallet
