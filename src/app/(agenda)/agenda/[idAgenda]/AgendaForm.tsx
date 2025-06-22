'use client';

import React from 'react';
import Image from 'next/image';
import styles from './agenda.module.css';
import editIcon from '/public/editIcon.svg';

interface AgendaFormProps {
  agenda: {
    numero: string;
    tipo: string;
    fechaHora: string;
    lugar: string;
  };
  puntos: {
    id_Punto: string;
    numeracion: string;
    enunciado: string;
  }[];
  convocados: {
    id_Convocado: string;
    Convocado: {
      nombre: string;
      email: string;
    };
  }[];
  handlePuntoClick: (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleCancelar: (e: React.FormEvent) => void;
  handleGuardar: (e: React.FormEvent) => void;
}

export default function AgendaForm({
  agenda,
  puntos,
  convocados,
  handlePuntoClick,
  handleCancelar,
  handleGuardar,
}: AgendaFormProps) {
  return (
    <form className={styles.form}>
      <div className={styles.formColumns}>
        <div className={styles.columna}>
          <label>Nombre de la Agenda:</label>
          <p>{agenda.numero}</p>

          <label>Fecha y Hora:</label>
          <p>{new Date(agenda.fechaHora).toLocaleString()}</p>

          <label>Puntos</label>
          <div className={styles.listaPuntos}>
            {puntos.map((punto) => (
              <button
                onClick={handlePuntoClick(punto.id_Punto)}
                key={punto.id_Punto}
                className={styles.addPuntoButton}
              >
                <Image src={editIcon} alt="Editar Punto" width={20} height={20} />
                <p>
                  {punto.numeracion} - {punto.enunciado}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.columna}>
          <label>Tipo de Sesión:</label>
          <p>{agenda.tipo}</p>

          <label>Lugar de Reunión:</label>
          <p>{agenda.lugar}</p>

          <label>Miembros Convocados:</label>
          <div className={styles.listaConvocados}>
            {convocados.map((convocado) => (
              <p key={convocado.id_Convocado}>
                {convocado.Convocado.nombre} - {convocado.Convocado.email}
              </p>
            ))}
            <p>{convocados.length === 0 ? 'No hay miembros convocados' : ''}</p>
          </div>
        </div>
      </div>

      <div className={styles.botonesContainer}>
        <button className={styles.cancelarButton} onClick={handleCancelar}>
          Cancelar
        </button>
        <button className={styles.crearButton} onClick={handleGuardar}>
          Guardar
        </button>
      </div>
    </form>
  );
}