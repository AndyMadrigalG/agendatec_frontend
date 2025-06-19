'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import editIcon from '/public/editIcon.svg';
import backIcon from '/public/backIcon.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, usePathname } from 'next/navigation';
import { usePuntos } from './puntosContext';
import Modal from './ModalCrearPunto/ModalCrearPunto'; // Importa el componente Modal
import CrearPuntoPage from './crearPunto/page'; // Importa el contenido de CrearPuntoPage

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
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

  const tipoSesion = [
    { value: 'Ordinaria', label: 'Ordinaria' },
    { value: 'Extraordinaria', label: 'Extraordinaria' },
  ];

  const [formulario, setFormulario] = useState({
    numero: '',
    fechaHora: '',
    tipo: '',
    convocados: [] as string[],
    lugar: '',
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

  const handleGuardar = async (e: React.FormEvent) => {
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

    const formularioCompleto = {
        numero: formulario.numero,
        fechaHora: formulario.fechaHora,
        tipo: formulario.tipo,
        lugar: formulario.lugar,
    };

    try {
      const postAgenda = await fetch(`${BACKEND_URL}/agendas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formularioCompleto),
      });

      if (!postAgenda.ok) {
        throw new Error('Error al guardar la agenda');
      }

      const data = await postAgenda.json();

      const id_newAgenda = parseInt(data.id_Agenda);
      console.log('Agenda guardada con ID:', id_newAgenda);

      
      const convocadosData = formulario.convocados.map((convocado) => ({
        id_Convocado: parseInt(convocado),
      }));

      console.log('Convocados a guardar:', JSON.stringify(convocadosData));
      
      // Post Convocados
      
      const postConvocados = await fetch(`${BACKEND_URL}/agendas/${id_newAgenda}/convocados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(convocadosData),
      });

      if (!postConvocados.ok) {
        throw new Error('Error al guardar los convocados');
      }

      
      // Post Puntos
      for (const punto of puntos) {
        const puntoData = {
          expositorId: parseInt(punto.expositor, 10),
          numeracion: punto.numeracion,
          tipo: punto.tipo,
          duracionMin: parseInt(punto.duracion, 10),
          enunciado: punto.enunciado,
          archivos: '',
          contenido: '',
          agendaId: id_newAgenda,
        };

        console.log('Punto a guardar:', JSON.stringify(puntoData));
        
      
        const responsePuntos = await fetch(`${BACKEND_URL}/puntos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(puntoData),
        });

        if (!responsePuntos.ok) {
          throw new Error('Error al guardar los puntos');
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Agenda guardada',
        text: 'La agenda se ha guardado correctamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      }).then(() => {
        router.push('/agendaInicio');
      });

    } catch (error) {
      console.error('Error al guardar la agenda:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar la agenda',
        text: 'Ocurrió un error al guardar la agenda.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir el comportamiento predeterminado
    setIsModalOpen(true); // Abrir el modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  const handleBack = () => {
    Swal.fire({
      title: '¿Desea regresar?',
      text: 'Los cambios no guardados se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, regresar',
      cancelButtonText: 'No, quedarme',
      color: '#fff',
      background: 'var(--background)',
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/agendaInicio'); // Navega a agendaInicio
      }
    });
  };

  return (
    <div>
      <div className={styles.mainContainer}>
        {/* Flecha para regresar */}
        <div className={styles.backButtonContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            <Image src={backIcon} alt="Regresar" width={40} height={40} />
          </button>
        </div>

        <div className={styles.menu}>
          <h2>Crear Agenda</h2>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.formColumns}>
              <div className={`${styles.columna} ${styles.izquierda}`}>
                <label htmlFor="numero">Nombre de la Agenda:</label>
                <input
                  placeholder="Digite el nombre de la agenda"
                  value={formulario.numero}
                  type="text"
                  id="numero"
                  name="numero"
                  onChange={handleChange}
                />

                <label htmlFor="fechaHora">Fecha de Inicio:</label>
                <input
                  value={formulario.fechaHora}
                  className={styles.fechaInput}
                  type="date"
                  id="fechaHora"
                  name="fechaHora"
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
                      <p>{punto.numeracion}. {punto.enunciado}</p>
                    </button>
                  ))}

                  <button
                    onClick={(e) => handleOpenModal(e)} // Llama a la función con el evento
                    className={styles.addPuntoButton}
                  >
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
                      <li className={styles.miembro}>
                        <span>Seleccionar todos</span>
                        <input
                          type="checkbox"
                          className={styles.seleccionarTodo} 
                          checked={seleccionados.length === miembros.length && miembros.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSeleccionados(miembros.map((m) => m.id));
                              setFormulario((prevFormulario) => ({
                                ...prevFormulario,
                                convocados: miembros.map((m) => m.id.toString()),
                              }));
                            } else {
                              setSeleccionados([]);
                              setFormulario((prevFormulario) => ({
                                ...prevFormulario,
                                convocados: [],
                              }));
                            }
                          }}
                        />
                      </li>

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

      {/* Modal para CrearPunto */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <CrearPuntoPage onClose={handleCloseModal} /> 
        </Modal>
      )}
    </div>
  );
}