import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/Constants/lib';
import { cookies } from "next/headers";

const protectedRoutes = ['/home'];
const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie= cookies().get('session_idToken')?.value;
    const session = await decrypt(cookie)

    if (isProtectedRoute && !session?.idToken) {
        // Si es una ruta protegida y no hay sesión, redirige al login
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    if (isPublicRoute && session?.idToken) {
        // Si es una ruta pública y hay sesión, redirige al home
        return NextResponse.redirect(new URL('/home', request.nextUrl));
    }

    return NextResponse.next();
}