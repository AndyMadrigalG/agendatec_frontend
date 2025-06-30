/*
    Middleware file exist to protect routes and redirect unauthenticated users to the login page
*/
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/Constants/lib';
import { cookies } from "next/headers";
import { BACKEND_URL } from "@/Constants/constants";

const protectedRoutes = ['/home'];
const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
    const cookie = (await cookies()).get('session_idToken');
    const session =  cookie ? await decrypt(cookie.value) : null;

    // send GET /auth with token in headers to validate token
    const response = await fetch(BACKEND_URL + '/auth', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${session?.idToken}` },
    });
    const data = await response.json();
    // console.log('id token authenticated : ', data);

    if (data?.valid && data?.userName) {
        // Agregar el nombre del usuario a las cookies
        const cookieStore = await cookies();
        cookieStore.set('session_userName', data.userName);
        cookieStore.set('session_userEmail', data.userEmail);
    }

    // Allow access to the login without a token or token is valid
    if (request.nextUrl.pathname.startsWith('/login') && (!session || !session.idToken || !data?.valid)) {
        return NextResponse.next();
    } else if (request.nextUrl.pathname.startsWith('/login') && data?.valid) {
        // If the user is already logged in, redirect to home
        return NextResponse.redirect(new URL('/home', request.url));
    }

    // Redirect to login if no session token is present
    if (!session || !session.idToken) {
        // If the session is invalid
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Aplica el middleware a todas las rutas excepto las excluidas
    matcher: ['/((?!_next|api).*)'], // Excluye rutas que comienzan con _next o api
};
