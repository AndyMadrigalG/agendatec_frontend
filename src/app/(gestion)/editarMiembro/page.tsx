'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import styles from './editarMiembro.module.css';
import { useRouter, useParams } from 'next/navigation';

export default function EditarMiembro() {
  const router = useRouter();
  const { id } = useParams(); 

  const [formulario, setFormulario] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    puesto: '',
  });

  useEffect(() => {
    const cargarDatosMiembro = async () => {
      try {
        // de ejemplo
        const datosEjemplo = {
          id: 1,
          nombre: 'Juan Pérez',
          telefono: '123456789',
          correo: 'juan.perez@example.com',
          puesto: 'Presidente',
        };
        
        setFormulario({
          nombre: datosEjemplo.nombre,
          telefono: datosEjemplo.telefono,
          correo: datosEjemplo.correo,
          puesto: datosEjemplo.puesto,
        });

      } catch (error) {
        console.error('Error cargando datos del miembro:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los datos del miembro',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#4f46e5',
          background: 'var(--background)',
          color: '#7b6ef6',
        }).then(() => {
          router.push('/gestionInicio');
        });
      }
    };

    cargarDatosMiembro();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar campos vacíos
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

    // Validación de teléfono (debe tener al menos 7 dígitos)
    if (!/^\d{7,}$/.test(formulario.telefono)) {
      Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'Por favor ingrese un número de teléfono válido (debe tener al menos 7 dígitos)',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return;
    }

    // Validación de email con expresión regular
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

    
    Swal.fire({
      icon: 'success',
      title: 'Cambios guardados con éxito',
      text: 'Se ha editado con éxito la información del miembro.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7b6ef6',
      background: 'var(--background)',
      color: '#f9fafb',
    }).then(() => {
      router.push('/gestionInicio'); 
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Editar Miembro</h1>

      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.campo}>
          <label>Nombre:</label>
          <input
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            placeholder="Nombre del miembro"
            className={styles.input}
          />
        </div>

        <div className={styles.campo}>
          <label>Teléfono:</label>
          <input
            name="telefono"
            value={formulario.telefono}
            onChange={handleChange}
            placeholder="Teléfono del miembro"
            className={styles.input}
          />
        </div>

        <div className={styles.campo}>
          <label>Correo Electrónico:</label>
          <input
            name="correo"
            value={formulario.correo}
            onChange={handleChange}
            placeholder="Correo del miembro"
            className={styles.input}
            type="email"
          />
        </div>

        <div className={styles.campo}>
          <label>Puesto:</label>
          <input
            name="puesto"
            value={formulario.puesto}
            onChange={handleChange}
            placeholder="Puesto del miembro"
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.boton}>Guardar</button>
      </form>
    </div>
  );

}