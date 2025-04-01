import type { NextConfig } from 'next';

const config: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'domain.localhost',
          },
        ],
        destination: 'http://localhost/:path*',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'http://admin.localhost:3000' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' }
        ]
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['app.localhost:3000', 'auth.localhost:3000']
    }
  }
}

export default config;