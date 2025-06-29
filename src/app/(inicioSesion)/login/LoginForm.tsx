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
    const handleNavigation = (path: string) => {
        router.push(path);
    };

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
                    <form className={styles.form} action={loginAction}>
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
                        <SubmitButton />
                    </form>
                </div>
            </div>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit">
            { pending ? "Cargando..." : "Ingresar" }
        </button>
    );
}