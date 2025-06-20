'use client';

import React, { createContext, useContext, useState } from 'react';

interface Punto {
  enunciado: string;
  duracion: string;
  tipo: string;
  expositor: string;
  archivos: File[];
  numeracion: number;
}

interface PuntosContextProps {
  puntos: Punto[];
  agregarPunto: (punto: Omit<Punto, 'numeracion'>) => void;
  setPuntos: (puntos: Punto[]) => void; // Agregar setPuntos al contexto
}

const PuntosContext = createContext<PuntosContextProps | undefined>(undefined);

export const PuntosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [puntos, setPuntos] = useState<Punto[]>([]);

  const agregarPunto = (punto: Omit<Punto, 'numeracion'>) => {
    const nuevoPunto = {
      ...punto,
      numeracion: puntos.length + 1, 
    };
    setPuntos((prev) => [...prev, nuevoPunto]);
  };

  return (
    <PuntosContext.Provider value={{ puntos, agregarPunto, setPuntos }}>
      {children}
    </PuntosContext.Provider>
  );
};

export const usePuntos = () => {
  const context = useContext(PuntosContext);
  if (!context) {
    throw new Error('usePuntos debe ser usado dentro de PuntosProvider');
  }
  return context;
};