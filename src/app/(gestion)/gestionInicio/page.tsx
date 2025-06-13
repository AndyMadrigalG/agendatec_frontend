'use client';
import styles from './gestionInicio.module.css';
import React, { useState } from "react";
import Image from 'next/image';
import agregarMiembro from '/public/agregarMiembro.svg';
import ModalAgregarUsuario from '../agregarUsuario/page';
import { useRouter } from 'next/navigation';

interface Usuario {
  Id_Usuario: number;
  cedula: string;
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
    cedula: '123456789',
    nombre: 'Juan',
    apellidos: 'Pérez García',
    email: 'juan.perez@example.com',
    telefono: 5551234567
  },
  {
    Id_Usuario: 2,
    nombre: 'María',
    apellidos: 'López Martínez',
    cedula: '987654321',
    email: 'maria.lopez@example.com',
    telefono: 5557654321
  },
  {
    Id_Usuario: 3,
    nombre: 'Carlos',
    apellidos: 'González Fernández',
    cedula: '456789123',
    email: 'carlos.gonzalez@example.com',
    telefono: 5554567890
  },
  {
    Id_Usuario: 4,
    nombre: 'Ana',
    apellidos: 'Rodríguez Sánchez',
    cedula: '321654987',
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
  const [usuariosState, setUsuariosState] = useState<Usuario[]>(usuarios);
  
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
        
        <button 
          className={styles.addButton} 
          onClick={() => setModalAbierto(true)} 
        >
          <Image src={agregarMiembro} alt="Agregar usuario" width={20} height={20} />
          <span>Agregar usuario</span>
        </button>
      </div>

      <ModalAgregarUsuario
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSuccess={() => {
          handleAgregarUsuario;
          setModalAbierto(false);
        }}
      />

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
                  onClick={() => router.push(`/usuarios/${user.Id_Usuario}`)}
                >
                  Ver detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}