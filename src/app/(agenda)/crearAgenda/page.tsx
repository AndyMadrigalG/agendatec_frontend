'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import { useState } from 'react';

export default function CrearAgendaPage() {

    const modalidades = [
        { value : 'virtual', label: 'Virtual' },
        { value: 'presencial', label: 'Presencial' }
    ];

    const tipoSesion = [
        {value: 'reunion', label: 'Reunion'},
        {value: 'conferencia', label: 'Conferencia'}
    ];
    

    const [nombre, setNombre] = useState('');
    const [fecha, setFecha] = useState('');
    const [modalidad, setModalidad] = useState('');
    const [tipo, setTipo] = useState('');
    const [convocados, setConvocados] = useState<string[]>([]);
    const [enlace, setEnlace] = useState('');


    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (nombre && fecha && modalidad && tipo && convocados && enlace){
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('fecha', fecha);
            formData.append('modalidad', modalidad);
            formData.append('tipo', tipo);
            convocados.forEach((convocado) => {
                formData.append('convocados[]', convocado);
            });
            
            console.log('Formulario enviado:', {nombre, fecha, modalidad, tipo, convocados})
        } 

        else{
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
            
    };

    const handleCrear = (e: React.FormEvent) => {
        e.preventDefault();
        if (nombre && fecha && modalidad && tipo && convocados && enlace){
            console.log('Formulario enviado:', {nombre, fecha, modalidad, tipo, convocados})
        } 
        else{
            alert('Por favor, complete todos los campos obligatorios.');
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
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    required />

                                <label htmlFor="fecha">Fecha de Inicio:</label>
                                <input 
                                    className={styles.fechaInput} 
                                    type="date" 
                                    id="fecha" 
                                    name="fecha"
                                    onChange={(e) => setFecha(e.target.value)}  
                                    required />

                                <label htmlFor="modalidad">Modalidad</label>
                                <select 
                                    id='modalidad' 
                                    name='modalidad' 
                                    onChange={(e) => setModalidad(e.target.value)} 
                                    required>
                                    <option value="">Seleccionar modalidad</option>
                                    {modalidades.map((modalidad, index) => (
                                        <option key={modalidad.value} value={modalidad.value}>
                                            {modalidad.label}
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

                                <select 
                                    id='tipo' 
                                    name='tipo'
                                    onChange={(e) => setTipo(e.target.value)}  
                                    required>
                                    {tipoSesion.map((tipo, index) => (
                                        <option key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="enlace_lugar">Enlace / Lugar de Reunion</label>
                                <input 
                                    type="text" 
                                    id='enlace_lugar' 
                                    name='enlace_lugar'
                                    onChange={(e) => setEnlace(e.target.value)} 
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