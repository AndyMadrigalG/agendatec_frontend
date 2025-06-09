import styles from './login.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';

export default function LoginPage() {

  return (
    <div className={styles.principalContainer}>
      <Image className={styles.logo} src={logo} alt="logo"/>
      <div className={styles.container}>
        
          <div className={styles.left}>
              <h1>¡BBienvenido!</h1>
              <p>Inicie sesión para acceder al sistema</p>
              <p className={styles.register}>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
          </div>
          <div className={styles.right}>
                      <h2>Iniciar Sesión</h2>
                      <form className={styles.form}>
                          <input id="email" type="text" placeholder="Usuario" />
                          <input type="password" placeholder="Contraseña" />
                          <button type="submit">Ingresar</button>
                      </form>
              </div>
      </div>
    </div>
  );
}
