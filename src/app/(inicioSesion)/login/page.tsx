'use client';

import styles from './login.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import {useState} from 'react';

export default function LoginPage() {

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  };

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrasena(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Usuario:', usuario);
    console.log('Contraseña:', contrasena);
  };
  

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
                      <form className={styles.form} onSubmit={handleSubmit}>

                          <input 
                            id="email" 
                            type="text" 
                            placeholder="Usuario"
                            onChange={handleUsuarioChange} 
                            required
                          />

                          <input 
                            type="password" 
                            placeholder="Contraseña" 
                            onChange={handleContrasenaChange} 
                            required
                          />

                          <button type="submit">Ingresar</button>
                      </form>
              </div>
      </div>
    </div>
  );
}
