'use client';

import styles from './agendaInicio.module.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 

export default function AgendaPage() {
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

    useEffect(() => {
        const fetchAgendas = async () => {
            try {
                const res = await fetch('/api/agendas'); // cambiar ruta
                const data = await res.json();
                setAgendas(data);
            } catch (err) {
                Swal.fire({
                    icon: 'error', 
                    title: 'Error al cargar agendas',
                    text: 'Ocurrio un error al cargar las agendas',
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
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Agendas</h2>
                    <div className={styles.derecha}>
                        <input
                            id="buscar"
                            name="buscar"
                            placeholder='Buscar agenda...'
                            className={styles.inputBuscar} 
                            type="text" 
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button>Crear Agenda</button>
                    </div>
                </div>

                <div className={styles.agendasContainer}>
                    {loading ? (
                        <p  className={styles.loadingMsg}>Cargando agendas...</p>
                    ) : agendas.length === 0 ? (
                        <p className={styles.loadingMsg}>No hay agendas disponibles.</p>
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
