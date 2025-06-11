'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {useRouter} from 'next/navigation';

export default function CrearAgendaPage() {

    const router = useRouter();

    const tipoSesion = [
        {value: 'ordinaria', label: 'Ordinaria'},
        {value: 'extraordinaria', label: 'Extraordinaria'}
    ];

    const [formulario, setFormulario] = useState({
        nombre: '',
        fecha: '',
        tipo: '',
        convocados: [] as string[],
        lugar: '',
        puntos: [] as any[],
    });

    const camposVacios = Object.values(formulario).some((valor) => {
            if (typeof valor === 'string') {
                return valor.trim() === '';
            }
            return false;
        });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (camposVacios) {
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'Asegúrese de que todos los campos estén llenos y tengan la información adecuada.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            return;
        }
        
        Swal.fire({
                icon: 'success',
                title: 'Agenda guardada con éxito',
                text: 'Se ha guardado la agenda correctamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            }).then(() => {
                router.push('/agendaInicio'); 
            });
        
    };

    const handleCrear = (e: React.FormEvent) => {
        e.preventDefault();
        if (camposVacios){
            Swal.fire({
                icon: 'error',
                title: 'Campos vacíos',
                text: 'Asegúrese de que todos los campos estén llenos y tengan la información adecuada.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            return;
        }
    }
    

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Crear Agenda</h2>
                </div>

                <div className={styles.formContainer}>
                    <form className={styles.form}>
                        <div className={styles.formColumns}>
                            <div className= {styles.columna}> 
                                <label htmlFor="nombre">Nombre de la Agenda:</label>
                                <input 
                                    placeholder='Digite el nombre de la agenda'
                                    value={formulario.nombre}
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    onChange={handleChange} 
                                    required />

                                <label htmlFor="fecha">Fecha de Inicio:</label>
                                <input 
                                    value={formulario.fecha}
                                    className={styles.fechaInput} 
                                    type="date" 
                                    id="fecha" 
                                    name="fecha"
                                    onChange={handleChange}  
                                    required />


                                <label htmlFor="puntos">Puntos</label>
                                <button className={styles.addPuntoButton}>
                                    
                                <Image src={addIcon} alt="Agregar Punto" width={20} height={20} />
                                    Agregar Punto
                                </button>  
                                
                            </div>

                            <div className={styles.columna}>
                                <label htmlFor="tipo">Tipo de Sesion</label>

                                <select 
                                    value={formulario.tipo}
                                    id='tipo' 
                                    name='tipo'
                                    onChange={handleChange}  
                                    required
                                >
                                    <option value="">Seleccionar el tipo</option>
                                    {tipoSesion.map((tipo, index) => (
                                        <option key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="lugar">Lugar de Reunion</label>
                                <input 
                                    placeholder='Digite el lugar de la reunion'
                                    value={formulario.lugar}
                                    type="text" 
                                    id='lugar' 
                                    name='lugar'
                                    onChange={handleChange} 
                                    required
                                />

                                <label htmlFor="miembros">Convocar Miembros</label>
                                <button className={styles.miembrosButton}>Seleccionar Miembros</button>
                            </div>

                        </div>

                        <div className={styles.botonesContainer}> 
                            <button className={styles.guardarButton}
                                onClick={handleGuardar}
                            >Guardar</button>
                            <button className={styles.crearButton}
                                onClick={handleCrear}
                            >Crear</button>
                        </div>

                    </form>
                </div>



            </div>
        </div>
        
    );
}