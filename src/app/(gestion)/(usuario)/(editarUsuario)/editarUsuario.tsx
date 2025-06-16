'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import styles from './editarUsuario.module.css';

interface Usuario {
  Id_Usuario: number;
  nombre: string;
  email: string;
  telefono: number;
}

interface MiembroDeJunta {
  id_Miembro_De_Junta?: number; // Opcional para crear nuevo miembro
  Usuario_id: number;
  cargo: string;
  fecha_inicio: string;
  fecha_fin: string | null;
}

interface ModalEditarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario;
  miembroJunta: MiembroDeJunta | null;
  onSave: (usuario: Usuario, miembroJunta: MiembroDeJunta | null) => void;
}

const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function ModalEditarUsuario({
  isOpen,
  onClose,
  usuario: initialUsuario,
  miembroJunta: initialMiembroJunta,
  onSave,
}: ModalEditarUsuarioProps) {
  const [usuario, setUsuario] = useState<Usuario>(initialUsuario);
  const [miembroJunta, setMiembroJunta] = useState<MiembroDeJunta | null>(initialMiembroJunta);
  const [esMiembroJunta, setEsMiembroJunta] = useState(!!initialMiembroJunta);

  useEffect(() => {
    setUsuario(initialUsuario);
    setMiembroJunta(initialMiembroJunta);
    setEsMiembroJunta(!!initialMiembroJunta);
  }, [initialUsuario, initialMiembroJunta]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleMiembroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (miembroJunta) {
      setMiembroJunta({ ...miembroJunta, [name]: value });
    } else {
      setMiembroJunta({
        Usuario_id: usuario.Id_Usuario,
        cargo: value,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: null,
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setEsMiembroJunta(checked);

    if (!checked) {
      setMiembroJunta(null);
    } else if (!miembroJunta) {
      setMiembroJunta({
        Usuario_id: usuario.Id_Usuario,
        cargo: '',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: null,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de campos requeridos
    if (!usuario.nombre || !usuario.email) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor complete todos los campos requeridos',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return;
    }

    if (esMiembroJunta && (!miembroJunta || !miembroJunta.cargo)) {
      Swal.fire({
        icon: 'error',
        title: 'Cargo requerido',
        text: 'Debe especificar el cargo para miembros de la junta',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(usuario.email)) {
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
      // Actualizar usuario
      const usuarioResponse = await fetch(`${BACKEND_URL}/usuarios/${usuario.Id_Usuario}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: usuario.telefono,
        }),
      });

      if (!usuarioResponse.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al actualizar el usuario. Intente nuevamente.',
          confirmButtonColor: '#7b6ef6',
          background: 'var(--background)',
          color: '#f9fafb',
        });
        return;
      }

      // Si es miembro de junta, manejar creación o actualización
      if (esMiembroJunta) {
        if (!initialMiembroJunta) {
          // Crear nuevo miembro de junta
          const miembroResponse = await fetch(`${BACKEND_URL}/miembro-junta`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              usuario_id: usuario.Id_Usuario,
              junta_id: 1,
              cargo: miembroJunta?.cargo,
              fecha_inicio: miembroJunta?.fecha_inicio,
            }),
          });

          if (!miembroResponse.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al crear el miembro de junta. Intente nuevamente.',
              confirmButtonColor: '#7b6ef6',
              background: 'var(--background)',
              color: '#f9fafb',
            });
            return;
          }
        } else {
          // Actualizar miembro existente
          const miembroResponse = await fetch(
            `${BACKEND_URL}/miembro-junta/${initialMiembroJunta.id_Miembro_De_Junta}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                cargo: miembroJunta?.cargo,
                fecha_inicio: miembroJunta?.fecha_inicio,
              }),
            }
          );

          if (!miembroResponse.ok) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al actualizar los datos del miembro de junta. Intente nuevamente.',
              confirmButtonColor: '#7b6ef6',
              background: 'var(--background)',
              color: '#f9fafb',
            });
            return;
          }
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado',
        text: 'Los datos del usuario se han actualizado correctamente',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });

      onSave(usuario, esMiembroJunta ? miembroJunta : null);
      onClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al actualizar los datos. Intente nuevamente.',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Editar Usuario</h2>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.campo}>
            <label>Nombre*</label>
            <input
              name="nombre"
              value={usuario.nombre}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.campo}>
            <label>Correo Electrónico*</label>
            <input
              name="email"
              type="email"
              value={usuario.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.campo}>
            <label>Teléfono</label>
            <input
              name="telefono"
              type="tel"
              value={usuario.telefono || ''}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxContainer}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={esMiembroJunta}
                onChange={handleCheckboxChange}
                className={styles.checkboxInput}
              />
              <span>¿Es miembro de la junta directiva?</span>
            </label>
          </div>

          {esMiembroJunta && (
            <>
              <div className={styles.separador}></div>
              <h3 className={styles.subtitulo}>Información de Junta Directiva</h3>

              <div className={styles.campo}>
                <label>Cargo*</label>
                <input
                  name="cargo"
                  value={miembroJunta?.cargo || ''}
                  onChange={handleMiembroChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.campo}>
                <label>Fecha de inicio</label>
                <p className={styles.valor}>
                  {miembroJunta?.fecha_inicio
                    ? new Date(miembroJunta.fecha_inicio).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </>
          )}

          <div className={styles.modalButtons}>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.cancelButton}`}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${styles.actionButton} ${styles.saveButton}`}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}