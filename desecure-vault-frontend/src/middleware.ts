import { SIWESession } from '@reown/appkit-siwe';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const sid = (await cookies()).get('shadow-vault')
  const response = await fetch("http://localhost:8000/api/auth/verify-session", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(sid && { Cookie: `${sid.name}=${sid.value}` }), // Add cookie if available
    },
    mode: "cors",
    credentials: "include",
  });

  const data = await response.json()

  if(!data.result && path !== '/'){
    return NextResponse.redirect(new URL('/', request.url))
  } else if(data.result && path === '/'){
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next();
}



export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};