'use client';

import styles from './editarAgenda.module.css';
import Image from 'next/image';
import backIcon from '/public/backIcon.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Modal from '../../crearAgenda/ModalCrearPunto/ModalCrearPunto';
import CrearPuntoPage from '../../crearAgenda/(crearPunto)/crearPunto';
import { BACKEND_URL } from '../../../../Constants/constants';
import CrearAgendaForm from '../../crearAgenda/(components)/crearAgendaForm';
import { Punto } from '../../crearAgenda/puntosContext';

interface Miembro {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

export default function EditarAgendaPage() {
  const router = useRouter();
  const { idAgenda } = useParams(); // Obtener el idAgenda del parámetro
  const [loading, setLoading] = useState(true);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<Punto | null>(null);
  const [puntos, setPuntos] = useState<Punto[]>([]);

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

  // Cargar la información de la agenda y los puntos
  const fetchAgenda = async () => {
    setLoading(true);
    try {
      const agendaResponse = await fetch(`${BACKEND_URL}/agendas/${idAgenda}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
      });

      if (!agendaResponse.ok) {
          throw new Error('Error al cargar la agenda');
      }

      const agendaData = await agendaResponse.json();

      const convocadosResponse = await fetch(`${BACKEND_URL}/agendas/${idAgenda}/convocados`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
      });

      if (!convocadosResponse.ok) {
          throw new Error('Error al cargar los convocados');
      }

      const convocadosData = await convocadosResponse.json();
      console.log('Convocados cargados:', convocadosData);

      setFormulario({
        numero: agendaData.numero,
        fechaHora: agendaData.fechaHora,
        tipo: agendaData.tipo,
        convocados: convocadosData.map((convocado: any) => convocado.id_Convocado.toString()),
        lugar: agendaData.lugar,
      });

      const puntosResponse = await fetch(`${BACKEND_URL}/agendas/${idAgenda}/puntos`);

      if (!puntosResponse.ok) throw new Error('Error al cargar los puntos');
      const puntosData = await puntosResponse.json();

      // Actualizar los puntos
      setPuntos(
        puntosData.map((punto: any) => ({
          numeracion: punto.numeracion,
          enunciado: punto.enunciado,
          duracion: punto.duracionMin.toString(),
          tipo: punto.tipo,
          expositor: punto.expositorId.toString(),
          archivos: punto.archivos || [],
        }))
      );
    } catch (error) {
      console.error('Error al cargar la agenda:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al cargar la agenda',
        text: 'Ocurrió un error al cargar la agenda.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMiembros = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/junta/1/miembros`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al cargar los miembros');

      const miembrosData = await response.json();
      const miembrosFormateados = miembrosData.map((miembro: any) => ({
        id: miembro.usuario.id_Usuario,
        nombre: miembro.usuario.nombre,
        email: miembro.usuario.email,
        cargo: miembro.cargo,
      }));

      setMiembros(miembrosFormateados);

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

  useEffect(() => {
    fetchAgenda();
    
  }, [idAgenda]);

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>, punto?: Punto) => {
    e.preventDefault();
    setPuntoSeleccionado(punto || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPuntoSeleccionado(null);
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
        router.push('/agendaInicio');
      }
    });
  };

  return (
    <div>
      <div className={styles.mainContainer}>
        <div className={styles.backButtonContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            <Image src={backIcon} alt="Regresar" width={40} height={40} />
          </button>
        </div>

        <div className={styles.menu}>
          <h2>Agenda: {formulario.numero}</h2>
        </div>

        <div className={styles.formContainer}>
          <CrearAgendaForm
            formulario={formulario}
            tipoSesion={tipoSesion}
            puntos={puntos}
            miembrosFiltrados={miembros}
            seleccionados={seleccionados}
            busqueda={busqueda}
            loading={loading}
            handleChange={(e) => setFormulario({ ...formulario, [e.target.name]: e.target.value })}
            handleGuardar={() => console.log('Guardar agenda')}
            handleCrear={() => console.log('Crear agenda')} 
            handleCheck={(id) =>
              setSeleccionados((prev) =>
                prev.includes(id) ? prev.filter((selId) => selId !== id) : [...prev, id]
              )
            }
            setBusqueda={setBusqueda}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            setSeleccionados={setSeleccionados}
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <CrearPuntoPage onClose={handleCloseModal} punto={puntoSeleccionado} />
        </Modal>
      )}
    </div>
  );
}