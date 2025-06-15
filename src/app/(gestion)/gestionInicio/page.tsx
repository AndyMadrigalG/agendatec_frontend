'use client';
import styles from './gestionInicio.module.css';
import React, { useState } from "react";
import Image from 'next/image';
import ModalVerUsuario from '../(usuario)/(verUsuario)/verUsuario';
import ModalEditarUsuario from '../(usuario)/(editarUsuario)/editarUsuario';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';


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

// Datos de prueba
const usuarios: Usuario[] = [
  {
    Id_Usuario: 1,
    nombre: 'Juan',
    apellidos: 'Pérez García',
    email: 'juan.perez@example.com',
    telefono: 5551234567
  },
  {
    Id_Usuario: 2,
    nombre: 'María',
    apellidos: 'López Martínez',
    email: 'maria.lopez@example.com',
    telefono: 5557654321
  },
  {
    Id_Usuario: 3,
    nombre: 'Carlos',
    apellidos: 'González Fernández',
    email: 'carlos.gonzalez@example.com',
    telefono: 5554567890
  },
  {
    Id_Usuario: 4,
    nombre: 'Ana',
    apellidos: 'Rodríguez Sánchez',
    email: 'ana.rodriguez@example.com',
    telefono: 5553216549
  }
];

const miembrosJunta: MiembroDeJunta[] = [
  {
    Usuario_id: 1,
    cargo: 'Presidente',
    fecha_inicio: '2023-01-15',
    fecha_fin: null
  },
  {
    Usuario_id: 2,
    cargo: 'Secretario',
    fecha_inicio: '2023-01-15',
    fecha_fin: null
  }
];

export default function GestionUsuarios() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState<MiembroDeJunta | null>(null);

  
  const usuariosConRol = usuarios.map(usuario => {
    const miembro = miembrosJunta.find(m => m.Usuario_id === usuario.Id_Usuario && m.fecha_fin === null);
    return {
      ...usuario,
      esMiembroJunta: !!miembro,
      cargo: miembro?.cargo || null,
      fecha_inicio: miembro?.fecha_inicio || null
    };
  });

  const filteredUsers = usuariosConRol.filter(user => {
    const searchText = searchTerm.toLowerCase();
    return (
      user.nombre.toLowerCase().includes(searchText) ||
      user.apellidos.toLowerCase().includes(searchText) ||
      `${user.nombre} ${user.apellidos}`.toLowerCase().includes(searchText) ||
      (user.cargo && user.cargo.toLowerCase().includes(searchText))
    );
  });

  const formatCargo = (cargo: string | null) => {
    if (!cargo) return 'Invitado';
    return cargo.charAt(0).toUpperCase() + cargo.slice(1).toLowerCase();
  };

  const handleAgregarUsuario = (nuevoUsuario: any) => {
    console.log('Nuevo usuario:', nuevoUsuario);
    
  };

  const handleVerUsuario = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    const miembro = miembrosJunta.find(m => m.Usuario_id === usuario.Id_Usuario);
    setMiembroSeleccionado(miembro || null);
    setModalVerAbierto(true);
  };

  const handleEliminarUsuario = () => {
    if (!usuarioSeleccionado) return;
      setModalVerAbierto(false);
  };


  const handleEliminarDeJunta = () => {
    if (!usuarioSeleccionado) return;
    
    setMiembroSeleccionado(null);
  };

  const handleEditarClick = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(true);
  };

  const handleSaveUsuario = (usuarioActualizado: Usuario, miembroActualizado: MiembroDeJunta | null) => {
    // Aquí iría la lógica para actualizar los datos
    console.log('Usuario actualizado:', usuarioActualizado);
    console.log('Miembro actualizado:', miembroActualizado);
    
    Swal.fire({
      icon: 'success',
      title: 'Usuario actualizado',
      text: 'Los cambios se han guardado correctamente',
      confirmButtonColor: '#7b6ef6',
      background: 'var(--background)',
      color: '#f9fafb',
    });
    
    setModalEditarAbierto(false);
  };

  return (
    <div className={styles['miembros-container']}>
      <h1 className={styles.titulo}>Gestión de Usuarios</h1>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className={styles.noMembers}>
          <p>No se encontraron usuarios que coincidan con la búsqueda</p>
        </div>
      ) : (
        <div className={styles['cards-container']}>
          {filteredUsers.map((user) => (
            <div key={user.Id_Usuario} className={`${styles.card} ${user.esMiembroJunta ? styles.miembroJunta : styles.usuarioRegular}`}>
              <div className={styles['card-content']}>
                <h2 className={styles.nombre}>Nombre: {user.nombre} {user.apellidos}</h2>
                <p className={styles.rol}>Rol: {formatCargo(user.cargo)}</p>
              </div>
              <div className={styles['card-actions']}>
                <button 
                  className={styles['ver-btn']}
                  onClick={() => handleVerUsuario(user)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para ver usuario */}
      {usuarioSeleccionado && (
        <ModalVerUsuario
          isOpen={modalVerAbierto}
          onClose={() => setModalVerAbierto(false)}
          usuario={usuarioSeleccionado}
          miembroJunta={miembroSeleccionado}
          onEditar={handleEditarClick}
          onEliminar={handleEliminarUsuario}
          onEliminarDeJunta={handleEliminarDeJunta}
        />
      )}
      {/* Modal para editar usuario */}
      {usuarioSeleccionado && (
        <ModalEditarUsuario
          isOpen={modalEditarAbierto}
          onClose={() => setModalEditarAbierto(false)}
          usuario={usuarioSeleccionado}
          miembroJunta={miembroSeleccionado}
          onSave={handleSaveUsuario}
        />
      )}
    </div>
  );
}
