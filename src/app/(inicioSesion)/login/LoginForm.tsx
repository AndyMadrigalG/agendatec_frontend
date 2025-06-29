"use client";

import { useActionState } from "react";
import { useFormStatus } from 'react-dom';
import { handleLogin } from "./actions";
import styles from "./login.module.css";
import Image from "next/image";
import logo from "@/../public/logo.png";
import {useRouter} from "next/navigation";

export function LoginForm(){
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const result = await handleLogin(null, formData);

        if (result.success && result.redirectUrl) {
            router.push(result.redirectUrl); // Redirección
        } else {
            console.log('Error en el login:', result.message || result.error);
        }
    }
    const [state, loginAction] = useActionState(handleLogin, undefined);

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
                            //onChange={handleUsuarioChange}
                            required
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            //onChange={handleContrasenaChange}
                            required
                        />
                        <button type="submit">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}