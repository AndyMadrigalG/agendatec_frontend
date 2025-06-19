'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePuntos } from '../puntosContext'; // Importar el contexto de puntos
import styles from './crearPunto.module.css';
import Swal from 'sweetalert2';

export default function CrearPuntoPage() {
  const router = useRouter();
  const { agregarPunto } = usePuntos(); // Usar el contexto

  const tipos = [
    { value: 'aprobacion', label: 'Aprobación' },
    { value: 'informativo', label: 'Informativo' },
    { value: 'estrategia', label: 'Estrategia' },
    { value: 'varios', label: 'Varios' },
  ];

  const [enunciado, setEnunciado] = useState('');
  const [duracion, setDuracion] = useState('');
  const [tipo, setTipo] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [expositor, setExpositor] = useState('');

  const [personas, setPersonas] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchPersonas = async () => {
      setPersonas([
        { value: 'expositor1', label: 'Expositor 1' },
        { value: 'expositor2', label: 'Expositor 2' },
        { value: 'expositor3', label: 'Expositor 3' },
      ]);
    };
    fetchPersonas();
  }, []);

  const camposVacios =
    enunciado.trim() === '' ||
    duracion.trim() === '' ||
    tipo.trim() === '' ||
    expositor.trim() === '';

  const handleCancelar = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
        icon: 'warning',
        title: 'Cancelar creación de punto',
        text: '¿Está seguro de que desea cancelar la creación del punto?',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, continuar',
        confirmButtonColor: 'var(--buttonColor)',
        background: 'var(--background)',
        color: '#f9fafb',
    }).then((result) => {
        if (result.isConfirmed) {
            router.push('/crearAgenda'); 
        }
    });
}

  const handleSubmit = (e: React.FormEvent) => {
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

    const nuevoPunto = {
      enunciado,
      duracion,
      tipo,
      expositor,
      archivos,
    };

    agregarPunto(nuevoPunto); // Agregar el punto al contexto

    Swal.fire({
      icon: 'success',
      title: 'Punto creado con éxito',
      text: 'Se ha creado el punto correctamente.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7b6ef6',
      background: 'var(--background)',
      color: '#f9fafb',
    }).then(() => {
      router.push('/crearAgenda'); // Redirigir a la página de Crear Agenda
    });
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
                  <label htmlFor="enunciado">Enunciado</label>
                  <textarea 
                      placeholder="Ingrese el enunciado del punto"
                      id="enunciado" 
                      name="enunciado" 
                      value={enunciado} 
                      onChange={(e) => setEnunciado(e.target.value)} 
                      required
                      className={styles.enunciadoInput} // Asegúrate de que el estilo esté aplicado
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
                      placeholder="Ingrese el tiempo estimado de duración"
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
                          <label className={styles.fileInput}>
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
                          Seleccionar archivos
                          </label>
                          
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
                      className={styles.cancelarButton}
                      onClick={handleCancelar}
                      >Cancelar</button>
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