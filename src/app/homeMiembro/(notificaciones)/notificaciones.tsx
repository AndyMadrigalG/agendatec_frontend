import styles from "./notificaciones.module.css";
import { useState } from "react";
import Image from "next/image";
import trashIcon from "/public/trash.png";

interface Notificacion {
  emisor: string;
  destinatario: string;
  asunto: string;
  contenido: string;
  fecha: string;
  hora: string;
  leida?: boolean;
}

export default function notificaciones({
  onClose,
  datos,
}: {
  onClose: () => void;
  datos: Notificacion[];
}) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(datos);

  const marcarComoLeida = (index: number) => {
    const nuevas = [...notificaciones];
    nuevas[index].leida = true;
    setNotificaciones(nuevas);
  };

  const eliminarNotificacion = (index: number) => {
    const nuevas = [...notificaciones];
    nuevas.splice(index, 1);
    setNotificaciones(nuevas);
  };

  const vaciarBuzon = () => {
    setNotificaciones([]);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.header}>
        <span className={styles.title}>Notificaciones</span>
        <button onClick={vaciarBuzon} className={styles.clearBtn}>
          <Image
            src={trashIcon}
            alt="Vaciar buzón"
            width={16}
            height={16}
            className={styles.clearIcon}
          />
          <span>Vaciar buzón</span>
        </button>
      </div>

      {notificaciones.map((n: Notificacion, i: number) => (
        <div
          key={i}
          className={`${styles.notification} ${n.leida ? styles.leida : ""}`}
          onClick={() => marcarComoLeida(i)}
        >
          <div className={styles.notiHeader}>
            <strong>{n.emisor}</strong>
            <button
              className={styles.xBtn}
              onClick={(e) => {
                e.stopPropagation(); // evita marcar como leída si se hace click en ✕
                eliminarNotificacion(i);
              }}
            >
              ✕
            </button>
          </div>
          <div>{n.asunto}</div>
          <small>
            {n.fecha} - {n.hora}
          </small>
        </div>
      ))}

      {notificaciones.length === 0 && (
        <div className={styles.vacio}>No hay notificaciones.</div>
      )}
    </div>
  );
}
