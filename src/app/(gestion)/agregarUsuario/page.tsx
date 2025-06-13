'use client';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './agregarUsuario.module.css';

interface ModalAgregarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (nuevoUsuario: any) => void;
}

export default function ModalAgregarUsuario({ isOpen, onClose, onSuccess }: ModalAgregarUsuarioProps) {
  const [esMiembroJunta, setEsMiembroJunta] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    puesto: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEsMiembroJunta(e.target.checked);
    if (!e.target.checked) {
      setFormulario({ ...formulario, puesto: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!formulario.nombre.trim() || !formulario.telefono.trim() || !formulario.correo.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Por favor complete todos los campos obligatorios',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return;
    }

    // Validar si es miembro de junta y no tiene puesto
    if (esMiembroJunta && !formulario.puesto.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Puesto requerido',
        text: 'Debe especificar el puesto para miembros de la junta directiva',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return;
    }

    // Validación de teléfono
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

    // Validación de email
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

    // Preparar datos del usuario
    const usuarioData = {
      ...formulario,
      esMiembroJunta,
      puesto: esMiembroJunta ? formulario.puesto : null
    };

    Swal.fire({
      icon: 'success',
      title: 'Usuario agregado',
      text: esMiembroJunta 
        ? 'El nuevo miembro de la junta directiva se ha agregado con éxito.' 
        : 'El nuevo usuario se ha agregado con éxito.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7b6ef6',
      background: 'var(--background)',
      color: '#f9fafb',
    }).then(() => {
      onSuccess(usuarioData);
      onClose();
      // Resetear formulario
      setEsMiembroJunta(false);
      setFormulario({
        nombre: '',
        telefono: '',
        correo: '',
        puesto: '',
      });
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>Agregar Usuario</h2>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <div className={styles.campo}>
            <label>Nombre*:</label>
            <input
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder="Nombre completo"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.campo}>
            <label>Teléfono*:</label>
            <input
              name="telefono"
              value={formulario.telefono}
              onChange={handleChange}
              placeholder="Número de teléfono"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.campo}>
            <label>Correo Electrónico*:</label>
            <input
              name="correo"
              value={formulario.correo}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className={styles.input}
              type="email"
              required
            />
          </div>

          {esMiembroJunta && (
            <div className={styles.campo}>
              <label>Puesto en la junta*:</label>
              <input
                name="puesto"
                value={formulario.puesto}
                onChange={handleChange}
                placeholder="Ej: Presidente, Secretario, etc."
                className={styles.input}
                required
              />
            </div>
          )}

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

          <div className={styles.modalButtons}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              Agregar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}