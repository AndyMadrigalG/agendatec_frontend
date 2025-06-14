'use client';
import React, { useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import styles from './editarUsuario.module.css';

interface Usuario {
  Id_Usuario: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: number;
}

interface MiembroDeJunta {
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

export default function ModalEditarUsuario({ 
  isOpen, 
  onClose, 
  usuario: initialUsuario, 
  miembroJunta: initialMiembroJunta,
  onSave
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
    setUsuario(prev => ({ ...prev, [name]: value }));
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
        fecha_fin: null
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
        fecha_fin: null
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario.nombre || !usuario.apellidos || !usuario.email) {
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

    onSave(usuario, esMiembroJunta ? miembroJunta : null);
    onClose();
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
            <label>Apellidos*</label>
            <input
              name="apellidos"
              value={usuario.apellidos}
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
                  {miembroJunta?.fecha_inicio ? new Date(miembroJunta.fecha_inicio).toLocaleDateString() : 'N/A'}
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