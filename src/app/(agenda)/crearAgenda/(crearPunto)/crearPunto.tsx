'use client';

import { useEffect, useState } from 'react';
import { usePuntos } from '../puntosContext';
import styles from './crearPunto.module.css';
import Swal from 'sweetalert2';
import { BACKEND_URL } from '../../../../Constants/constants';
import { Punto } from '../puntosContext';

interface Miembro {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

interface CrearPuntoPageProps {
  onClose: () => void; 
  punto?: Punto | null;
}

export default function CrearPuntoPage({ onClose, punto }: CrearPuntoPageProps) {
  const { puntos, agregarPunto, setPuntos } = usePuntos(); 

  const tipos = [
    { value: 'aprobacion', label: 'Aprobación' },
    { value: 'informativo', label: 'Informativo' },
    { value: 'estrategia', label: 'Estrategia' },
    { value: 'varios', label: 'Varios' },
  ];

  const [enunciado, setEnunciado] = useState(punto?.enunciado || '');
  const [duracion, setDuracion] = useState(punto?.duracion || '');
  const [tipo, setTipo] = useState(punto?.tipo || '');
  const [archivos, setArchivos] = useState<File[]>(punto?.archivos || []);
  const [expositor, setExpositor] = useState(punto?.expositor || '');
  const [miembros, setMiembros] = useState<Miembro[]>([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchMiembros = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BACKEND_URL}/junta/1/miembros`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los miembros');
        }

        const data = await response.json();

        // Mapear los datos al formato esperado
        const miembrosFormateados = data.map((miembro: any) => ({
          id: miembro.usuario.id_Usuario,
          nombre: miembro.usuario.nombre,
          email: miembro.usuario.email,
          cargo: miembro.cargo,
        }));

        setMiembros(miembrosFormateados);
        console.log('Miembros cargados:', miembrosFormateados);
      } catch (error) {
        console.error('Error al cargar los miembros:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar los miembros',
          text: 'Ocurrió un error al cargar los miembros.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#7b6ef6',
          background: 'var(--background)',
          color: '#f9fafb',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMiembros();
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
        onClose(); // Cierra el modal
      }
    });
  };

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

    if (punto) {
      // Actualizar el punto existente
      const puntosActualizados = puntos.map((p) =>
        p.numeracion === punto.numeracion
          ? { ...p, enunciado, duracion, tipo, expositor, archivos }
          : p
      );
      setPuntos(puntosActualizados);
    } else {
      // Crear un nuevo punto
      const nuevoPunto = {
        enunciado,
        duracion,
        tipo,
        expositor,
        archivos,
      };
      agregarPunto(nuevoPunto);
    }

    Swal.fire({
      icon: 'success',
      title: punto ? 'Punto actualizado con éxito' : 'Punto creado con éxito',
      text: punto ? 'Se ha actualizado el punto correctamente.' : 'Se ha creado el punto correctamente.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7b6ef6',
      background: 'var(--background)',
      color: '#f9fafb',
    }).then(() => {
      onClose(); // Cierra el modal
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const nuevosArchivos = Array.from(e.target.files);

      nuevosArchivos.forEach((file) => {
        if (file.size > 10 * 1024 * 1024) { // 10 MB
          Swal.fire({
            icon: 'error',
            title: 'Archivo demasiado grande',
            text: `El archivo ${file.name} es demasiado grande. El tamaño máximo permitido es de 10 MB.`,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#7b6ef6',
            background: 'var(--background)',
            color: '#f9fafb',
          });
          return;
        }
      });

      setArchivos(nuevosArchivos);
    }
  };

  return (
    <div>
      <div className={styles.mainContainer}>
        <div className={styles.menu}>
          <h2>Crear Punto</h2>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.columna}>
              <label htmlFor="enunciado">Enunciado</label>
              <textarea
                placeholder="Ingrese el enunciado del punto"
                id="enunciado"
                name="enunciado"
                value={enunciado}
                onChange={(e) => setEnunciado(e.target.value)}
                required
                className={styles.enunciadoInput}
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
                {loading ? (
                  <option value="">Cargando miembros...</option>
                ) : (
                  miembros.map((miembro) => (
                    <option key={miembro.id} value={miembro.id}>
                      {miembro.nombre} - {miembro.cargo}
                    </option>
                  ))
                )}
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
              <label htmlFor="tiempo">Tiempo estimado de duración (minutos)</label>
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
                    <input
                        className={styles.title}
                        type="file"
                        id="archivos"
                        name="archivos"
                        multiple
                        onChange={handleFileChange}
                    />
                    Seleccionar archivos
                  </label>

                  <div className={styles.archivosList}>
                    {archivos.slice(0, 2).map((archivo, index) => (
                      <h3 key={index}>{archivo.name}</h3>
                    ))}
                    {archivos.length > 2 && <span>+{archivos.length - 2}</span>}
                  </div>
                </div>
              </div>
              <div className={styles.botonContainer}>
                <button className={styles.cancelarButton} onClick={handleCancelar}>
                  Cancelar
                </button>
                <button className={styles.crearButton} onClick={handleSubmit}>
                  Crear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}