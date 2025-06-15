'use client';

import styles from './agenda.module.css';
import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import { useParams } from 'next/navigation';

export default function AgendaPage() {

    const { idAgenda } = useParams();

    const tipoSesion = [
        {value: 'ordinaria', label: 'Ordinaria'},
        {value: 'extraordinaria', label: 'Extraordinaria'}
    ];

    const [agenda, setAgenda] = useState({
        nombre: '',
        fecha: '',
        tipo: '',
        lugar: '',
        miembros: [] as string[],
    });

    const [puntos, setPuntos] = useState({
        id: '',
        titulo: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAgenda({
            ...agenda,
            [name]: value
        });
    };


    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
    }

    const handleCrear = (e: React.FormEvent) => {
        e.preventDefault();
    }

    useEffect(() => {
        async function fetchAgenda() {
            
            const data = {
                nombre: 'Agenda de Junta Directiva',
                fecha: '2024-06-01',
                tipo: 'Ordinaria',
                lugar: 'Sala de reuniones',
                miembros: ['Juan Pérez', 'María López','Juan Pérez', 'María López', 'Carlos García'],
            };
            setAgenda(data);
        }

        fetchAgenda();
    }, []);

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>{agenda.nombre}</h2>
                </div>

                <div className={styles.formContainer}>
                    <form className={styles.form}>
                        <div className={styles.formColumns}>
                            <div className= {styles.columna}> 
                                <label>Nombre de la Agenda:</label>
                                <p>{agenda.nombre}</p>
                                

                                <label>Fecha de Inicio:</label>
                                <p>{agenda.fecha}</p>


                                <label>Puntos</label>
                                <button className={styles.addPuntoButton}>
                                    <Image src={addIcon} alt="Agregar Punto" width={20} height={20} />
                                    Agregar Punto
                                </button>  
                                
                            </div>

                            <div className={styles.columna}>
                                <label>Tipo de Sesion</label>
                                <p>{agenda.tipo}</p>

                                <label>Lugar de Reunion</label>
                                <p>{agenda.lugar}</p>


                                <label>Miembros convocados</label>
                                <p className={styles.miembrosLista}>{agenda.miembros.join(', ')}</p>
                            </div>

                        </div>

                        <div className={styles.botonesContainer}> 
                            <button className={styles.crearButton}
                                onClick={handleCrear}
                            >Guardar</button>
                        </div>

                    </form>
                </div>



            </div>
        </div>
    )
}

