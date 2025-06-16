'use client';

import styles from './agendaInicio.module.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function AgendaPage() {
  const router = useRouter();

  interface Agenda {
    id: number;
    nombre: string;
    fecha: string;
  }

  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const filteredAgendas = agendas.filter(agenda =>
    agenda.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleCrearAgenda = () => {
    router.push('/crearAgenda');
  };

  const handleSeleccionarAgenda = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const agendaId = e.currentTarget.getAttribute('data-id');
    if (agendaId) {
      router.push(`/agenda/${agendaId}`);
    }
  };

  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/agendas`);
        if (!res.ok) throw new Error('Error al obtener agendas');
        const data = await res.json();

        const mapped = (data as any[]).map(item => ({
          id: item.id_Agenda,
          nombre: item.numero,
          fecha: new Date(item.fechaHora).toLocaleString('es-CR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));

        setAgendas(mapped);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar agendas',
          text: 'Ocurrió un error al cargar las agendas',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#7b6ef6',
          background: 'var(--background)',
          color: '#f9fafb'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAgendas();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.menu}>
        <h2>Agendas</h2>
        <div className={styles.derecha}>
          <input
            id="buscar"
            name="buscar"
            placeholder="Buscar agenda..."
            className={styles.inputBuscar}
            type="text"
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={handleCrearAgenda}>Crear Agenda</button>
        </div>
      </div>

      <div className={styles.agendasContainer}>
        {loading ? (
          <p className={styles.loadingMsg}>Cargando agendas...</p>
        ) : agendas.length === 0 ? (
          <p className={styles.loadingMsg}>No hay agendas disponibles.</p>
        ) : (
          filteredAgendas.map(agenda => (
            <div
              className={styles.agendaBox}
              key={agenda.id}
              data-id={agenda.id}
              tabIndex={0}
              role="button"
              onClick={handleSeleccionarAgenda}
              style={{ cursor: 'pointer' }}
            >
              <h3>{agenda.nombre}</h3>
              <p>{agenda.fecha}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
