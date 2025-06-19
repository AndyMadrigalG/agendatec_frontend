'use client';
import styles from './gestionInicio.module.css';
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import agregarMiembro from '/public/agregarMiembro.svg';
import backIcon from '/public/backIcon.svg';
import ModalVerUsuario from '../(usuario)/(verUsuario)/verUsuario';
import ModalEditarUsuario from '../(usuario)/(editarUsuario)/editarUsuario';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

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

const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function GestionUsuarios() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [modalVerAbierto, setModalVerAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState<MiembroDeJunta | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [miembrosJunta, setMiembrosJunta] = useState<MiembroDeJunta[]>([]);
  const [isLoading, setIsLoading] = useState(true); 

  const fetchUsuarios = async () => {
    setIsLoading(true); // Activa el estado de carga
    try {
      const res = await fetch(BACKEND_URL + '/usuarios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const usuariosData = await res.json();
      console.log('Usuarios cargados:', usuariosData);

      const miembrosRes = await fetch(BACKEND_URL + '/junta/1/miembros', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const nuevosUsuarios = usuariosData.map((usuario: any) => ({
        Id_Usuario: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono
      }));

      const miembrosData = await miembrosRes.json();
      console.log('Miembros de junta cargados:', miembrosData);

      const nuevosMiembros = miembrosData.map((miembro: any) => ({
        id_Miembro_De_Junta: miembro.id_Miembro_De_Junta,
        Usuario_id: miembro.usuario.id_Usuario,
        cargo: miembro.cargo,
        fecha_inicio: miembro.fecha_inicio,
        fecha_fin: miembro.fecha_fin || null,
      }));

      setUsuarios(nuevosUsuarios);
      setMiembrosJunta(nuevosMiembros);
      console.log('Usuarios actualizados:', nuevosUsuarios);
      console.log('Miembros de junta actualizados:', nuevosMiembros);

    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setIsLoading(false);  // Desactiva el estado de carga
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

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

  const handleEliminarUsuario = async () => {
    if (!usuarioSeleccionado) return;

    // Aquí puedes agregar lógica para eliminar el usuario del backend si es necesario
    setModalVerAbierto(false);
    await fetchUsuarios(); // Recargar los datos después de eliminar
  };

  const handleEditarClick = () => {
    setModalVerAbierto(false);
    setModalEditarAbierto(true);
  };

  const handleSaveUsuario = async (usuarioActualizado: Usuario, miembroActualizado: MiembroDeJunta | null) => {
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
    await fetchUsuarios(); // Recargar los datos después de guardar cambios
  };

  const handleBack = () => {
    router.push('/home');
  };

  return (
    <div>
      <div className={styles.backButtonContainer}>
        <button className={styles.backButton} onClick={handleBack}>
          <Image src={backIcon} alt="Regresar" width={40} height={40} />
        </button>
      </div>

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

        {isLoading ? ( 
          <div className={styles.noMembers}>
            <p>Cargando usuarios...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={styles.noMembers}>
            <p>No se encontraron usuarios que coincidan con la búsqueda</p>
          </div>
        ) : (
          <div className={styles['cards-container']}>
            {filteredUsers.map((user) => (
              <div key={user.Id_Usuario} className={`${styles.card} ${user.esMiembroJunta ? styles.miembroJunta : styles.usuarioRegular}`}>
                <div className={styles['card-content']}>
                  <h2 className={styles.nombre}>Nombre: {user.nombre}</h2>
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
    </div>
      
  );
}
