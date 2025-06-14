'use client';

import styles from './punto.module.css';
import { useEffect, useState } from 'react';

import { useRouter, useParams } from 'next/navigation';
import Swal from 'sweetalert2';


export default function EditarPunto () {
    
    const router = useRouter();
      const { id } = useParams(); 
    
      const [formulario, setFormulario] = useState({
        titulo: '',
        enunciado: '',
        cuerpo: '',
        votaciones: '',
        resultado:  '',
      });

    const handleChange =  (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    };

    const handleGuardar = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

    }

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
                router.push('/');
            }
        });
    }
    
    useEffect(() => {
    const cargarDatosMiembro = async () => {
        try {
            const datosPunto = {
                id: 1,
                titulo: 'Punto 1',
                enunciado: 'Aqui se hace un resumen de lo que se hablara de este punto en la reunion.',
                cuerpo: 'Lorem ipsum dolor sit amet consectetur adipiscing elit nam sociosqu imperdiet metus magnis netus, mattis erat sagittis dignissim cum sed cubilia semper justo himenaeos vulputate dui. Urna convallis ad aliquam dui vivamus habitasse velit nam scelerisque enim penatibus, at nunc venenatis ac lacinia cursus congue interdum morbi nascetur. Dui neque consequat pellentesque platea massa molestie torquent porttitor, quisque mollis purus volutpat feugiat nunc cras aptent, in nascetur euismod aliquet ultricies litora lobortis.Morbi curae mauris inceptos posuere hendrerit accumsan augue iaculis auctor cubilia, diam aptent himenaeos et consequat hac cum habitant sed vitae, lectus eleifend enim molestie non erat curabitur euismod leo. Porta class hendrerit mauris et placerat netus, urna duis tellus condimentum nisi facilisi lacus, sollicitudin non senectus integer a. Dapibus enim felis potenti euismod interdum eu facilisis morbi, est fusce cubilia orci ante blandit hac praesent nullam, vehicula laoreet habitasse libero inceptos vivamus arcu.',
                votaciones: '1 Voto(s) para Opcion A\n2 Voto(s) para Opcion B\n0 Voto(s) para Opcion C',
                resultado: 'Como resultado final de la votacion, se ha decidido que la opcion A es la ganadora. Se ha acordado que se implementara a partir de la proxima reunion.',
            };
            
            setFormulario({
                titulo: datosPunto.titulo,
                enunciado: datosPunto.enunciado,
                cuerpo: datosPunto.cuerpo,
                votaciones: datosPunto.votaciones,
                resultado: datosPunto.resultado
            });

        } catch (error) {
        console.error('Error cargando datos del miembro:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los datos del miembro',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#4f46e5',
            background: 'var(--background)',
            color: '#7b6ef6',
        }).then(() => {
            router.push('/');
        });
        }
    };

    cargarDatosMiembro();
    }, [id, router]);

    useEffect(() => {
        // Ajusta la altura de todos los textareas después de cargar los datos
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach((textarea) => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
    }, [formulario]);

    const autoResize = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    };

    return(

        <div>
            <div className={styles.mainContainer}>

                <div className={styles.menu}>
                    <h2>{formulario.titulo}</h2>
                </div>

                <form className={styles.contenidoContainer}>
                    <label htmlFor="enunciado">Enunciado</label>
                    <textarea
                        id="enunciado"
                        name="enunciado"
                        value={formulario.enunciado}
                        onChange={handleChange}
                        onInput={autoResize}
                    />

                    <label htmlFor="enunciado">Cuerpo</label>
                    <textarea
                        id="cuerpo"
                        name="cuerpo"
                        value={formulario.cuerpo}
                        onChange={handleChange}
                        onInput={autoResize}
                    />

                    <label htmlFor="enunciado">Votaciones</label>
                    <textarea
                        id="votaciones"
                        name="votaciones"
                        value={formulario.votaciones}
                        onChange={handleChange}
                        onInput={autoResize}
                    />
                    <label htmlFor="enunciado">Resultado</label>
                    <textarea
                        id="resultado"
                        name="resultado"
                        value={formulario.resultado}
                        onChange={handleChange}
                        onInput={autoResize}
                    />

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