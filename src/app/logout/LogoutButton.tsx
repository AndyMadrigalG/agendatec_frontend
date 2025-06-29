"use client";

import styles from "./LogoutButton.module.css";
import { handleLogout } from "@/app/(inicioSesion)/login/actions";

export default function LogoutButton() {

    return (
        <button className={styles.logoutButton} onClick={() => handleLogout()}>
            Cerrar sesión
        </button>
    );
}