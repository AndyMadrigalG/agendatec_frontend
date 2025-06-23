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

        // Mostrar el modal de carga
        Swal.fire({
            title: 'Iniciando sesión...',
            text: 'Por favor espere',
            background: 'var(--background)',
            allowOutsideClick: false,
            showConfirmButton: false,
            color: '#f9fafb',
            willOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const response = await fetch(BACKEND_URL + '/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario,
                    contrasena,
                }),
            });
            const data = await response.json();

            if (response.status === 201 && data.message !== 'Correo electrónico o contraseña inválidos') {
                if (data.idToken?.length > 0 && data.refreshToken?.length > 0) {
                    localStorage.setItem('idToken', data.idToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    localStorage.setItem('userEmail', data.email);
                }
                console.log('Login exitoso');
                Swal.close(); 
                window.location.href = '/home'; 
            } else {
                Swal.close(); 
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
            Swal.close(); // Cierra el modal de carga
            console.error('Error de red:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Error de red',
                text: 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
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
