'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './crearPunto.module.css';
import Swal from 'sweetalert2';

const BACKEND_URL = process.env.BACKEND_URL || 'https://agendatec-backend-371160271556.us-central1.run.app';

export default function CrearPuntoPage() {
  const router = useRouter();

  const tipos = [
    { value: 'informativo', label: 'Informativo' },
    { value: 'discusion', label: 'Discusión' },
    { value: 'decisional', label: 'Decisional' },
  ];

  const [titulo, setTitulo] = useState('');
  const [duracion, setDuracion] = useState('');
  const [tipo, setTipo] = useState('');
  const [archivos, setArchivos] = useState<File[]>([]);
  const [expositor, setExpositor] = useState('');
  const [personas, setPersonas] = useState<{ value: string; label: string }[]>([]);

  const camposVacios = !titulo.trim() || !duracion.trim() || !tipo.trim() || !expositor.trim();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/usuarios`);
        const data = await res.json();
        setPersonas(data.map((u: any) => ({ value: u.id, label: u.nombre })));
      } catch {
        setPersonas([]);
      }
    };
    fetchPersonas();
  }, []);

  const handleCancelar = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: '¿Cancelar?',
      text: '¿Desea cancelar la creación del punto?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar',
    }).then(result => {
      if (result.isConfirmed) router.push('/crearAgenda');
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (camposVacios) {
      Swal.fire({
        icon: 'error',
        title: 'Campos vacíos',
        text: 'Complete todos los campos.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('duracionMin', duracion);
    formData.append('tipo', tipo);
    formData.append('expositorId', expositor);

    archivos.forEach(file => formData.append('archivos', file));

    Swal.fire({ title: 'Creando punto...', didOpen: () => Swal.showLoading() });

    try {
      const res = await fetch(`${BACKEND_URL}/puntos`, {
        method: 'POST',
        body: formData,
      });

      const punto = await res.json();
      const almacenados = JSON.parse(localStorage.getItem('puntosAgenda') || '[]');
      localStorage.setItem('puntosAgenda', JSON.stringify([...almacenados, punto]));

      Swal.close();
      Swal.fire({ icon: 'success', title: 'Punto creado' }).then(() => {
        router.push('/crearAgenda');
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Error al guardar el punto' });
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.menu}><h2>Crear Punto</h2></div>
      <div className={styles.formContainer}>
        <form className={styles.form}>
          <div className={styles.columna}>
            <label>Título</label>
            <input value={titulo} onChange={e => setTitulo(e.target.value)} />

            <label>Expositor</label>
            <select value={expositor} onChange={e => setExpositor(e.target.value)}>
              <option value="">Seleccione</option>
              {personas.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>

            <label>Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="">Seleccione</option>
              {tipos.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.columna}>
            <label>Duración (minutos)</label>
            <input type="number" value={duracion} onChange={e => setDuracion(e.target.value)} />

            <label>Archivos (opcional)</label>
            <input type="file" multiple onChange={e => {
              if (e.target.files) setArchivos(Array.from(e.target.files));
            }} />

            <div className={styles.botonContainer}>
              <button className={styles.cancelarButton} onClick={handleCancelar}>Cancelar</button>
              <button className={styles.crearButton} onClick={handleSubmit}>Crear</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
