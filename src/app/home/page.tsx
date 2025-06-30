import Link from 'next/link';
import styles from './home.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import calendarImage from '/public/calendar.png';
import gestionLogo from '/public/gestionLogo.png';
import actasLogo from '/public/actas.png';
import LogoutButton from "../logout/LogoutButton";
import { cookies } from "next/headers";

export default async function HomePage() {
    const cookieStore = await cookies();
    const userName = await cookieStore.get('session_userName')?.value;

    return (
        <div className={styles.principalContainer}>
            <div className={styles.header}>
                <Image className={styles.logo} src={logo} alt="logo" />
                <LogoutButton />
            </div>

            <div className={styles.container}>
                <h1 className={styles.bienvenida}>
                    {userName ? `Bienvenido, ${userName}` : 'Bienvenido de vuelta!'}
                </h1>
                <div className={styles.menu}>
                    <Link href="/agendaInicio" className={styles.card}>
                        <Image src={calendarImage} alt="Agendas Logo" />
                        <span>Agendas</span>
                    </Link>
                    <Link href="/gestionInicio" className={styles.card}>
                        <Image src={gestionLogo} alt="Gestion Logo" />
                        <span>Gestión</span>
                    </Link>
                    <Link href="/actas" className={styles.card}>
                        <Image src={actasLogo} alt="Actas Logo" />
                        <span>Actas</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}