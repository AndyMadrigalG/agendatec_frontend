import styles from './home.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';

import calendarImage from '/public/calendar.png'
import gestionLogo from '/public/gestionLogo.png'
import actasLogo from '/public/actas.png'

export default function HomePage() {
    return (
        <div className={styles.principalContainer}>
            <Image className={styles.logo} src={logo} alt="logo"/>
            <div className={styles.container}>
            <h1 className={styles.title}>Inicio</h1>
                <div className={styles.menu}>
                        <div className={styles.card}>
                            <Image src={calendarImage} alt="Agendas Logo"/>
                            <span>Agendas</span>
                        </div>
                        <div className={styles.card}>
                            <Image src={gestionLogo} alt="Gestion Logo"/>
                            <span>Gestión</span>
                        </div>
                        <div className={styles.card}>
                            <Image src={actasLogo} alt="Gestion Logo"/>
                            <span>Actas</span>
                        </div>
                </div>
            </div>
        </div>
    );
}
