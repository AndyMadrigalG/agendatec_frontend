'use client';

import styles from './login.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import {useState} from 'react';

// Change variable on .env for local testing with the backend
// otherwise is going to use the prod URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function LoginPage() {

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  };

  const handleContrasenaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrasena(e.target.value);
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch(BACKEND_URL+'/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario,
                    contrasena,
                }),
            });

            if (response.status === 400) {
                console.error('Error en el login:', response.statusText);
            } else {
                const data = await response.json();
                if (data.idToken?.length > 0 && data.refreshToken?.length > 0) {
                    localStorage.setItem('idToken', data.idToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                }
                console.log('Login exitoso');
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
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
