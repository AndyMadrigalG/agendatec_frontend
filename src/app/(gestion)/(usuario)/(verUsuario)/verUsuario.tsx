'use client';
import React from 'react';
import Swal from 'sweetalert2';
import styles from './verUsuario.module.css';
import { BACKEND_URL } from '../../../../Constants/constants';

interface Usuario {
  Id_Usuario: number;
  nombre: string;
  email: string;
  telefono: number;
}

interface MiembroDeJunta {
  id_Miembro_De_Junta?: number;
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
}

export default function ModalVerUsuario({
  isOpen,
  onClose,
  usuario,
  miembroJunta,
  onEditar,
  onEliminar,
}: ModalVerUsuarioProps) {
  const handleEliminar = async () => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Si el usuario es miembro de la junta, eliminar primero al miembro de la junta
          if (miembroJunta) {
            const miembroResponse = await fetch(
              `${BACKEND_URL}/miembro-junta/${miembroJunta.id_Miembro_De_Junta}`,
              {
                method: 'DELETE',
              }
            );

            if (!miembroResponse.ok) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al eliminar al miembro de la junta. Intente nuevamente.',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
              });
              return;
            }
          }

          // Eliminar al usuario
          const usuarioResponse = await fetch(`${BACKEND_URL}/usuarios/${usuario.Id_Usuario}`, {
            method: 'DELETE',
          });

          if (!usuarioResponse.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar el usuario. Intente nuevamente.',
              confirmButtonColor: '#7b6ef6',
              background: 'var(--background)',
              color: '#f9fafb',
            });
            return;
          }

          Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            text: `El usuario ${usuario.nombre} ha sido eliminado correctamente.`,
            confirmButtonColor: '#7b6ef6',
            background: 'var(--background)',
            color: '#f9fafb',
          });

          onEliminar();
          onClose();
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al eliminar los datos. Intente nuevamente.',
            confirmButtonColor: '#7b6ef6',
            background: 'var(--background)',
            color: '#f9fafb',
          });
        }
      }
    });
  };

  if (!isOpen || !usuario) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Información del Usuario</h2>

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
                <p className={styles.valor}>
                  {new Date(miembroJunta.fecha_inicio).toLocaleDateString()}
                </p>
              </div>

              <div className={styles.campo}>
                <label>Fecha de fin:</label>
                <p className={styles.valor}>
                  {miembroJunta.fecha_fin
                    ? new Date(miembroJunta.fecha_fin).toLocaleDateString()
                    : 'Actualmente en el cargo'}
                </p>
              </div>
            </>
          )}

          <div className={styles.modalButtons}>
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
  );
}
