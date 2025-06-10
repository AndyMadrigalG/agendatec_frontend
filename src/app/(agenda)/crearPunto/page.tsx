'use client';

import {useState} from 'react';

import styles from './crearPunto.module.css';

export default function CrearPuntoPage() {

    const tipos = [
        { value: 'informativo', label: 'Informativo' },
        { value: 'discusion', label: 'Discusión' },
        { value: 'decisional', label: 'Decisional' },  
    ];

    const personas = [
        { value: 'expositor1', label: 'Expositor 1' },
        { value: 'expositor2', label: 'Expositor 2' },
        { value: 'expositor3', label: 'Expositor 3' },
    ]

    const [titulo, setTitulo] = useState('');
    const [duracion, setDuracion] = useState('');
    const [tipo, setTipo] = useState('');
    const [archivos, setArchivos] = useState<File[]>([]);
    const [expositor, setExpositor] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('duracion', duracion);
        formData.append('tipo', tipo);
        formData.append('expositor', expositor);
        if (archivos && archivos.length > 0) {
            archivos.forEach((archivo) => {
            formData.append('archivos', archivo);
            });
        }
        console.log('Formulario enviado:', {titulo, duracion, tipo, archivos, expositor});
    };

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Crear Punto</h2>
                </div>

                <div className={styles.formContainer}>

                    <form className={styles.form}>
                            <div className= {styles.columna}> 
                                <label htmlFor="titulo">Titulo</label>
                                <input 
                                    type="text" 
                                    id="titulo" 
                                    name="titulo" 
                                    value={titulo} 
                                    onChange={(e) => setTitulo(e.target.value)} 
                                    required
                                />

                                <label htmlFor="expositor">Expositor del punto</label>
                                <select 
                                    name="expositor" 
                                    id="expositor"
                                    value={expositor}
                                    onChange={(e) => setExpositor(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar expositor</option>
                                    {personas.map((persona) => (
                                        <option key={persona.value} value={persona.value}>
                                            {persona.label}
                                        </option>
                                    ))}
                                </select>

                                <label htmlFor="tipo">Tipo</label>
                                <select 
                                    id="tipo" 
                                    name="tipo" 
                                    value={tipo} 
                                    onChange={(e) => setTipo(e.target.value)} 
                                    required
                                >
                                    <option value="">Seleccionar tipo</option>
                                    {tipos.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>

                            </div>
                                
                            <div className={styles.columna}>
                                <label htmlFor="tiempo">Tiempo estimado de duracion (minutos)</label>
                                <input 
                                    type="number" 
                                    id="tiempo" 
                                    name="tiempo" 
                                    value={duracion} 
                                    onChange={(e) => setDuracion(e.target.value)} 
                                    required
                                />

                                <label htmlFor="archivos">Adjuntar archivos (opcional)</label>
                                <div className={styles.archivoContainer}>

                                    <div className={styles.container}>
                                        <div>

                                            <div className={styles.folder}>
                                                <div className={styles.frontside}>
                                                <div className={styles.tip}></div>
                                                <div className={styles.cover}></div>
                                                </div>
                                                <div className={`${styles.backside} ${styles.cover}`}></div>
                                            </div>
                                            <label className={styles.customfileupload}>
                                                <input className={styles.title} 
                                                type="file"
                                                id="archivos" 
                                                name="archivos"
                                                multiple
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files.length > 0) {
                                                        setArchivos(Array.from(e.target.files));
                                                    }
                                                }} 
                                            />
                                            Escoge los archivos
                                            </label>
                                        </div>
                                        <div className={styles.archivosList}>
                                            {archivos.slice(0, 2).map((archivo, index) => (
                                                <h3 key={index}>{archivo.name}</h3>
                                            ))}
                                            {archivos.length > 2 && (
                                                <span>+{archivos.length - 2}</span>
                                            )}
                                        </div>
                                    </div>


                                </div>
                                <div className={styles.botonContainer}>
                                    <button 
                                    className={styles.crearButton}
                                    onClick={handleSubmit}
                                    >Crear</button>
                                </div>
                            </div>

                    </form>

                </div>
            </div>
        </div>
    );
}