'use client';

import styles from './agenda.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import editIcon from '/public/editIcon.svg';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const BACKEND_URL = 'http://localhost:8080';

interface Agenda {
    id_Agenda: number | string | string[];
    numero: string;
    tipo: string;
    fechaHora: string;
    lugar: string;
}

interface Punto {
    id_Punto: string;
    numeracion: string;
    tipo: string;
    duracionMin: string;
    enunciado: string;
    archivos: string;
    contenido: string;
    agendaId: string | number | string[];
}

interface Convocado {
    id_Convocado: string;
    Convocado: {
        nombre: string;
        email: string;
        telefono: string;
    };
}

export default function AgendaPage() {
    const { idAgenda } = useParams();
    const router = useRouter();

    const [agenda, setAgenda] = useState<Agenda>({
        id_Agenda: idAgenda || '',
        numero: '',
        tipo: '',
        fechaHora: '',
        lugar: '',
    });

    const [puntos, setPuntos] = useState<Punto[]>([]);
    const [convocados, setConvocados] = useState<Convocado[]>([]); 
    const [loading, setLoading] = useState(true);

    const fetchAgenda = async (id: string) => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    const fetchPuntos = async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/agendas/${id}/puntos`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los puntos');
            }

            const data = await response.json();
            setPuntos(data);
            console.log('Puntos cargados:', data);
        } catch (error) {
            console.error('Error al cargar los puntos:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar los puntos',
                text: 'Ocurrió un error al cargar los puntos',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
        }
    };

    const fetchConvocados = async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/agendas/${id}/convocados`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los convocados');
            }

            const data = await response.json();
            setConvocados(data); 
            console.log('Convocados cargados:', data);
        } catch (error) {
            console.error('Error al cargar los convocados:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar los convocados',
                text: 'Ocurrió un error al cargar los convocados',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
        }
    };

    useEffect(() => {
        if (typeof idAgenda === 'string') {
            fetchAgenda(idAgenda);
            fetchPuntos(idAgenda);
            fetchConvocados(idAgenda); // Cargar convocados
        }
    }, [idAgenda]);

    const handleCancelar = (e: React.FormEvent) => {
        e.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Los cambios no guardados se perderán.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7b6ef6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No, seguir editando',
            background: 'var(--background)',
            color: '#f9fafb',
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/agendaInicio');
            }
        });
    };

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Guardar cambios en la agenda:', agenda);
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
                                    <div className={styles.listaPuntos}>
                                        {puntos.map((punto) => (
                                            <button
                                                key={punto.id_Punto}
                                                className={styles.addPuntoButton}
                                            >
                                                <Image src={editIcon} alt="Editar Punto" width={20} height={20} />
                                                <p>{punto.numeracion} - {punto.enunciado}</p>
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
                                        <p>
                                            {convocados.length === 0 ? 'No hay miembros convocados' : ''}
                                        </p>
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
                    </div>
                )}
            </div>
        </div>
    );
}

