'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';

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

  if (loading) return <p style={{ padding: '40px', color: '#ccc' }}>Cargando agenda...</p>;
  if (!agenda) return null;

  // Convocados: números o cadena (otros)
  const convocados = agenda.juntaDirectiva
    ? (agenda.convocarMiembros as number[]).join(', ')
    : (agenda.convocarMiembros as string);

  return (
    <div style={{ padding: 40, color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '1px solid #444', paddingBottom: 10 }}>
        Agenda: {agenda.numero}
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 30 }}>
        {[
          ['Fecha y Hora', new Date(agenda.fechaHora).toLocaleString('es-CR')],
          ['Tipo de Sesión', agenda.tipo.replace('SessionType.', '')],
          ['Modalidad', agenda.modalidad.replace('Modalidad.', '')],
          ['Lugar / Link', agenda.lugar || agenda.link || 'No especificado'],
          ['Convocados', convocados],
        ].map(([label, value]) => (
          <div key={label} style={{ flex: '1 1 45%' }}>
            <p style={{ fontSize: 18, color: '#aaa', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 20 }}>{value}</p>
          </div>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>Puntos</h2>
      {agenda.puntos.length > 0 ? (
        <ul style={{ padding: 0, marginTop: 10 }}>
          {agenda.puntos.map(p => (
            <li key={p.id_Punto} style={{
              marginBottom: 16,
              padding: 12,
              background: '#222',
              borderRadius: 6,
              border: '1px solid #333'
            }}>
              <p><strong>{p.titulo}</strong></p>
              <p>Tipo: {p.tipo.replace('PuntoType.', '')}</p>
              <p>Duración: {p.duracionMin} min</p>
              <p>Expositor: {p.expositorId}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#aaa', marginTop: 10 }}>No hay puntos definidos.</p>
      )}
    </div>
  );
}
