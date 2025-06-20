'use client';

import styles from './login.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import React, {useState} from 'react';
import { BACKEND_URL } from "../../../Constants/constants";
import Swal from "sweetalert2";

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

            if (response.status === 201 || response.status === 200) {
                const data = await response.json();
                if (data.idToken?.length > 0 && data.refreshToken?.length > 0) {
                    localStorage.setItem('idToken', data.idToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    localStorage.setItem('userEmail', data.email);
                }
                console.log('Login exitoso');
                window.location.href = '/home';
            } else {
                console.error('Error en el login:', response.statusText);
                await Swal.fire({
                    icon: 'error',
                    title: 'Login inválido',
                    text: 'Por favor ingrese un correo electrónico y contraseña válidos',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#7b6ef6',
                    background: 'var(--background)',
                    color: '#f9fafb',
                });
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
                            placeholder="Email"
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
