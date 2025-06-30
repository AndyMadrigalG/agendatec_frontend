"use client";

import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import Image from "next/image";
import logo from "@/../public/logo.png";
import Swal from "sweetalert2";

export function LoginForm(){
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        // Mostrar el modal de carga
        Swal.fire({
            title: 'Iniciando sesión...',
            text: 'Por favor espere',
            background: 'var(--background)',
            allowOutsideClick: false,
            showConfirmButton: false,
            color: '#f9fafb',
            willOpen: () => {
                Swal.showLoading();
            },
        });

        const formData = new FormData(event.target as HTMLFormElement);

        try {
            const response = await fetch( "/api/login", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result?.success && result?.redirectUrl) {
                Swal.close();
                console.log("Login exitoso");
                router.push(result.redirectUrl);
            } else {
                Swal.close();
                await Swal.fire({
                    icon: 'error',
                    title: 'Login inválido',
                    text: 'Por favor ingrese un correo electrónico y contraseña válidos',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#7b6ef6',
                    background: 'var(--background)',
                    color: '#f9fafb',
                });
                console.log("Error en el login:", result?.message || result?.error);
            }
        } catch (error) {
            Swal.close();
            await Swal.fire({
                icon: 'error',
                title: 'Login inválido',
                text: 'Por favor ingrese un correo electrónico y contraseña válidos',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            console.log("Error en el login:", error);
        }
    }

    return (
        <div className={styles.principalContainer}>
            <Image className={styles.logo} src={logo} alt="logo"/>
            <div className={styles.container}>

                <div className={styles.left}>
                    <h1>¡Bienvenido!</h1>
                    <p>Inicie sesión para acceder al sistema</p>
                    <p className={styles.register}>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
                </div>
                <div className={styles.right}>
                    <h2>Iniciar Sesión</h2>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <input
                            id="email"
                            name="email"
                            type="text"
                            placeholder="Email"
                            required
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            required
                        />
                        <button type="submit">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}