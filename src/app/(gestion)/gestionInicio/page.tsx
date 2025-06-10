'use client';
import styles from './gestionInicio.module.css';
import React from "react";
import Image from 'next/image';
import agregarMiembro from '/public/agregarMiembro.svg';
import { useRouter } from 'next/navigation';

// datos de prueba
const miembros = [
  {
    id: 1,
    nombre: "Juan Pérez",
    puesto: "Presidente",
  },
  {
    id: 2,
    nombre: "Ana Rodríguez",
    puesto: "Secretaria",
  },
  {
    id: 3,
    nombre: "Carlos Jiménez",
    puesto: "Tesorero",
  },
];

export default function Miembros() {

  const router = useRouter();

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredMembers = miembros.filter(member =>
    member.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.puesto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles['miembros-container']}>
      <h1 className={styles.titulo}>Miembros Actuales</h1>
      
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar miembros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

        </div>
        <button className={styles.addButton} onClick={() => router.push('/agregarMiembro')}>
          <Image src={agregarMiembro} alt="Agregar miembro" width={20} height={20} />
          <span>Agregar miembro</span>
        </button>
      </div>

      {miembros.length === 0 ? (
        <div className={styles.noMembers}>
          <p>No existen miembros en la Junta Directiva</p>
        </div>
      ): (
        <div className={styles['cards-container']}>
          {filteredMembers.map((m) => (
            <div key={m.id} className={styles.card}>
              <div className={styles['card-content']}>
                <h2 className={styles.nombre}>Nombre: {m.nombre}</h2>
                <p className={styles.puesto}>Puesto: {m.puesto}</p>
              </div>
              <button className={styles['ver-btn']}>Ver</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}