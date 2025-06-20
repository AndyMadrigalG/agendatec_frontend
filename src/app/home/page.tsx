"use client"

import styles from './home.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import calendarImage from '/public/calendar.png';
import gestionLogo from '/public/gestionLogo.png';
import actasLogo from '/public/actas.png';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '../../Constants/constants';

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