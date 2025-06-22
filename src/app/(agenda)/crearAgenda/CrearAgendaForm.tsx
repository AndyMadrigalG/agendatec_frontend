import React, { useState, useEffect } from 'react';
import styles from './crearAgenda.module.css';
import Image from 'next/image';
import addIcon from '/public/addCircle.svg';
import editIcon from '/public/editIcon.svg';
import Swal from 'sweetalert2';
import { Punto } from './puntosContext';

interface Miembro {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

interface CrearAgendaFormProps {
  puntos: Punto[];
  setPuntos: React.Dispatch<React.SetStateAction<Punto[]>>;
  miembros: Miembro[];
  loading: boolean;
  onGuardar: (formulario: any) => void;
  onCrear: () => void;
  onOpenModal: (e: React.MouseEvent<HTMLButtonElement>, punto?: Punto) => void;
  seleccionados: number[];
  setSeleccionados: React.Dispatch<React.SetStateAction<number[]>>;
}

const CrearAgendaForm: React.FC<CrearAgendaFormProps> = ({
  puntos,
  setPuntos,
  miembros,
  loading,
  onGuardar,
  onCrear,
  onOpenModal,
  seleccionados,
  setSeleccionados,
}) => {
  const [formulario, setFormulario] = useState({
    numero: '',
    fechaHora: new Date().toISOString(),
    tipo: '',
    convocados: [] as string[],
    lugar: '',
    busqueda: '',
  });

  const tipoSesion = [
    { value: 'Ordinaria', label: 'Ordinaria' },
    { value: 'Extraordinaria', label: 'Extraordinaria' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

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

  const camposVacios = () => {
    const formularioVacio = Object.values(formulario).some((valor) => {
      if (typeof valor === 'string') {
        return valor.trim() === '';
      }
      return false;
    });

    return formularioVacio || seleccionados.length === 0 || puntos.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (camposVacios()) {
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

    onGuardar(formulario);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
            type="datetime-local"
            id="fechaHora"
            name="fechaHora"
            value={formulario.fechaHora}
            min={new Date().toISOString().slice(0, 16)}
            className={styles.fechaInput}
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
            {tipoSesion.map((tipo) => (
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
              <button
                key={index}
                className={styles.addPuntoButton}
                onClick={(e) => onOpenModal(e, punto)}
              >
                <Image src={editIcon} alt="Editar Punto" width={20} height={20} />
                <p>{punto.numeracion}. {punto.enunciado}</p>
              </button>
            ))}

            <button
              onClick={(e) => onOpenModal(e)}
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
            onChange={(e) => setFormulario({ ...formulario, busqueda: e.target.value })}
          />
          <div className={styles.listaMiembros}>
            {loading ? (
              <p>Cargando miembros...</p>
            ) : miembros.length === 0 ? (
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

                {miembros.map((m) => (
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
            <button type="submit" className={styles.guardarButton}>
              Guardar
            </button>
            <button type="button" className={styles.crearButton} onClick={onCrear}>
              Crear
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CrearAgendaForm;
