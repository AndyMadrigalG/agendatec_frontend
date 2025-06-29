"use server";

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server';

const secretKey = 'secret';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2m') // 2 minutes
        .sign(encodedKey);
}

export async function decrypt(session: string ){
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log("Fallo al verificar el JWT:", error);
    }
}

export async function createSession(response: any) {
    const { idToken, refreshToken, user_email, user_name } = response;
    //console.log('Response in create session: ', response_data);

    // Crea un objeto de sesión con el usuario y la fecha de expiración
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutos desde ahora

    const userEmailCookie = await encrypt({ user_email, expiresAt });
    const userNameCookie = await encrypt({ user_name, expiresAt });
    const idTokenCookie = await encrypt({ idToken, expiresAt });
    const refreshTokenCookie = await encrypt({ refreshToken, expiresAt });

    // Obtén las cookies y establece la nueva cookie
    const cookieStore = await cookies();
    cookieStore.set('session_userName', userNameCookie, {
        httpOnly: true,
        expires: expiresAt,
    });
    cookieStore.set('session_userEmail', userEmailCookie, {
        httpOnly: true,
        expires: expiresAt,
    });
    cookieStore.set('session_idToken', idTokenCookie, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    });
    cookieStore.set('session_refreshToken', refreshTokenCookie, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
    });
}

export async function logout() {
    // Obtén las cookies y elimina la cookie de sesión
    const cookieStore = await cookies();
    cookieStore.set('session_userName', '', { expires: new Date(0) });
    cookieStore.set('session_userEmail', '', { expires: new Date(0) });
    cookieStore.set('session_idToken', '', { expires: new Date(0) });
    cookieStore.set('session_refreshToken', '', { expires: new Date(0) });
}

export async function getSession() {
    // Obtén las cookies y accede al valor de la cookie de sesión
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_idToken')?.value;
    if (!sessionCookie) {
        return null;
    }
    return await decrypt(sessionCookie);
}

export async function updateSession(request: NextRequest) {
    // Obtén las cookies y accede al valor de la cookie de sesión
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session_usuario')?.value;
    if (!sessionCookie) {
        return null;
    }

    // Refresca la sesión para que no expire
    const sessionData = await decrypt(sessionCookie);
    if (!sessionData) {
        return null; // Si no se pudo descifrar, no hay sesión válida
    } else{
        sessionData.expires = new Date(Date.now() + 120 * 1000); // 120 segundos desde ahora
    }

    const res = NextResponse.next();
    res.cookies.set({
        name: 'session_usuario',
        value: await encrypt(sessionData),
        httpOnly: true,
        expires: sessionData.expires as Date, // Asegúrate de que sea de tipo Date
    });
    return res;
}