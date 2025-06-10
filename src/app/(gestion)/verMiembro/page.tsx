'use client';
import React from 'react';
import Swal from 'sweetalert2';
import styles from './verMiembro.module.css';
import { useRouter } from 'next/navigation';

export default function VerMiembro() {
  const router = useRouter();

  // Datos de ejemplo para probar
  const [miembro, setMiembro] = React.useState({
    id: 1,
    nombre: 'Juan Pérez',
    telefono: '123456789',
    correo: 'juan.perez@example.com',
    puesto: 'Presidente',
  });

  const handleEditar = () => {
    //router.push(`/editarMiembro/${miembro.id}`);
  };

  const handleEliminar = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar a ${miembro.nombre} de la junta directiva?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#7b6ef6',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: 'var(--background)',
      color: '#f9fafb',
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire({
          title: 'Miembro eliminado con éxito',
          text: `Se ha eliminado a ${miembro.nombre} de la junta directiva.`,
          icon: 'success',
          confirmButtonColor: '#7b6ef6',
          background: 'var(--background)',
          color: '#f9fafb',
        }).then(() => {
          router.push('/gestionInicio');
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Información del Miembro</h1>

      <div className={styles.infoContainer}>
        <div className={styles.campo}>
          <label>Nombre:</label>
          <p className={styles.valor}>{miembro.nombre}</p>
        </div>

        <div className={styles.campo}>
          <label>Teléfono:</label>
          <p className={styles.valor}>{miembro.telefono}</p>
        </div>

        <div className={styles.campo}>
          <label>Correo Electrónico:</label>
          <p className={styles.valor}>{miembro.correo}</p>
        </div>

        <div className={styles.campo}>
          <label>Puesto:</label>
          <p className={styles.valor}>{miembro.puesto}</p>
        </div>

        <div className={styles.botonesContainer}>
          <button 
            type="button" 
            className={`${styles.boton} ${styles.botonEditar}`}
            onClick={handleEditar}
          >
            Editar
          </button>
          <button 
            type="button" 
            className={`${styles.boton} ${styles.botonEliminar}`}
            onClick={handleEliminar}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}