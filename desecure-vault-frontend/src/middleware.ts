import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const subdomain = host.split('.')[0]

  const isStatic = pathname.startsWith('/_next') ||
                   pathname.startsWith('/favicon.ico') ||
                   pathname.startsWith('/api')

  if (isStatic) {
    return NextResponse.next()
  }

  if (subdomain === 'admin') {
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url))
  }

  return NextResponse.next()
}
