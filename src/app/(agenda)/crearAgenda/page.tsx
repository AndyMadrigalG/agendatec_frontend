'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import editIcon from '/public/editIcon.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, usePathname } from 'next/navigation';
import { usePuntos } from './puntosContext';

const BACKEND_URL = 'http://localhost:8080'; // URL del backend

interface Miembro {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

export default function CrearAgendaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { puntos } = usePuntos(); // Usar el contexto

  const [loading, setLoading] = useState(true);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);

  const tipoSesion = [
    { value: 'ordinaria', label: 'Ordinaria' },
    { value: 'extraordinaria', label: 'Extraordinaria' },
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
      title: 'Guardando agenda...',
      allowOutsideClick: false,
      background: 'var(--background)',
      color: '#f9fafb',
      didOpen: () => {
        Swal.showLoading();
      },
    });
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    const formularioCompleto = {
      ...formulario,
      puntos: puntos.map((punto) => ({
        numeracion: punto.numeracion,
        tipo: punto.tipo,
        duracionMin: parseInt(punto.duracion, 10),
        enunciado: punto.enunciado,
        archivos: punto.archivos.map((archivo) => archivo.name),
        contenido: '', 
        expositorId: punto.expositor, 
      })),
    };

    console.log('Formulario enviado:', formularioCompleto);
  }

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

  useEffect(() => {
    fetchMiembros();
  }, []);

  const miembrosFiltrados = miembros.filter((m) =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCheck = (id: number) => {
    // Actualizar la lista de seleccionados
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((selId) => selId !== id) : [...prev, id]
    );

    // Actualizar la lista de convocados en el formulario
    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      convocados: seleccionados.includes(id)
        ? prevFormulario.convocados.filter((convId) => convId !== id.toString())
        : [...prevFormulario.convocados, id.toString()],
    }));
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
              <div className={`${styles.columna} ${styles.izquierda}`}>
                <label htmlFor="nombre">Nombre de la Agenda:</label>
                <input
                  placeholder="Digite el nombre de la agenda"
                  value={formulario.nombre}
                  type="text"
                  id="nombre"
                  name="nombre"
                  onChange={handleChange}
                />

                <label htmlFor="fecha">Fecha de Inicio:</label>
                <input
                  value={formulario.fecha}
                  className={styles.fechaInput}
                  type="date"
                  id="fecha"
                  name="fecha"
                  onChange={handleChange}
                />

                <label htmlFor="tipo">Tipo de Sesion</label>

                <select
                  value={formulario.tipo}
                  id="tipo"
                  name="tipo"
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
                  placeholder="Digite el lugar de la reunion"
                  value={formulario.lugar}
                  type="text"
                  id="lugar"
                  name="lugar"
                  onChange={handleChange}
                />

                <label htmlFor="puntos">Puntos</label>
                <div className={styles.listaPuntos}>
                  {puntos.map((punto, index) => (
                    <button key={index} className={styles.addPuntoButton}>
                      <Image src={editIcon} alt="Editar Punto" width={20} height={20} />
                      {punto.numeracion}. {punto.enunciado} {/* Mostrar numeración y enunciado */}
                    </button>
                  ))}

                  <button onClick={handleCrearPunto} className={styles.addPuntoButton}>
                    <Image src={addIcon} alt="Agregar Punto" width={20} height={20} />
                    Agregar Punto
                  </button>
                </div>
              </div>

              <div className={`${styles.columna} ${styles.derecha}`}>
                <label htmlFor="miembros">Convocar Miembros</label>
                <input
                  id="busquedaInput"
                  type="text"
                  placeholder="Buscar miembro..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <div className={styles.listaMiembros}>
                  {loading ? (
                    <p>Cargando miembros...</p>
                  ) : miembrosFiltrados.length === 0 ? (
                    <p>No se encontró ningún miembro</p>
                  ) : (
                    <ul style={{ listStyleType: 'none', margin: 0, padding: 0, width: '100%' }}>
                      {miembrosFiltrados.map((m) => (
                        <li className={styles.miembro} key={m.id}>
                          <span>{m.nombre} - {m.cargo}</span>
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
                  <button className={styles.guardarButton} onClick={handleGuardar}>
                    Guardar
                  </button>
                  <button className={styles.crearButton} onClick={handleCrear}>
                    Crear
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}