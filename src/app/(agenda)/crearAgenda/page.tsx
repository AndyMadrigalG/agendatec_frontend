'use client';

import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import editIcon from '/public/editIcon.svg';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter, usePathname } from 'next/navigation';

const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function CrearAgendaPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [miembros, setMiembros] = useState<{ id: number; nombre: string }[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [modalidad, setModalidad] = useState('Presencial');
  const [juntaDirectiva, setJuntaDirectiva] = useState(true);
  const [otrosConvocados, setOtrosConvocados] = useState('');
  const [puntos, setPuntos] = useState<any[]>([]);

  const tipoSesion = [
    { value: 'ordinaria', label: 'Ordinaria' },
    { value: 'extraordinaria', label: 'Extraordinaria' }
  ];
  const modalidades = ['Presencial', 'Remota', 'Híbrida'];

  const [formulario, setFormulario] = useState({
    numeroSession: '',
    fecha: '',
    tipo: '',
    lugar: '',
  });

  const camposVacios = Object.values(formulario).some((valor) =>
    typeof valor === 'string' && valor.trim() === ''
  ) || (!juntaDirectiva && otrosConvocados.trim() === '');

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
        text: 'Complete todos los campos y la convocatoria.',
        confirmButtonColor: '#7b6ef6',
        background: 'var(--background)',
        color: '#f9fafb',
      });
      return;
    }

    Swal.fire({
      title: 'Guardando agenda...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
      background: 'var(--background)',
      color: '#f9fafb',
    });

    try {
      const puntosGuardados = JSON.parse(localStorage.getItem('puntosAgenda') || '[]');

      const nuevaAgenda = {
        numero: formulario.numeroSession,
        tipo: formulario.tipo === 'ordinaria' ? 'SessionType.Ordinaria' : 'SessionType.Extraordinaria',
        fechaHora: new Date(formulario.fecha).toISOString(),
        modalidad: modalidad === 'Presencial' ? 'Modalidad.Presencial' : 'Modalidad.Virtual',
        lugar: formulario.lugar,
        link: '',
        convocarMiembros: juntaDirectiva ? seleccionados : otrosConvocados,
        juntaDirectiva,
        puntos: puntosGuardados,
      };

      const res = await fetch(`${BACKEND_URL}/agendas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaAgenda),
      });

      if (!res.ok) throw new Error('Fallo al guardar');

      localStorage.removeItem('puntosAgenda');
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'Agenda creada con éxito',
        confirmButtonColor: '#7b6ef6',
      }).then(() => router.push('/agendaInicio'));

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar agenda',
        text: 'No se pudo conectar al backend.',
        confirmButtonColor: '#7b6ef6',
      });
    }
  };

  useEffect(() => {
    const cargarMiembros = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/usuarios/miembros-junta`);
        const data = await res.json();
        setMiembros(data);
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar miembros',
          text: 'No se pudieron obtener los miembros.',
        });
      } finally {
        setLoading(false);
      }
    };

    cargarMiembros();

    const puntosGuardados = localStorage.getItem('puntosAgenda');
    if (puntosGuardados) {
      try {
        setPuntos(JSON.parse(puntosGuardados));
      } catch {
        setPuntos([]);
      }
    }
  }, []);

  const handleCheck = (id: number) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.menu}>
        <h2>Crear Agenda</h2>
      </div>

      <div className={styles.formContainer}>
        <form className={styles.form}>
          <div className={styles.formColumns}>
            <div className={`${styles.columna} ${styles.izquierda}`}>
              <label>Número:</label>
              <input name="numeroSession" value={formulario.numeroSession} onChange={handleChange} />

              <label>Fecha:</label>
              <input type="date" name="fecha" value={formulario.fecha} onChange={handleChange} />

              <label>Tipo:</label>
              <select name="tipo" value={formulario.tipo} onChange={handleChange}>
                <option value="">Seleccionar tipo</option>
                {tipoSesion.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>

              <label>Modalidad:</label>
              <select value={modalidad} onChange={e => setModalidad(e.target.value)}>
                {modalidades.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <label>Lugar / Link de la sesión:</label>
              <input name="lugar" value={formulario.lugar} onChange={handleChange} />

              <label>Puntos:</label>
              <div className={styles.listaPuntos}>
                {puntos.map((punto, index) => (
                  <button key={index} className={styles.addPuntoButton}>
                    <Image src={editIcon} alt="Editar Punto" width={20} height={20} />
                    {punto.titulo || `Punto ${index + 1}`}
                  </button>
                ))}
                <button onClick={handleCrearPunto} className={styles.addPuntoButton}>
                  <Image src={addIcon} alt="Agregar" width={20} height={20} />
                  Agregar Punto
                </button>
              </div>
            </div>

            <div className={`${styles.columna} ${styles.derecha}`}>
              <label>Convocar miembros:</label>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  <input
                    type="radio"
                    name="convocarTipo"
                    checked={juntaDirectiva}
                    onChange={() => setJuntaDirectiva(true)}
                  />
                  {' '} Miembros de la Junta Directiva
                </label>
                <br />
                <label>
                  <input
                    type="radio"
                    name="convocarTipo"
                    checked={!juntaDirectiva}
                    onChange={() => setJuntaDirectiva(false)}
                  />
                  {' '} Otros:
                </label>
                {!juntaDirectiva && (
                  <input
                    type="text"
                    placeholder="correo1, correo2..."
                    value={otrosConvocados}
                    onChange={e => setOtrosConvocados(e.target.value)}
                  />
                )}
              </div>

              <div className={styles.botonesContainer}>
                <button onClick={handleGuardar} className={styles.guardarButton}>Guardar</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
