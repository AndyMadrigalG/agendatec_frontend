'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import { useState } from 'react';

export default function CrearAgendaPage() {

    const modalidades = ["Selecciona la modalidad", "Presencial", "Virtual"];
    const tipoSesion = ["Selecciona el tipo de sesion", "Reunion", "Taller", "Conferencia"];
    
    

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Crear Agenda</h2>
                </div>

                <div className={styles.formContainer}>
                    <form className={styles.form}>
                        <div className= {styles.columna}> 
                            <label htmlFor="nombre">Nombre de la Agenda:</label>
                            <input type="text" id="nombre" name="nombre" required />

                            <label htmlFor="fecha">Fecha de Inicio:</label>
                            <input className={styles.fechaInput} type="date" id="fecha" name="fecha" required />

                            <label htmlFor="modalidad">Modalidad</label>
                            <select id='modalidad' name='modalidad' required>
                                {modalidades.map((modalidad, index) => (
                                    <option key={index} value={modalidad}>
                                        {modalidad}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="puntos">Puntos</label>
                            <button className={styles.addPuntoButton}>
                                
                            <Image src={addIcon} alt="Agregar Punto" width={20} height={20} />
                                Agregar Punto
                            </button>
                            
                            </div>
                            <div className={styles.columna}>
                                <label htmlFor="tipo">Tipo de Sesion</label>

                                <select id='tipo' name='tipo' required>
                                    {tipoSesion.map((tipo, index) => (
                                        <option key={index} value={tipo}>
                                            {tipo}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="enlace_lugar">Enlace / Lugar de Reunion</label>
                                <input type="text" id='enlace_lugar' name='enlace_lugar'/>

                                <label htmlFor="miembros">Convocar Miembros</label>
                                <button className={styles.miembrosButton}>Seleccionar Miembros</button>
                                

                            </div>
                    </form>
                </div>

                <div className={styles.botonesContainer}> 
                    <button className={styles.guardarButton}>Guardar</button>
                    <button className={styles.crearButton}>Crear</button>
                </div>


            </div>
        </div>
        
    );
}