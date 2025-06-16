'use client';
import React from 'react';
import Swal from 'sweetalert2';
import styles from './verUsuario.module.css';
import { useRouter, useParams } from 'next/navigation';

interface Usuario {
  Id_Usuario: number;
  nombre: string;
  email: string;
  telefono: number;
}

interface MiembroDeJunta {
  Usuario_id: number;
  cargo: string;
  fecha_inicio: string;
  fecha_fin: string | null;
}



interface ModalVerUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
  miembroJunta: MiembroDeJunta | null;
  onEditar: () => void;
  onEliminar: () => void;
  onEliminarDeJunta?: () => void;
  onAgregarAJunta?: () => void;
}

export default function ModalVerUsuario({ 
  isOpen, 
  onClose, 
  usuario, 
  miembroJunta,
  onEditar, 
  onEliminar,
  onEliminarDeJunta,
  onAgregarAJunta
}: ModalVerUsuarioProps) {

  const handleEliminar = () => {
    if (!usuario) return;
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar al usuario ${usuario.nombre}?`,
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
        onEliminar();
        onClose();
      }
    });
  };

  const handleEliminarDeJunta = () => {
    if (!usuario || !miembroJunta) return;
    
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas remover a ${usuario.nombre} de la junta directiva?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#7b6ef6',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      background: 'var(--background)',
      color: '#f9fafb',
    }).then((result) => {
      if (result.isConfirmed && onEliminarDeJunta) {
        onEliminarDeJunta();
      }
    });
  };

  const handleAgregarAJunta = () => {
    if (!usuario || miembroJunta) return;
    
    if (onAgregarAJunta) {
      onAgregarAJunta();
    }
  };

  if (!isOpen || !usuario) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>
          Información del Usuario
        </h2>

        <div className={styles.infoContainer}>
          <div className={styles.campo}>
            <label>Nombre completo:</label>
            <p className={styles.valor}>{usuario.nombre}</p>
          </div>

          <div className={styles.campo}>
            <label>Correo Electrónico:</label>
            <p className={styles.valor}>{usuario.email}</p>
          </div>

          <div className={styles.campo}>
            <label>Teléfono:</label>
            <p className={styles.valor}>{usuario.telefono}</p>
          </div>

          {miembroJunta && (
            <>
              <div className={styles.separador}></div>
              
              <h3 className={styles.subtitulo}>Información de Junta Directiva</h3>
              
              <div className={styles.campo}>
                <label>Cargo:</label>
                <p className={styles.valor}>{miembroJunta.cargo}</p>
              </div>

              <div className={styles.campo}>
                <label>Fecha de inicio:</label>
                <p className={styles.valor}>{new Date(miembroJunta.fecha_inicio).toLocaleDateString()}</p>
              </div>

              <div className={styles.campo}>
                <label>Fecha de fin:</label>
                <p className={styles.valor}>
                  {miembroJunta.fecha_fin ? new Date(miembroJunta.fecha_fin).toLocaleDateString() : 'Actualmente en el cargo'}
                </p>
              </div>
            </>
          )}

          <div className={styles.modalButtons}>
            <div className={styles.leftButtons}>
              {miembroJunta && onEliminarDeJunta && (
                <button 
                  type="button" 
                  className={`${styles.actionButton} ${styles.removeButton}`}
                  onClick={handleEliminarDeJunta}
                >
                  Remover de Junta
                </button>
              )}
              
              {!miembroJunta && onAgregarAJunta && (
                <button 
                  type="button" 
                  className={`${styles.actionButton} ${styles.addButton}`}
                  onClick={handleAgregarAJunta}
                >
                  Agregar a Junta
                </button>
              )}
            </div>
            
            <div className={styles.rightButtons}>
              <button 
                type="button" 
                className={`${styles.actionButton} ${styles.editButton}`}
                onClick={() => {
                  onEditar();
                  onClose();
                }}
              >
                Editar
              </button>
              <button 
                type="button" 
                className={`${styles.actionButton} ${styles.deleteButton}`}
                onClick={handleEliminar}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
