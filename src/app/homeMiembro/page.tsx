"use client";

import styles from "./homeMiembro.module.css";
import Image from "next/image";
import logo from "/public/logo.png";
import actasLogo from "/public/actas.png";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Notificaciones from "./(notificaciones)/notificaciones";
import notifIcon from '/public/notif.png'; 


// Change variable on .env for local testing with the backend
// otherwise is going to use the prod URL
const BACKEND_URL =
  process.env.BACKEND_URL ||
  "https://agendatec-backend-371160271556.us-central1.run.app";

const notificacionesEjemplo = [
  {
    emisor: "Administrador",
    destinatario: "Miembro",
    asunto: "Nueva sesión convocada",
    contenido:
      "Se ha convocado una nueva sesión para discutir los puntos pendientes.",
    fecha: "17-06-2025",
    hora: "01:39 PM",
    leida: false,
  },
  {
    emisor: "Administrador",
    destinatario: "Miembro",
    asunto: "Atender punto de la sesión X con fecha Y",
    contenido: "Por favor, revisa el punto 3 de la sesión del 20 de junio.",
    fecha: "15-06-2025",
    hora: "01:39 PM",
    leida: false,
  },
  {
    emisor: "Administrador",
    destinatario: "Miembro",
    asunto: "Nueva sesión convocada",
    contenido:
      "Se ha convocado una nueva sesión para discutir los puntos pendientes.",
    fecha: "11-06-2025",
    hora: "01:39 PM",
    leida: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [mostrarNotif, setMostrarNotif] = useState(false);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.principalContainer}>
      <Image className={styles.logo} src={logo} alt="logo" />

      <button onClick={() => setMostrarNotif(!mostrarNotif)} className={styles.notifButton}>
      <Image src={notifIcon} alt="Notificaciones" className={styles.notifImage} />
      <span className={styles.badge}>{notificacionesEjemplo.length}</span>
    </button>


      {/* Componente Notificaciones */}
      {mostrarNotif && (
        <Notificaciones
          datos={notificacionesEjemplo}
          onClose={() => setMostrarNotif(false)}
        />
      )}
      <div className={styles.container}>
        <h1 className={styles.title}>Inicio</h1>
        <div className={styles.menu}>
          <div
            className={styles.card}
            onClick={() => handleNavigation("/actas")}
          >
            <Image src={actasLogo} alt="Actas Logo" />
            <span>Actas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
