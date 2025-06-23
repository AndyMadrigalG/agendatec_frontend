'use client';

import styles from './punto.module.css';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { BACKEND_URL } from '../../../../../../Constants/constants';
import Image from 'next/image';
import timer from '/public/timer.png';


export default function EditarPunto() {
    const router = useRouter();
    const { idAgenda, idPunto } = useParams();
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [contenidoTitle, setContenidoTitle] = useState('Contenido');

    const [formulario, setFormulario] = useState({
        numeracion: '',
        tipo: '',
        enunciado: '',
        contenido: '',
        expositorId: '',
        duracionMin: '',
    });

    const [votaciones, setVotaciones] = useState({
        votos_a_Favor: 0,
        votos_en_Contra: 0,
        votos_Abstencion: 0,
        acuerdo: '',
    });

    const [isVotacion, setIsVotacion] = useState(false);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchPunto = async (id: string) => {
        try {
            const response = await fetch(`${BACKEND_URL}/puntos/${idPunto}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar los puntos');
            }

            const data = await response.json();

            if (data.votacion) {
                setVotaciones(data.votacion);
                setIsVotacion(true);
            }

            switch (data.tipo) {
                case 'informativo':
                    setContenidoTitle('Detalles');
                    break;
                case 'estrategia':
                    setContenidoTitle('Consideraciones');
                    break;
                case 'varios':
                    setContenidoTitle('Propuesta');
                    break;
            }

            setFormulario(data);
            setLoading(false);

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

    useEffect(() => {
        if (typeof idAgenda === 'string' && typeof idPunto === 'string') {
            fetchPunto(idPunto);
        }
    }, [idAgenda, idPunto]);



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (e.target.type === 'number') {
            setVotaciones({ ...votaciones, [name]: Number(value) || 0 });
        } else {
            setFormulario({ ...formulario, [name]: value });
            setVotaciones({ ...votaciones, [name]: value });
        }
    };

    const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    const handleCancelar = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Si cancelas, se perderán los cambios realizados.',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#4f46e5',
            cancelButtonText: 'No, seguir editando',
            confirmButtonText: 'Sí, cancelar',
            background: 'var(--background)',
            color: '#fff',
        }).then((result) => {
            if (result.isConfirmed) {
                router.push(`/agenda/${idAgenda}`);
            }
        });
    };

    const handleGuardar = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        Swal.fire({
            title: 'Guardando cambios...',
            text: 'Por favor espera mientras se aplican los cambios.',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
            background: 'var(--background)',
            color: '#f9fafb',
        });

        const formularioEditPunto = {
            enunciado: formulario.enunciado,
            contenido: formulario.contenido,
        };

        try {
            const editPunto = await fetch(`${BACKEND_URL}/puntos/${idPunto}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formularioEditPunto,
                }),
            });

            if (!editPunto.ok) {
                throw new Error('Error al guardar el punto');
            }

            if (isVotacion) {
                const votacionEdit = {
                    votos_a_Favor: votaciones.votos_a_Favor,
                    votos_en_Contra: votaciones.votos_en_Contra,
                    votos_Abstencion: votaciones.votos_Abstencion,
                    acuerdo: votaciones.acuerdo,
                };

                const editVotacion = await fetch(`${BACKEND_URL}/puntos/${idPunto}/votacion`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...votacionEdit,
                    }),
                });

                if (!editVotacion.ok) {
                    throw new Error('Error al guardar la votación');
                }
            }

            // Cerrar Swal de carga y mostrar éxito
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Punto guardado',
                text: 'El punto se ha guardado correctamente',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            }).then(() => {
                router.push(`/agenda/${idAgenda}`);
            });
        } catch (error) {
            console.error('Error al guardar el punto:', error);

            // Cerrar Swal de carga y mostrar error
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error al guardar el punto',
                text: 'Ocurrió un error al guardar el punto',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
        }
    };

    return (
        <div>
            <div className={styles.timerContainer}>
                <Image 
                    src={timer}
                    alt="Icono de temporizador"
                    width={24}
                    height={24}
                    className={styles.timerImage}
                />
                <span className={styles.timerText}>{formatTime(timeElapsed)}</span>
            </div>

            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>{loading ? 'Cargando punto...' : `Punto ${formulario.numeracion}`}</h2>
                </div>

                <form className={styles.contenidoContainer}>
                    

                    <label htmlFor="enunciado">Enunciado</label>
                    <textarea
                        placeholder='Escribe el enunciado del punto aquí...'
                        id="enunciado"
                        name="enunciado"
                        value={formulario.enunciado}
                        onChange={handleChange}
                        onInput={autoResize}
                    />

                    <label htmlFor="contenido">{contenidoTitle}</label>
                    <textarea
                        placeholder='Escribe el contenido aquí...'
                        id="contenido"
                        name="contenido"
                        value={formulario.contenido}
                        onChange={handleChange}
                        onInput={autoResize}
                    />

                    {isVotacion && (
                        <>
                            <label htmlFor="votaciones">Votaciones</label>
                            <div className={styles.votacionesContainer}>
                                <p>
                                    Votos a favor:
                                    <input
                                        id="votos_a_Favor"
                                        name="votos_a_Favor"
                                        value={votaciones.votos_a_Favor || 0}
                                        className={styles.votacionInput}
                                        type="number"
                                        onChange={handleChange}
                                    />
                                </p>
                                <p>
                                    Votos en contra:
                                    <input
                                        id="votos_en_Contra"
                                        name="votos_en_Contra"
                                        value={votaciones.votos_en_Contra || 0}
                                        className={styles.votacionInput}
                                        type="number"
                                        onChange={handleChange}
                                    />
                                </p>
                                <p>
                                    Votos abstención:
                                    <input
                                        id="votos_Abstencion"
                                        name="votos_Abstencion"
                                        value={votaciones.votos_Abstencion || 0}
                                        className={styles.votacionInput}
                                        type="number"
                                        onChange={handleChange}
                                    />
                                </p>
                            </div>

                            <label htmlFor="acuerdo">Acuerdo</label>
                            <textarea
                                placeholder="Escribe el resultado de la votación aquí..."
                                id="acuerdo"
                                name="acuerdo"
                                value={votaciones.acuerdo}
                                onChange={handleChange}
                                onInput={autoResize}
                            />
                        </>
                    )}

                    <div className={styles.botonesContainer}>
                        <button
                            type="button"
                            className={styles.cancelarBtn}
                            onClick={handleCancelar}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className={styles.guardarBtn}
                            onClick={handleGuardar}
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}