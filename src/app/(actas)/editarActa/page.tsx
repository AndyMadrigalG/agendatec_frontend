'use client';
import { useState } from 'react';
import styles from './editarActa.module.css';

type Punto = {
  id: number;
  titulo: string;
  tipo: string;
  enunciado: string;
  contenido: string;
  resultado?: string;
};

export default function ActaEditor() {
  const [acta, setActa] = useState({
    titulo: 'Acta 1',
    agenda: 'Agenda 1',
    fechaCreacion: '9 de Mayo del 2025'
  });

  const [puntos, setPuntos] = useState<Punto[]>([
    { 
      id: 1, 
      titulo: 'Punto 1', 
      tipo: 'Aprobación', 
      enunciado: 'Aprobación del presupuesto trimestral',
      contenido: '',
      resultado: '' 
    },
    { 
      id: 2, 
      titulo: 'Punto 2', 
      tipo: 'Informativo', 
      enunciado: 'Informe de actividades del mes anterior',
      contenido: '' 
    },
    { 
      id: 3, 
      titulo: 'Punto 3', 
      tipo: 'Estrategia', 
      enunciado: 'Plan de expansión para el próximo año',
      contenido: '' 
    },
    { 
      id: 4, 
      titulo: 'Punto 4', 
      tipo: 'Varios', 
      enunciado: 'Otros asuntos generales',
      contenido: '' 
    },
    { 
      id: 5, 
      titulo: 'Punto 5', 
      tipo: 'Aprobación', 
      enunciado: 'Nombramiento de nuevo director',
      contenido: '',
      resultado: '' 
    },
  ]);

  const [activoId, setActivoId] = useState<number | null>(null);
  const [editando, setEditando] = useState<number | null>(null);
  const [borradores, setBorradores] = useState<Record<number, Partial<Punto>>>({});

  const togglePunto = (id: number) => {
    setActivoId(activoId === id ? null : id);
    setEditando(null);
  };

  const iniciarEdicion = (id: number) => {
    setEditando(id);
    if (!borradores[id]) {
      const punto = puntos.find(p => p.id === id);
      setBorradores(prev => ({ ...prev, [id]: { ...punto } }));
    }
  };

  const handleChange = (id: number, field: string, value: string) => {
    setBorradores(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const guardarPunto = (id: number) => {
    setPuntos(prev => prev.map(p => 
      p.id === id ? { ...p, ...borradores[id] } : p
    ));
    setEditando(null);
  };

  const cancelarEdicion = (id: number) => {
    setEditando(null);
    const { [id]: _, ...rest } = borradores;
    setBorradores(rest);
  };

  return (
    <div className={styles.container}>
      <div className={styles.encabezadoContainer}>
        <h1 className={styles.tituloPrincipal}>Modificación de Acta</h1>
        
        <div className={styles.datosActa}>
          <strong className={styles.tituloActa}>{acta.titulo}</strong>
          <span className={styles.infoActa}>
            {acta.agenda} - Fecha de creación: {acta.fechaCreacion}
          </span>
        </div>

        <div className={styles.separador}></div>
      </div>
      <div className={styles.actaContainer}>
        {puntos.map((punto) => (
          <div key={punto.id} className={styles.puntoCard}>
            <div 
              className={styles.puntoHeader}
              onClick={() => togglePunto(punto.id)}
            >
              <div className={styles.tituloContainer}>
                <h2>{punto.titulo} ({punto.tipo}) </h2>
              </div>
              <span className={styles.flecha}>
                {activoId === punto.id ? '▲' : '▼'}
              </span>
            </div>

            {activoId === punto.id && (
              <div className={styles.puntoContent}>
                <div className={styles.enunciadoContainer}>
                  <h3 className={styles.subtitulo}>Enunciado</h3>
                  <div className={styles.enunciadoTexto}>
                    {punto.enunciado}
                  </div>
                </div>

                {editando === punto.id ? (
                  <div className={styles.editor}>
                    <div className={styles.campo}>
                      <label>Contenido:</label>
                      <textarea
                        value={borradores[punto.id]?.contenido || punto.contenido}
                        onChange={(e) => handleChange(punto.id, 'contenido', e.target.value)}
                        className={styles.textarea}
                      />
                    </div>

                    {punto.tipo === 'Aprobación' && (
                      <div className={styles.campo}>
                        <label>Resultado:</label>
                        <select
                          value={borradores[punto.id]?.resultado || punto.resultado || ''}
                          onChange={(e) => handleChange(punto.id, 'resultado', e.target.value)}
                          className={styles.select}
                        >
                          <option value="">Seleccione...</option>
                          <option value="aprobado">Aprobado</option>
                          <option value="rechazado">Rechazado</option>
                        </select>
                      </div>
                    )}

                    <div className={styles.botonesEdicion}>
                      <button 
                        onClick={() => cancelarEdicion(punto.id)}
                        className={styles.botonSecundario}
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={() => guardarPunto(punto.id)}
                        className={styles.botonPrimario}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.contenido}>
                      {punto.contenido || <span className={styles.vacio}>No se ha agregado contenido aún</span>}
                    </div>
                    {punto.tipo === 'Aprobación' && punto.resultado && (
                      <div className={styles.resultado}>
                        <strong>Resultado:</strong> <span className={styles[punto.resultado]}>{punto.resultado}</span>
                      </div>
                    )}
                    <button 
                      onClick={() => iniciarEdicion(punto.id)}
                      className={styles.botonEditar}
                    >
                      Editar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.botonesAccion}>
        <button className={styles.botonCancelar}>Cancelar Acta</button>
        <button className={styles.botonGuardar}>Guardar Acta</button>
      </div>
    </div>
  );
}