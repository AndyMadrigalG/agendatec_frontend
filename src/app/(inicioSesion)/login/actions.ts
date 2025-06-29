"use server";

import { BACKEND_URL } from "@/Constants/constants";
import { createSession } from "@/Constants/lib";

export async function handleLogin(prevState: any, formData: FormData) {
    try {
        const usuario_email = formData.get('email');
        const usuario_password = formData.get('password');
        const login_body = JSON.stringify({
            "usuario": usuario_email,
            "contrasena": usuario_password
        });

        const response = await fetch(BACKEND_URL + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: login_body,
        });
        const data = await response.json();

        if (response.status === 201 && data.message !== 'Correo electrónico o contraseña inválidos') {
            if (data.idToken?.length > 0 && data.refreshToken?.length > 0) {
                // Guardar los tokens en cookies http only
                await createSession({
                    idToken: data.idToken,
                    refreshToken: data.refreshToken,
                    user_email: data.email,
                    user_name: data.username
                });
                console.log('Login exitoso');
                return { success: true, redirectUrl: '/Home' };
            }
        } else {
            return {
                success: false,
                message: data.message || 'Error al iniciar sesión',
            }
        }
    } catch (error) {
        console.log('Error de red:', error);
        return { success: false, error };
    }
}

export async function handleLogout() {}