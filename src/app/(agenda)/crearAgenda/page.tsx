'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import backIcon from '/public/backIcon.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, usePathname } from 'next/navigation';
import { usePuntos } from './puntosContext';
import Modal from './ModalCrearPunto/ModalCrearPunto'; // Importa el componente Modal
import CrearPuntoPage from './(crearPunto)/crearPunto'; // Importa el contenido de CrearPuntoPage
import { BACKEND_URL } from '../../../Constants/constants';
import { Punto } from '../../types';
import CrearAgendaForm from './(components)/crearAgendaForm';

interface Miembro {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

export default function CrearAgendaPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { puntos, setPuntos } = usePuntos();

  const [loading, setLoading] = useState(true);
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<Punto | null>(null); 

  const tipoSesion = [
    { value: 'Ordinaria', label: 'Ordinaria' },
    { value: 'Extraordinaria', label: 'Extraordinaria' },
  ];

  const [formulario, setFormulario] = useState({
    numero: '',
    fechaHora: new Date().toISOString(),
    tipo: '',
    convocados: [] as string[],
    lugar: '',
  });

  const camposVacios = Object.values(formulario).some((valor) => {
    if (typeof valor === 'string') {
      if (valor.trim() === '' || seleccionados.length === 0 || puntos.length === 0) {
        return true;
      }
      return valor.trim() === '';
    }
    return false;
  });

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
      Swal.fire({
        title: 'Guardando agenda...',
        text: 'Por favor, espere mientras se guarda la agenda.',
        background: 'var(--background)',
        icon: 'info',
        color: '#fff',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

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

      
      Swal.close();
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

      
      Swal.close();
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
    
    const id_newAgenda = '47';

    const formularioPunto = new FormData();

    for (const punto of puntos) {
      formularioPunto.append('expositor', punto.expositor);
      formularioPunto.append('numeracion', punto.numeracion.toString());
      formularioPunto.append('tipo', punto.tipo);
      formularioPunto.append('duracionMin', parseInt(punto.duracion, 10).toString());
      formularioPunto.append('enunciado', punto.enunciado);
      formularioPunto.append('contenido', '');
      formularioPunto.append('agendaId', id_newAgenda.toString());
      for (const archivo of punto.archivos) {
        formularioPunto.append('archivos', archivo);
      }
    }
    fetch('http://localhost:8080/puntos/upload', {
      method: 'POST',
      body: formularioPunto,
    })
      .then(response => response.json())
      .then(data => console.log('Respuesta del servidor:', data))
      .catch(error => console.error('Error al enviar los datos:', error));


    console.log('Contenido del FormData:');
    for (const [key, value] of formularioPunto.entries()) {
      console.log(`${key}:`, value);
    }
  

    const formularioCompleto = new FormData();
    formularioCompleto.append('numero', formulario.numero);
    formularioCompleto.append('fechaHora', formulario.fechaHora);
    formularioCompleto.append('tipo', formulario.tipo);
    formularioCompleto.append('lugar', formulario.lugar);
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
    return () => {
      setPuntos([]);
    };
  }, []);

  const miembrosFiltrados = miembros.filter((m) =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleCheck = (id: number) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((selId) => selId !== id) : [...prev, id]
    );

    setFormulario((prevFormulario) => ({
      ...prevFormulario,
      convocados: seleccionados.includes(id)
        ? prevFormulario.convocados.filter((convId) => convId !== id.toString())
        : [...prevFormulario.convocados, id.toString()],
    }));
  };

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
        router.push('/agendaInicio'); // Navega a agendaInicio
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
          <h2>Crear Agenda</h2>
        </div>

        <div className={styles.formContainer}>
          <CrearAgendaForm
            formulario={formulario}
            tipoSesion={tipoSesion}
            puntos={puntos}
            miembrosFiltrados={miembrosFiltrados}
            seleccionados={seleccionados}
            busqueda={busqueda}
            loading={loading}
            handleChange={handleChange}
            handleGuardar={handleGuardar}
            handleCrear={handleCrear}
            handleCheck={handleCheck}
            setBusqueda={setBusqueda}
            handleOpenModal={handleOpenModal}
            handleCloseModal={handleCloseModal}
            setSeleccionados={setSeleccionados}
          />
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <CrearPuntoPage
            onClose={handleCloseModal}
            punto={puntoSeleccionado}
          />
        </Modal>
      )}
    </div>
  );
}