"use client"

import styles from './home.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import calendarImage from '/public/calendar.png';
import gestionLogo from '/public/gestionLogo.png';
import actasLogo from '/public/actas.png';
import { useRouter } from 'next/navigation';

// Change variable on .env for local testing with the backend
// otherwise is going to use the prod URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function HomePage() {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className={styles.principalContainer}>
            <Image className={styles.logo} src={logo} alt="logo" />
            <div className={styles.container}>
                <h1 className={styles.title}>Inicio</h1>
                <div className={styles.menu}>
                    <div
                        className={styles.card}
                        onClick={() => handleNavigation('/agendaInicio')}
                    >
                        <Image src={calendarImage} alt="Agendas Logo" />
                        <span>Agendas</span>
                    </div>
                    <div
                        className={styles.card}
                        onClick={() => handleNavigation('/gestionInicio')}
                    >
                        <Image src={gestionLogo} alt="Gestion Logo" />
                        <span>Gestión</span>
                    </div>
                    <div
                        className={styles.card}
                        onClick={() => handleNavigation('/actas')}
                    >
                        <Image src={actasLogo} alt="Actas Logo" />
                        <span>Actas</span>
                    </div>
                </div>
            </div>
        </div>
    );
}