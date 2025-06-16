'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import styles from './agenda.module.css';

const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

interface Punto {
  id_Punto: number;
  titulo: string;
  tipo: string;
  duracionMin: number;
  expositorId: number;
}

interface AgendaDetalle {
  id_Agenda: number;
  numero: string;
  tipo: string;
  fechaHora: string;
  modalidad: string;
  lugar: string;
  link: string | null;
  convocarMiembros: number[] | string;
  juntaDirectiva: boolean;
  puntos: Punto[];
}

export default function DetalleAgendaPage() {
  const { id_Agenda } = useParams();
  const [agenda, setAgenda] = useState<AgendaDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgenda() {
      try {
        const res = await fetch(`${BACKEND_URL}/agendas/${id_Agenda}`);
        if (!res.ok) throw new Error('No se encontró la agenda');
        const data: AgendaDetalle = await res.json();
        setAgenda(data);
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo cargar la agenda',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAgenda();
  }, [id_Agenda]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Cargando agenda...</p>
      </div>
    );
  }

  if (!agenda) {
    return (
      <div className={styles.noAgenda}>
        <p>No se encontró la agenda.</p>
      </div>
    );
  }

  const convocados = agenda.juntaDirectiva
    ? (agenda.convocarMiembros as number[]).join(', ')
    : (agenda.convocarMiembros as string);

  return (
    <div className={styles['agenda-container']}>
      <h1 className={styles.titulo}>Detalle de la Agenda</h1>

      <div className={styles['info-container']}>
        <div className={styles['info-card']}>
          <h2>Número de Agenda</h2>
          <p>{agenda.numero}</p>
        </div>
        <div className={styles['info-card']}>
          <h2>Fecha y Hora</h2>
          <p>{new Date(agenda.fechaHora).toLocaleString('es-CR')}</p>
        </div>
        <div className={styles['info-card']}>
          <h2>Tipo de Sesión</h2>
          <p>{agenda.tipo.replace('SessionType.', '')}</p>
        </div>
        <div className={styles['info-card']}>
          <h2>Modalidad</h2>
          <p>{agenda.modalidad.replace('Modalidad.', '')}</p>
        </div>
        <div className={styles['info-card']}>
          <h2>Lugar / Link</h2>
          <p>{agenda.lugar || agenda.link || 'No especificado'}</p>
        </div>
        <div className={styles['info-card']}>
          <h2>Convocados</h2>
          <p>{convocados}</p>
        </div>
      </div>

      <h2 className={styles.subtitulo}>Puntos</h2>
      {agenda.puntos.length > 0 ? (
        <div className={styles['puntos-container']}>
          {agenda.puntos.map((punto) => (
            <div key={punto.id_Punto} className={styles['punto-card']}>
              <h3>{punto.titulo}</h3>
              <p><strong>Tipo:</strong> {punto.tipo.replace('PuntoType.', '')}</p>
              <p><strong>Duración:</strong> {punto.duracionMin} min</p>
              <p><strong>Expositor:</strong> {punto.expositorId}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noPuntos}>
          <p>No hay puntos definidos.</p>
        </div>
      )}
    </div>
  );
}
