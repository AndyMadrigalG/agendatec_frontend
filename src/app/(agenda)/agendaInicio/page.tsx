'use client';

import styles from './agendaInicio.module.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import backIcon from '/public/backIcon.svg';
import { BACKEND_URL } from '../../../Constants/constants';
import {Agenda} from '../../types';

export default function AgendaPage() {
    const router = useRouter();

    const [agendas, setAgendas] = useState<Agenda[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchAgendas = async () => {
        setLoading(true); // Activa el estado de carga
        try {
            const response = await fetch(`${BACKEND_URL}/agendas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al cargar las agendas');
            }

            const data = await response.json();

            data.forEach((agenda: any) => {
                switch (agenda.estado) {
                case 'Draft':
                    agenda.estado = 'Borrador';
                    break;
                case 'Convocatoria_Enviada':
                    agenda.estado = 'Convocada';
                    break;
                case 'Sesion_En_Proceso':
                    agenda.estado = 'En Proceso';
                    break;
                case 'Sesion_Terminada':
                    agenda.estado = 'Finalizada';
                    break;
                }
            });

            setAgendas(data);
            console.log('Agendas cargadas:', data);
        } catch (err) {
            console.error('Error al cargar agendas:', err);
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

    useEffect(() => {
        fetchAgendas();
    }, []);

    const filteredAgendas = agendas.filter(agenda =>
        agenda.numero.toLowerCase().includes(search.toLowerCase()) ||
        agenda.tipo.toLowerCase().includes(search.toLowerCase()) ||
        agenda.lugar.toLowerCase().includes(search.toLowerCase())
    );

    const handleCrearAgenda = async () => {
        router.push('/crearAgenda');
    };

    const handleSeleccionarAgenda = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const agendaId = e.currentTarget.getAttribute('data-id');
        const agendaEstado = agendas.find(agenda => agenda.id_Agenda.toString() === agendaId)?.estado;

        if (agendaId && agendaEstado) {
            if (agendaEstado === 'Borrador') {
                router.push(`/editarAgenda/${agendaId}`);
            } else {
                router.push(`/agenda/${agendaId}`);
            }
        }
    };

    const handleEliminarAgenda = async (agendaId: number) => {
        try {
            const response = await fetch(`${BACKEND_URL}/agendas/${agendaId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la agenda');
            }

            Swal.fire({
                icon: 'success',
                title: 'Agenda eliminada',
                text: 'La agenda ha sido eliminada correctamente',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb'
            });

            await fetchAgendas(); // Recargar las agendas después de eliminar
        } catch (err) {
            console.error('Error al eliminar la agenda:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error al eliminar agenda',
                text: 'Ocurrió un error al intentar eliminar la agenda',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb'
            });
        }
    };

    const handleBack = () => {
        router.push('/home');
    };

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.backButtonContainer}>
                    <button className={styles.backButton} onClick={handleBack}>
                        <Image src={backIcon} alt="Regresar" width={40} height={40} />
                    </button>
                </div>
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
                        <button onClick={handleCrearAgenda}>Crear Agenda</button>
                    </div>
                </div>

                <div className={styles.agendasContainer}>
                    {loading ? (
                        <p className={styles.loadingMsg}>Cargando agendas...</p>
                    ) : agendas.length === 0 ? (
                        <p className={styles.loadingMsg}>No hay agendas disponibles.</p>
                    ) : (
                        filteredAgendas.map((agenda) => (
                            <div
                                className={styles.agendaBox}
                                key={agenda.id_Agenda}
                                data-id={agenda.id_Agenda.toString()}
                                tabIndex={0}
                                role="button"
                                onClick={handleSeleccionarAgenda}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.section}>
                                    <h3>{agenda.numero} - Sesion {agenda.tipo}</h3>
                                </div>
                                <div className={styles.section}>
                                    <p>{agenda.estado}</p>
                                </div>
                                <div className={styles.section}>
                                    <p>Fecha y hora: {new Date(agenda.fechaHora).toLocaleString()}</p>
                                </div>

                                
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
