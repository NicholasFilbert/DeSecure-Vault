'use client'

import { wagmiAdapter, projectId, networks } from '@/components/auth/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { siweConfig } from './siwe'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'Shadow Vault',
  description: 'Save your files securely',
  url: 'localhost:3000', // origin must match your domain & subdomain
  icons: ['https://i.pinimg.com/736x/df/05/42/df05424d988c00a711129e29001ad9b7.jpg']
}

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks,
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    email: false,
    socials: false,
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  siweConfig: siweConfig
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider