'use client';

import styles from './agenda.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';

const BACKEND_URL = 'http://localhost:3000';

export default function AgendaPage() {
    const { idAgenda } = useParams();

    const [agenda, setAgenda] = useState({
        id_Agenda: idAgenda || '',
        numero: '',
        tipo: '',
        fechaHora: '',
        lugar: '',
    });

    const [loading, setLoading] = useState(true);

    const fetchAgenda = async (id: string) => {
        setLoading(true); // Activa el estado de carga
        try {
            const response = await fetch(`${BACKEND_URL}/agendas/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar la agenda');
            }

            const data = await response.json();
            setAgenda(data);
            console.log('Agenda cargada:', data);
        } catch (error) {
            console.error('Error al cargar la agenda:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar la agenda',
                text: 'Ocurrió un error al cargar la agenda',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
        } finally {
            setLoading(false); // Desactiva el estado de carga
        }
    };

    useEffect(() => {
        if (typeof idAgenda === 'string') {
            fetchAgenda(idAgenda);
        }
    }, [idAgenda]);

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Guardar cambios en la agenda:', agenda);
    };

    const handleCrear = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Crear nuevo punto en la agenda');
    };

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>{loading ? 'Cargando agenda...' : `Agenda: ${agenda.numero}`}</h2>
                </div>

                {loading ? (
                    <p className={styles.loadingMsg}>Cargando datos de la agenda...</p>
                ) : (
                    <div className={styles.formContainer}>
                        <form className={styles.form}>
                            <div className={styles.formColumns}>
                                <div className={styles.columna}>
                                    <label>Nombre de la Agenda:</label>
                                    <p>{agenda.numero}</p>

                                    <label>Fecha y Hora:</label>
                                    <p>{new Date(agenda.fechaHora).toLocaleString()}</p>

                                    <label>Puntos</label>
                                    <button className={styles.addPuntoButton}>
                                        <Image src={addIcon} alt="Agregar Punto" width={20} height={20} />
                                        Agregar Punto
                                    </button>
                                </div>

                                <div className={styles.columna}>
                                    <label>Tipo de Sesión:</label>
                                    <p>{agenda.tipo}</p>

                                    <label>Lugar de Reunión:</label>
                                    <p>{agenda.lugar}</p>

                                    <label>Miembros Convocados:</label>
                                    
                                </div>
                            </div>

                            <div className={styles.botonesContainer}>
                                <button className={styles.crearButton} onClick={handleGuardar}>
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

