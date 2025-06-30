"use server";

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;
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
    const { idToken, refreshToken } = response;
    //console.log('Response in create session: ', response);

    // Crea un objeto de sesión con el usuario y la fecha de expiración
    const expiresAt = new Date(Date.now() + 120 * 60 * 1000); // 120 minutos desde ahora

    const idTokenCookie = await encrypt({ idToken, expiresAt });
    const refreshTokenCookie = await encrypt({ refreshToken, expiresAt });

    // Obtén las cookies y establece la nueva cookie
    const cookieStore = await cookies();
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

export async function deleteSession() {
    // Obtén las cookies y elimina las cookies de sesión
    const cookieStore = await cookies();
    cookieStore.delete('session_userName');
    cookieStore.delete('session_userEmail');
    cookieStore.delete('session_idToken');
    cookieStore.delete('session_refreshToken');
}
