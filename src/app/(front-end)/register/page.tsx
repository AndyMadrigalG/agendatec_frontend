import styles from './register.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';

export default function RegisterPage() {
return (
    <div className={styles.principalContainer}>
        <Image className={styles.logo} src={logo} alt="Logo"/>
        <div className={styles.container}>
            <div className={styles.left}>
                <h1>¡Bienvenido!</h1>
                <p>IIngrese los datos solicitados para crear su cuenta.</p>
                <p className={styles.register}>¿Ya tienes cuenta? <a href="/login">Inicia sesion</a></p>
            </div>

            <div className={styles.right}>
                <h2>Crear Cuenta</h2>
                <form className={styles.form}>
                    <input type="text" placeholder="Usuario" />
                    <input type="password" placeholder="Contraseña" />
                    <input type="text" placeholder="Correo Electronico" />
                    <input type="password" placeholder="Telefono" />
                    <button type="submit">Ingresar</button>
                </form>
            </div>
        </div>
    </div>
);
}