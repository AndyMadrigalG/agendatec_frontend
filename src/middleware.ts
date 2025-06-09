/*
    Middleware file exist to protect routes and redirect unauthenticated users to the login page
    UNCOMMENT THIS CODE WHEN AUTHENTICATION IS IMPLEMENTED
*/

// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
//
// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token');
//
//   // Allow access to the register page or login without a token
//   if (request.nextUrl.pathname.startsWith('/register') || request.nextUrl.pathname.startsWith('/login')) {
//     return NextResponse.next();
//   }
//
//   // Redirect to login if no token is present
//   if (!token) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
//
//   return NextResponse.next();
// }
//
// export const config = {
//   // Aplica el middleware a todas las rutas excepto las excluidas como api, _next, static, register y login
//   matcher: ['/', '/((?!api|_next|static|register|login).*)'],
// };
