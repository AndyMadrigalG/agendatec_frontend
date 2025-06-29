/*
    Middleware file exist to protect routes and redirect unauthenticated users to the login page
*/
import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/Constants/lib';
import { cookies } from "next/headers";
import {BACKEND_URL} from "@/Constants/constants";

const protectedRoutes = ['/home'];
const publicRoutes = ['/login'];

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function middleware(request: NextRequest) {
    const cookie = (await cookies()).get('session_idToken');
    const session =  cookie ? await decrypt(cookie.value) : null;
    console.log('decripted cookie in middleware: ', session);

    // send axios get /auth with token in headers
    const response = await fetch(BACKEND_URL + '/auth', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${session?.idToken}` },
    });
    const data = await response.json();
    console.log('response dataa: ', data);

    // Allow access to the login without a token
    if ( request.nextUrl.pathname.startsWith('/login') ) {
        return NextResponse.next();
    }

    // Redirect to login if no session token is present
    if (!session || !session.idToken) {
        // If the session is invalid
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Aplica el middleware a todas las rutas excepto las excluidas como api o login
    matcher: ['/((?!_next|api).*)'], // Excluye rutas que comienzan con _next, api, o login
};
