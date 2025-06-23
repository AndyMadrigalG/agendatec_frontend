'use client';

import styles from './editarAgenda.module.css';
import Image from 'next/image';
import backIcon from '/public/backIcon.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, usePathname, useParams } from 'next/navigation';
import Modal from '../../crearAgenda/ModalCrearPunto/ModalCrearPunto';
import EditarPuntoPage from './(editarPunto)/editarPunto';
import { BACKEND_URL } from '../../../../Constants/constants';
import CrearAgendaForm from '../../crearAgenda/(components)/crearAgendaForm';
import {Miembro, Agenda, Punto} from '../../../types'

const local_URL = "http://localhost:8080";

export default function EditarAgendaPage() {
  const router = useRouter();
  const { idAgenda } = useParams(); 
  const [loading, setLoading] = useState(true);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<Punto | null>(null);
  const [puntos, setPuntos] = useState<Punto[]>([]);
  const [agenda, setAgenda] = useState<Agenda | null>(null);

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
        fechaHora: formatDateTimeLocal(agendaData.fechaHora), // Formatea la fecha
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
          id_Punto: punto.id_Punto, 
          numeracion: punto.numeracion,
          enunciado: punto.enunciado,
          duracion: punto.duracionMin.toString(),
          tipo: punto.tipo,
          expositorId: punto.expositorId.toString(),
          archivos: punto.archivos || [],
        }))
      );

      console.log('Puntos cargados:', puntos);

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

  const camposVacios = () => {
    const campos = Object.entries(formulario).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return value === '';
    });

    if (campos.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, complete todos los campos antes de continuar.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return true;
    }
    return false;
  };

  const handleConvocar = async (e: React.FormEvent) => {
    e.preventDefault();
    const guardar = await guardarAgenda();
    if (!guardar) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar la agenda',
        text: 'No se pudo guardar la agenda. Inténtelo de nuevo.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Agenda guardada con éxito',
      text: 'La agenda se ha guardado correctamente.',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#7b6ef6',
      background: 'var(--background)',
      color: '#f9fafb',
    }).then(() => {
      

      Swal.fire({
        title: '¿Desea convocar a los miembros seleccionados?',
        text: 'Se enviará una notificación a los miembros convocados.',
        icon: 'warning',
        background: 'var(--background)',
        showCancelButton: true,
        confirmButtonText: 'Sí, convocar',
        color: '#f9fafb',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const convocar = await convocarMiembros();
          if (convocar) {
            router.push('/agendaInicio');
          }
          
        }
      });
    });

  };



  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    await guardarAgenda();
  };

  const convocarMiembros = async () => {
    try{
      const response = await fetch(`${local_URL}/agendas/${idAgenda}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado: 2
        }),
      });
      if (!response.ok) {
        throw new Error('Error al convocar miembros');
      }

      Swal.fire({
        icon: 'success',
        title: 'Miembros convocados',
        text: 'Se ha enviado la notificación a los miembros convocados.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });

      return true;
    }catch (error) {
      console.error('Error al convocar miembros:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al convocar miembros',
        text: 'Ocurrió un error al convocar a los miembros.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return false;
    }
  }


  const guardarAgenda = async () => {
    if (camposVacios()) {
      return;
    }

    const agendaEditar = {
      numero: formulario.numero,
      fechaHora: formulario.fechaHora,
      fechaFin: "",
      tipo: formulario.tipo,
      lugar: formulario.lugar,
    };

    try {
      const response = await fetch(`${local_URL}/agendas/${idAgenda}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agendaEditar),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar la agenda');
      }
      Swal.fire({
        icon: 'success',
        title: 'Agenda guardada con éxito',
        text: 'La agenda se ha guardado correctamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return true

    } catch (error) {
      console.error('Error al guardar la agenda:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar la agenda',
        text: 'Ocurrió un error al guardar la agenda. Inténtelo de nuevo.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return false;
    }
  }
  

  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>, punto?: Punto) => {
    e.preventDefault();
    setPuntoSeleccionado(punto || null); 
    setIsModalOpen(true); 
  };

  

  const handleGuardarPunto = async (puntoActualizado: Punto) => {
    try {
      if (!puntoActualizado.id_Punto) {

        if (!idAgenda || idAgenda === 'string[]') {
          return;
        }
        const puntoEnviar = {
          agendaId: parseInt(Array.isArray(idAgenda) ? idAgenda[0] : idAgenda, 10),
          enunciado: puntoActualizado.enunciado,
          numeracion: puntos.length + 1,
          duracionMin: parseInt(puntoActualizado.duracion, 10),
          tipo: puntoActualizado.tipo,
          contenido: "",
          expositorId: parseInt(puntoActualizado.expositor, 10),
        };
        console.log('Punto a crear:', puntoEnviar);

        const response = await fetch(`${BACKEND_URL}/puntos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(puntoEnviar),
        });

        if (!response.ok) {
          throw new Error('Error al crear el punto');
        }

        const nuevoPunto = await response.json();
        console.log('Nuevo punto creado:', nuevoPunto);

        // Agregar el nuevo punto al estado
        setPuntos((prevPuntos) => [...prevPuntos, {
          id_Punto: nuevoPunto.id_Punto,
          numeracion: prevPuntos.length + 1, 
          enunciado: nuevoPunto.enunciado,
          duracion: nuevoPunto.duracionMin.toString(),
          tipo: nuevoPunto.tipo,
          expositor: nuevoPunto.expositorId.toString(),
          archivos: [],
        }]);

        Swal.fire({
          icon: 'success',
          title: 'Punto creado con éxito',
          text: 'Se ha creado el punto correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#7b6ef6',
          background: 'var(--background)',
          color: '#f9fafb',
        });
      } else {
        const response = await fetch(`${BACKEND_URL}/puntos/${puntoActualizado.id_Punto}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            enunciado: puntoActualizado.enunciado,
            duracionMin: parseInt(puntoActualizado.duracion, 10),
            tipo: puntoActualizado.tipo,
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar el punto');
        }

        setPuntos((prevPuntos) =>
          prevPuntos.map((p) =>
            p.id_Punto === puntoActualizado.id_Punto ? puntoActualizado : p
          )
        );

        Swal.fire({
          icon: 'success',
          title: 'Punto actualizado con éxito',
          text: 'Se ha actualizado el punto correctamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#7b6ef6',
          background: 'var(--background)',
          color: '#f9fafb',
        });
      }

      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error('Error al guardar el punto:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar el punto',
        text: 'Ocurrió un error al guardar el punto. Inténtelo de nuevo.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
    }
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

  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mes en formato 2 dígitos
    const day = String(date.getDate()).padStart(2, '0'); // Día en formato 2 dígitos
    const hours = String(date.getHours()).padStart(2, '0'); // Horas en formato 2 dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Minutos en formato 2 dígitos
    return `${year}-${month}-${day}T${hours}:${minutes}`;
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
            handleGuardar={handleGuardar}
            handleCrear={handleConvocar} 
            handleCheck={(id) =>
              setSeleccionados((prev) =>
                prev.includes(id) ? prev.filter((selId) => selId !== id) : [...prev, id]
              )
            }
            setBusqueda={setBusqueda}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            setSeleccionados={setSeleccionados}
            editable={true} 
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <EditarPuntoPage
            onClose={handleCloseModal}
            punto={puntoSeleccionado} 
            onGuardar={handleGuardarPunto} 
          />
        </Modal>
      )}
    </div>
  );
}