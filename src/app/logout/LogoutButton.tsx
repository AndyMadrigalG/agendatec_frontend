"use client";

import { useRouter } from "next/navigation";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userEmail");
        router.push("/login");
    };

    return (
        <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar sesión
        </button>
    );
}