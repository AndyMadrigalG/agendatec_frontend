'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import editIcon from '/public/editIcon.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {useRouter, usePathname} from 'next/navigation';

export default function CrearAgendaPage() {


    const router = useRouter();
    const pathname = usePathname();

    const [loading, setLoading] = useState(true);
    const [miembros, setMiembros] = useState<{ id: number; nombre: string }[]>([]); 
    const [busqueda, setBusqueda] = useState(''); 
    const [seleccionados, setSeleccionados] = useState<number[]>([]); 

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
                if (valor.trim() === '' || seleccionados.length === 0) {
                    return true;
                }
                return valor.trim() === '';
            }
            return false;
        });

    const handleCrearPunto = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push(`${pathname}/crearPunto`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleGuardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (camposVacios) {
            Swal.fire({icon: 'error',title: 'Campos vacíos',
                text: 'Asegúrese de que todos los campos estén llenos y tengan la información adecuada.',
                confirmButtonText: 'Aceptar', confirmButtonColor: '#7b6ef6',
                background: 'var(--background)',
                color: '#f9fafb',
            });
            return;
        }
        
        Swal.fire({title: 'Guardando agenda...', allowOutsideClick: false,
        background: 'var(--background)',
        color: '#f9fafb',
        didOpen: () => {
            Swal.showLoading();
        }
        });

        // Aca va el fetch

        setTimeout(() => {  // ejemplo para alerta de carga
            Swal.close(); 

            Swal.fire({icon: 'success',title: 'Agenda guardada con éxito',text: 'Se ha guardado la agenda correctamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#7b6ef6',
                background: 'var(--background)', color: '#f9fafb',
            }).then(() => {
                router.push('/agendaInicio');
            });
        }, 1500);
    };

    const handleCrear = (e: React.FormEvent) => {
        e.preventDefault();
        if (camposVacios){
            Swal.fire({cancelButtonText: 'Aceptar', confirmButtonText: 'Cancelar', icon: 'error',
                title: 'Campos vacíos',
                text: 'Asegúrese de que todos los campos estén llenos y tengan la información adecuada.',
                confirmButtonColor: 'var(--buttonColor)',
                background: 'var(--background)', color: '#f9fafb',
            });
            return;
        }
        else {
            Swal.fire({icon: 'info', title: 'Enviar convocatoria.', showCancelButton: true,
                text: 'Favor de enviar la convocatoria a los miembros activos de la junta. Una vez enviada, no se podrá editar la agenda.',
                cancelButtonText: 'Cancelar', confirmButtonText: 'Enviar',
                cancelButtonColor: '#d33', confirmButtonColor: '#7b6ef6',
                background: 'var(--background)', color: '#f9fafb',
                reverseButtons: true,

            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/');
                } else if (result.isDismissed) {

                }
            });
        }
    }

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setMiembros([
                { id: 1, nombre: 'Juan Perez' },
                { id: 2, nombre: 'Ana Gómez' },
                { id: 3, nombre: 'Luis Díaz' },
                
            ]);
            setLoading(false);
        }, 1200);
    }, []);

    const miembrosFiltrados = miembros.filter(m =>
        m.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleCheck = (id: number) => {
        setSeleccionados(prev =>
            prev.includes(id)
                ? prev.filter(selId => selId !== id)
                : [...prev, id]
        );
    };

    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Crear Agenda</h2>
                </div>

                <div className={styles.formContainer}>
                    <form className={styles.form}>
                        <div className={styles.formColumns}>
                            <div className= {`${styles.columna} ${styles.izquierda}`}> 
                                <label htmlFor="nombre">Nombre de la Agenda:</label>
                                <input 
                                    placeholder='Digite el nombre de la agenda'
                                    value={formulario.nombre}
                                    type="text" 
                                    id="nombre" 
                                    name="nombre" 
                                    onChange={handleChange}/>

                                <label htmlFor="fecha">Fecha de Inicio:</label>
                                <input 
                                    value={formulario.fecha}
                                    className={styles.fechaInput} 
                                    type="date" 
                                    id="fecha" 
                                    name="fecha"
                                    onChange={handleChange}  />

                                <label htmlFor="tipo">Tipo de Sesion</label>

                                <select 
                                    value={formulario.tipo}
                                    id='tipo' 
                                    name='tipo'
                                    onChange={handleChange}  
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
                                />

                                <label htmlFor="puntos">Puntos</label>
                                <div className={styles.listaPuntos}>
                                    

                                    <button className={styles.addPuntoButton}>
                                        <Image src={editIcon} alt="Editar Punto" width={20} height={20} />
                                        Punto 1
                                    </button>  

                                    <button onClick={handleCrearPunto} className={styles.addPuntoButton}>
                                    <Image src={addIcon} alt="Agregar Punto" width={20} height={20} />
                                        Agregar Punto
                                    </button>  

                                </div>
                                
                            </div>

                            <div className={`${styles.columna} ${styles.derecha}`}>
                                <label htmlFor="miembros">Convocar Miembros</label>
                                <input
                                    id='busquedaInput'
                                    type="text"
                                    placeholder="Buscar miembro..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                />
                                <div className={styles.listaMiembros}>   
                                    {loading ? (
                                        <p>Cargando miembros...</p>
                                    ) : miembrosFiltrados.length === 0 ? (
                                        <p>No se encontró ningún miembro</p>
                                    ) : (
                                        <ul style={{ listStyleType: 'none', margin: 0, padding: 0, width: '100%' }}>
                                            {miembrosFiltrados.map(m => (
                                                <li className={styles.miembro} key={m.id}>
                                                        <span>{m.nombre}</span>
                                                        <input
                                                            type="checkbox"
                                                            checked={seleccionados.includes(m.id)}
                                                            onChange={() => handleCheck(m.id)}
                                                        />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className={styles.botonesContainer}> 
                                    <button className={styles.guardarButton}
                                        onClick={handleGuardar}
                                    >Guardar</button>
                                    <button className={styles.crearButton}
                                        onClick={handleCrear}
                                    >Crear</button>
                                </div>

                            </div>

                        </div>

                    </form>
                </div>



            </div>
        </div>
        
    );
}