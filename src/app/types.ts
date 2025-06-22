export interface Miembro {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

export interface Agenda {
  id_Agenda: string;
  numero: string;
  fechaHora: string;
  tipo: string;
  convocados: string[];
  lugar: string;
  estadoId: number;
}

export interface Punto {
  id_Punto: number; 
  enunciado: string;
  duracion: string;
  tipo: string;
  expositor: string;
  archivos: File[];
  numeracion: number;
}

export interface Convocado {
    id_Convocado: string;
    Convocado: {
        nombre: string;
        email: string;
        telefono: string;
    };
}
