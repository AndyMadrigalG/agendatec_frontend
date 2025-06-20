'use client';

import styles from './actas.module.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'; 
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import downloadIcon from '/public/downloadIcon.svg';
import backIcon from '/public/backIcon.svg';

const data = [
    { id: 1, nombre: 'Acta de Junta 1', fecha: '2023-10-01' },
    { id: 2, nombre: 'Acta de Junta 2', fecha: '2023-10-02' },
    { id: 3, nombre: 'Acta de Junta 3', fecha: '2023-10-03' }
];

export default function ActasPage() {
    const router = useRouter();

    interface Acta {
        id: number;
        nombre: string;
        fecha: string;
    }

    const [actas, setActas] = useState<Acta[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const filteredActas = actas.filter(acta =>
        acta.nombre.toLowerCase().includes(search.toLowerCase())
    );

    
    const handleBack = () => {
        router.push('/home');
    };

    const handleDescargarActa = (id: number) => {
        // Lógica para descargar el acta
        Swal.fire({
            icon: 'success',
            title: 'Descarga iniciada',
            text: `Se está descargando el acta con ID: ${id}`,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#7b6ef6',
            background: 'var(--background)',
            color: '#f9fafb'
        });
    };

    useEffect(() => {
        const fetchActas = async () => {
            try {
                setActas(data);
            } catch (err) {
                Swal.fire({
                    icon: 'error', 
                    title: 'Error al cargar actas',
                    text: 'Ocurrio un error al cargar las actas',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#7b6ef6',
                    background: 'var(--background)',
                    color: '#f9fafb'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchActas();
    }, []);

    return (
        <div>
            <div className={styles.backButtonContainer}>
                <button className={styles.backButton} onClick={handleBack}>
                    <Image src={backIcon} alt="Regresar" width={40} height={40} />
                </button>
            </div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Actas</h2>
                    <div className={styles.derecha}>
                        <input
                            id="buscar"
                            name="buscar"
                            placeholder='Buscar acta...'
                            className={styles.inputBuscar} 
                            type="text" 
                            onChange={e => setSearch(e.target.value)}
                        />

                    </div>
                </div>

                <div className={styles.actasContainer}>
                    {loading ? (
                        <p className={styles.loadingMsg}>Cargando actas...</p>
                    ) : actas.length === 0 ? (
                        <p className={styles.loadingMsg}>No hay actas disponibles.</p>
                    ) : (
                        filteredActas.map((acta) => (
                            <div
                                className={styles.actaBox}
                                key={acta.id}
                                data-id={acta.id}
                                tabIndex={0}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3>{acta.nombre}</h3>
                                <p>{acta.fecha}</p>
                                <button
                                    className={styles.descargarButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDescargarActa(acta.id);
                                    }}
                                >
                                    <Image
                                        src={downloadIcon}
                                        alt="Descargar Acta"
                                        width={30}
                                        height={30}
                                    />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
