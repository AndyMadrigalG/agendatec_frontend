import styles from './agendaInicio.module.css';

export default function AgendaPage() {
    return (
        <div>
            <div className={styles.mainContainer}>
                <div className={styles.menu}>
                    <h2>Agendas</h2>
                    <div className={styles.derecha}>
                        <h3>Buscar</h3>
                        <button>Crear Agenda</button>
                    </div>
                </div>

                <div className={styles.agendasContainer}>
                    <div className={styles.agendaBox}>
                        <h3>Agenda 1</h3>
                        <div className={styles.agendaDerecha}>
                            <p>Editar</p>
                            <p>Descargar</p>
                        </div>
                        
                    </div>
                    
                </div>

                


            </div>
        </div>
    );
}
