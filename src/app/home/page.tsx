import styles from './home.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import calendarImage from '/public/calendar.png'
import gestionLogo from '/public/gestionLogo.png'
import actasLogo from '/public/actas.png'

const BACKEND_URL = 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function HomePage() {

    // const idToken; //= typeof window !== 'undefined' ? localStorage.getItem('idToken') : null;
    // const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    //
    // if (!idToken && !refreshToken) {
    //     return { valid: false, message: 'Tokens no encontrados' };
    // }
    //
    // try {
    //     const response = fetch(BACKEND_URL+'/auth', {
    //         method: 'GET',
    //         headers: {
    //             "Authorization": 'Bearer' + 'idToken',
    //             "x-refresh-token": '' + refreshToken
    //         }
    //     });
    //     if (response != null) {
    //         window.location.href = '/login';
    //     }
    // } catch (error) {
    //     console.error('Error validando tokens:', error);
    //     return { valid: false, message: 'Error validando tokens' };
    // }
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
