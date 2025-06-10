'use client';

import styles from './agendaInicio.module.css';
import { useEffect, useState } from 'react';

export default function AgendaPage() {
    interface Agenda {
        id: number;
        nombre: string;
        fecha: string;
    }

    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgendas = async () => {
            try {
                const res = await fetch('/api/agendas'); // o la URL de tu backend
                const data = await res.json();
                setAgendas(data);
            } catch (err) {
                alert('No se pudieron cargar las agendas');
            } finally {
                setLoading(false);
            }
        };

        fetchAgendas();
    }, []);

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Agendas</h2>
                    <div className={styles.derecha}>
                        <h3>Buscar</h3>
                        <button>Crear Agenda</button>
                    </div>
                </div>

                <div className={styles.agendasContainer}>
                    {loading ? (
                        <p>Cargando agendas...</p>
                    ) : agendas.length === 0 ? (
                        <p>No hay agendas disponibles.</p>
                    ) : (
                        agendas.map((agenda) => (
                            <div className={styles.agendaBox} 
                                key={agenda.id}>
                                <h3>{agenda.nombre}</h3>
                                <p>{agenda.fecha}</p>
                                <div className={styles.agendaDerecha}>
                                    <p>Editar</p>
                                    <p>Descargar</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
