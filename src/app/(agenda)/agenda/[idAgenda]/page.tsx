'use client';

import styles from './agenda.module.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import editIcon from '/public/editIcon.svg';
import backIcon from '/public/backIcon.svg';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { BACKEND_URL } from '../../../../Constants/constants';
import AgendaForm from './(components)/AgendaForm';
import {Convocado} from '../../../types'

interface Agenda {
    id_Agenda: number | string | string[];
    numero: string;
    tipo: string;
    fechaHora: string;
    lugar: string;
    estado?: string;
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


export default function AgendaPage() {
    const { idAgenda } = useParams();
    const router = useRouter();

    const [editable, setEditable] = useState(true);
    const [botonTitulo, setBotonTitulo] = useState('Guardar');
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

            switch (data.estado) {
                case 'Draft':
                    data.estado = 'Borrador';
                    break;
                case 'Convocatoria_Enviada':
                    data.estado = 'Convocada';
                    setBotonTitulo('Iniciar Reunión');
                    break;
                case 'Sesion_En_Proceso':
                    data.estado = 'En Proceso';
                    setBotonTitulo('Finalizar Reunión');
                    break;
                case 'Sesion_Terminada':
                    data.estado = 'Reunión Finalizada';
                    setBotonTitulo('Finalizar Agenda');
                    break;
                case 'Finalizada':
                    data.estado = 'Agenda Finalizada';
                    setEditable(false);
                    setBotonTitulo('Generar Acta');
            }

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


    const handlePuntoClick = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push(`/agenda/${idAgenda}/punto/${id}`);
    };

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

    const handleGuardar = async (e: React.FormEvent) => {
        e.preventDefault();
        let nuevoEstado = 2;
        switch (agenda.estado) {
            case 'Convocada':
                nuevoEstado = 3; 
                break;
            case 'En Proceso':
                nuevoEstado = 4;
                break;
            case 'Reunión Finalizada':
                nuevoEstado = 5;
                break;
            case 'Agenda Finalizada':
                nuevoEstado = 6;
                break;
        }

        try {
            const response = await fetch(`${BACKEND_URL}/agendas/${idAgenda}/status`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                estado: nuevoEstado
            }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el estado de la agenda');
            }
            
            Swal.fire({
                icon: 'success',
                title: 'Estado de la agenda actualizado',
                text: `El estado de la agenda ha sido cambiado exitosamente.`,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            console.error('Error al guardar la agenda:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al cambiar el estado de la agenda',
                text: 'Ocurrió un error al cambiar el estado de la agenda, vuelva a intentarlo más tarde.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            return;
        }



    }

    const handleBack = () => {
        router.push('/agendaInicio');
    };

    return (
        <div>
            <div className={styles.backButtonContainer}>
                <button className={styles.backButton} onClick={handleBack}>
                    <Image src={backIcon} alt="Regresar" width={40} height={40} />
                </button>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>{loading ? 'Cargando agenda...' : `Agenda: ${agenda.numero}`}</h2>
                    <p className={styles.estado}>{loading ? 'Cargando Estado...' : `Estado: ${agenda.estado}`}</p>

                </div>

                {loading ? (
                    <p className={styles.loadingMsg}>Cargando datos de la agenda...</p>
                ) : (
                    <div className={styles.formContainer}>
                        <AgendaForm
                            agenda={agenda}
                            puntos={puntos}
                            convocados={convocados}
                            handlePuntoClick={handlePuntoClick}
                            handleCancelar={handleCancelar}
                            handleGuardar={handleGuardar}
                            botonTitulo={botonTitulo}
                            editable={editable}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

