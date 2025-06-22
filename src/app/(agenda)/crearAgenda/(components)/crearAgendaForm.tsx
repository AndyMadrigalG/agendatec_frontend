'use client';

import React from 'react';
import Image from 'next/image';
import styles from './crearAgenda.module.css';
import addIcon from '/public/addCircle.svg';
import editIcon from '/public/editIcon.svg';

export interface Punto {
  id_Punto: number;
  enunciado: string;
  duracion: string;
  tipo: string;
  expositor: string;
  archivos: File[];
  numeracion: number;
}
interface CrearAgendaFormProps {
  formulario: {
    numero: string;
    fechaHora: string;
    tipo: string;
    convocados: string[];
    lugar: string;
  };
  tipoSesion: { value: string; label: string }[];
  puntos: Punto[];
  miembrosFiltrados: {
    id: number;
    nombre: string;
    cargo: string;
  }[];
  seleccionados: number[];
  busqueda: string;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleGuardar: (e: React.FormEvent) => void;
  handleCrear: (e: React.FormEvent) => void;
  handleCheck: (id: number) => void;
  setBusqueda: (value: string) => void;
  handleOpenModal: (e: React.MouseEvent<HTMLButtonElement>, punto?: Punto) => void;
  handleCloseModal: () => void;
  setSeleccionados: (ids: number[]) => void;
}

export default function CrearAgendaForm({
  formulario,
  tipoSesion,
  puntos,
  miembrosFiltrados,
  seleccionados,
  busqueda,
  loading,
  handleChange,
  handleGuardar,
  handleCrear,
  handleCheck,
  setBusqueda,
  handleOpenModal,
  setSeleccionados,
}: CrearAgendaFormProps) {
  return (
    <form className={styles.form}>
      <div className={styles.formColumns}>
        <div className={`${styles.columna} ${styles.izquierda}`}>
          <label htmlFor="numero">Nombre de la Agenda:</label>
          <input
            placeholder="Digite el nombre de la agenda"
            value={formulario.numero}
            type="text"
            id="numero"
            name="numero"
            onChange={handleChange}
          />

          <label htmlFor="fechaHora">Fecha de Inicio:</label>
          <input
            type="datetime-local"
            id="fechaHora"
            name="fechaHora"
            value={formulario.fechaHora}
            min={new Date().toISOString().slice(0, 16)}
            className={styles.fechaInput}
            onChange={handleChange}
          />

          <label htmlFor="tipo">Tipo de Sesion</label>
          <select
            value={formulario.tipo}
            id="tipo"
            name="tipo"
            onChange={handleChange}
          >
            <option value="">Seleccionar el tipo</option>
            {tipoSesion.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>

          <label htmlFor="lugar">Lugar de Reunion</label>
          <input
            placeholder="Digite el lugar de la reunion"
            value={formulario.lugar}
            type="text"
            id="lugar"
            name="lugar"
            onChange={handleChange}
          />

          <label htmlFor="puntos">Puntos</label>
          <div className={styles.listaPuntos}>
            {puntos.map((punto, index) => (
              <button
                key={index}
                className={styles.addPuntoButton}
                onClick={(e) => handleOpenModal(e, punto)}
              >
                <Image src={editIcon} alt="Editar Punto" width={20} height={20} />
                <p>
                  {punto.numeracion}. {punto.enunciado}
                </p>
              </button>
            ))}

            <button
              onClick={(e) => handleOpenModal(e)}
              className={styles.addPuntoButton}
            >
              <Image src={addIcon} alt="Agregar Punto" width={20} height={20} />
              Agregar Punto
            </button>
          </div>
        </div>

        <div className={`${styles.columna} ${styles.derecha}`}>
          <label htmlFor="miembros">Convocar Miembros</label>
          <input
            id="busquedaInput"
            type="text"
            placeholder="Buscar miembro..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className={styles.listaMiembros}>
            {loading ? (
              <p>Cargando miembros...</p>
            ) : miembrosFiltrados.length === 0 ? (
              <p>No se encontró ningún miembro</p>
            ) : (
              <ul style={{ listStyleType: 'none', margin: 0, padding: 0, width: '100%' }}>
                <li className={styles.miembro}>
                  <span>Seleccionar todos</span>
                  <input
                    type="checkbox"
                    className={styles.seleccionarTodo}
                    checked={seleccionados.length === miembrosFiltrados.length && miembrosFiltrados.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSeleccionados(miembrosFiltrados.map((m) => m.id));
                      } else {
                        setSeleccionados([]);
                      }
                    }}
                  />
                </li>

                {miembrosFiltrados.map((m) => (
                  <li className={styles.miembro} key={m.id}>
                    <span>
                      {m.nombre} - {m.cargo}
                    </span>
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(m.id)}
                      onChange={() => handleCheck(m.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.botonesContainer}>
            <button className={styles.guardarButton} onClick={handleGuardar}>
              Guardar
            </button>
            <button className={styles.crearButton} onClick={handleCrear}>
              Crear
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}