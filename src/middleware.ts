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
    const id_cookie = (await cookies()).get('session_idToken');
    const refresh_cookie = (await cookies()).get('session_refreshToken');
    const decrypt_idCookie =  id_cookie ? await decrypt(id_cookie.value) : null;
    const decrypt_refreshCookie = refresh_cookie ? await decrypt(refresh_cookie.value) : null;
    // console.log ('decrypt_idCookie: ', decrypt_idCookie);
    // console.log ('decrypt_refreshCookie: ', decrypt_refreshCookie);

    // send GET /auth with token in headers to validate token
    const response = await fetch(BACKEND_URL + '/auth', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${decrypt_idCookie?.idToken}`,
            'refresh-token': ''+decrypt_refreshCookie?.refreshToken,
        },
    });
    const response_data = await response.json();
    // console.log('id token authenticated : ', data);

    if (response_data?.valid && response_data?.userName) {
        // Agregar el nombre del usuario a las cookies
        const cookieStore = await cookies();
        cookieStore.set('session_userName', response_data.userName);
        cookieStore.set('session_userEmail', response_data.userEmail);
    }

    // Allow access to the login without a token or token is valid
    if (request.nextUrl.pathname.startsWith('/login') && (!decrypt_idCookie || !decrypt_idCookie.idToken || !response_data?.valid)) {
        return NextResponse.next();
    } else if (request.nextUrl.pathname.startsWith('/login') && response_data?.valid) {
        // If the user is already logged in, redirect to home
        return NextResponse.redirect(new URL('/home', request.url));
    }

    // Redirect to login if no session token is present
    if (!decrypt_idCookie || !decrypt_idCookie.idToken) {
        // If the session is invalid
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Aplica el middleware a todas las rutas excepto las excluidas
    matcher: ['/((?!_next|register|api).*)'], // Excluye rutas que comienzan con _next o api
};
