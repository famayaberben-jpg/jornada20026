import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  initDatabase,
  getAllJornadas,
  addJornada as addJornadaDb,
  updateJornada as updateJornadaDb,
  deleteJornadaById,
} from './DatabaseService';

const JornadaContext = createContext(null);

export function JornadaProvider({ children }) {
  const [jornadas, setJornadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getAllJornadas();
    setJornadas(data);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        await refresh();
      } catch (error) {
        console.error('Error inicializando la base de datos:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  const addJornada = useCallback(
    async (fecha, horasTrabajadas) => {
      await addJornadaDb(fecha, horasTrabajadas);
      await refresh();
    },
    [refresh]
  );

  const updateJornada = useCallback(
    async (id, fecha, horasTrabajadas) => {
      await updateJornadaDb(id, fecha, horasTrabajadas);
      await refresh();
    },
    [refresh]
  );

  const deleteJornada = useCallback(
    async (id) => {
      await deleteJornadaById(id);
      await refresh();
    },
    [refresh]
  );

  return (
    <JornadaContext.Provider
      value={{ jornadas, loading, addJornada, updateJornada, deleteJornada, refresh }}
    >
      {children}
    </JornadaContext.Provider>
  );
}

export function useJornada() {
  const context = useContext(JornadaContext);
  if (!context) {
    throw new Error('useJornada debe usarse dentro de un JornadaProvider');
  }
  return context;
}
