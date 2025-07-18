'use client';

import styles from './register.module.css';
import Image from 'next/image';
import logo from '/public/logo.png';
import {useState} from 'react';
import Swal from 'sweetalert2';
import {useRouter} from 'next/navigation';
import { BACKEND_URL } from "../../../Constants/constants";

export default function RegisterPage() {

    const router = useRouter();

    const [formulario, setFormulario] = useState({
        usuario: '',
        contrasena: '',
        correo: '',
        telefono: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const camposVacios = Object.values(formulario).some((valor) => valor.trim() === '');

        if (camposVacios) {
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'Asegúrese de que todos los campos estén llenos y tengan la información adecuada.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            return;
        }

        if (!/^\d{8,}$/.test(formulario.telefono)) {
            Swal.fire({
                icon: 'error',
                title: 'Teléfono inválido',
                text: 'Por favor ingrese un número de teléfono válido (debe tener al menos 8 dígitos)',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formulario.correo)) {
            Swal.fire({
                icon: 'error',
                title: 'Correo inválido',
                text: 'Por favor ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            return;
        }

        try {
            const response = await fetch(BACKEND_URL+'/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formulario),
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'El usuario se ha registrado correctamente.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#7b6ef6',
                    background: 'var(--background)',
                    color: '#f9fafb',
                }).then(() => {
                    router.push('/login');
                });
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el registro',
                    text: errorData.message || 'Ocurrió un error al registrar el usuario.',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#7b6ef6',
                    background: 'var(--background)',
                    color: '#f9fafb',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de red',
                text: 'No se pudo conectar con el servidor.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
        }
    };

return (
    <div className={styles.principalContainer}>
        <Image className={styles.logo} src={logo} alt="Logo"/>
        <div className={styles.container}>
            <div className={styles.left}>
                <h1>¡Bienvenido!</h1>
                <p>Ingrese los datos solicitados para crear su cuenta.</p>
                <p className={styles.register}>¿Ya tienes cuenta? <a href="/login">Inicia sesion</a></p>
            </div>

            <div className={styles.right}>
                <h2>Crear Cuenta</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <input  name="usuario" value={formulario.usuario} type="text" placeholder="Nombre Completo" onChange={handleChange} />
                    <input  name="correo" value={formulario.correo} type="text" placeholder="Correo Electronico" onChange={handleChange}/>
                    <input  name="telefono" value={formulario.telefono} type="number" placeholder="Telefono" onChange={handleChange}/>
                    <input  name="contrasena" value={formulario.contrasena} type="password" placeholder="Contraseña" onChange={handleChange}/>
                    <button type="submit">Registrar</button>
                </form>
            </div>
        </div>
    </div>
);
}