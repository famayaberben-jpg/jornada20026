import * as SQLite from 'expo-sqlite';
import { v4 as uuidv4 } from 'uuid';

const db = SQLite.openDatabase('jornadas.db');

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS jornadas (
            id TEXT PRIMARY KEY,
            fecha TEXT NOT NULL,
            horasTrabajadas REAL NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
          );`
        );
      },
      (error) => reject(error),
      () => resolve()
    );
  });
}

export function getAllJornadas() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM jornadas ORDER BY fecha DESC;',
          [],
          (_, { rows }) => resolve(rows._array)
        );
      },
      (error) => reject(error)
    );
  });
}

export function addJornada(fecha, horasTrabajadas) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const now = new Date().toISOString();
    db.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO jornadas (id, fecha, horasTrabajadas, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?);',
          [id, fecha, horasTrabajadas, now, now]
        );
      },
      (error) => reject(error),
      () => resolve({ id, fecha, horasTrabajadas, createdAt: now, updatedAt: now })
    );
  });
}

export function updateJornada(id, fecha, horasTrabajadas) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.transaction(
      (tx) => {
        tx.executeSql(
          'UPDATE jornadas SET fecha = ?, horasTrabajadas = ?, updatedAt = ? WHERE id = ?;',
          [fecha, horasTrabajadas, now, id]
        );
      },
      (error) => reject(error),
      () => resolve({ id, fecha, horasTrabajadas, updatedAt: now })
    );
  });
}

export function deleteJornadaById(id) {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('DELETE FROM jornadas WHERE id = ?;', [id]);
      },
      (error) => reject(error),
      () => resolve(id)
    );
  });
}
