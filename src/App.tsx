import { useCallback, useMemo, useState } from 'react';
import { DataTable, type ColumnaTabla } from './components/DataTable';
import type { Asignatura, Estudiante, EstadoMatricula } from './domain/types';
import { generarReporte } from './domain/generarReporte';
import { diasEntreFechas } from './utils/diferenciaDias';
import './App.css';

function crearEstadoDemostracion(): EstadoMatricula {
  const asignaturas: Asignatura[] = [
    { id: 'asg-1', nombre: 'Programación concurrente', creditos: 6 },
    { id: 'asg-2', nombre: 'Bases de datos avanzadas', creditos: 6 },
  ];
  return { tipo: 'ACTIVA', asignaturas };
}

export default function App() {
  const hoy = useMemo(() => new Date(), []);
  const inicioCurso = useMemo(
    () => new Date(hoy.getFullYear(), 8, 1),
    [hoy],
  );

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>(() => [
    {
      id: 'est-101',
      nombreCompleto: 'Elena Martínez Ruiz',
      email: 'elena.martinez@universidad.edu',
      fechaMatricula: new Date(hoy.getFullYear(), 0, 15),
    },
    {
      id: 'est-102',
      nombreCompleto: 'Jon García López',
      email: 'jon.garcia@universidad.edu',
      fechaMatricula: new Date(hoy.getFullYear(), 3, 2),
    },
  ]);

  const [estadoMatricula] = useState<EstadoMatricula>(crearEstadoDemostracion);

  const diasDesdeMatricula = useMemo(
    () =>
      estudiantes.map((e) => ({
        id: e.id,
        nombre: e.nombreCompleto,
        dias: diasEntreFechas(e.fechaMatricula, hoy),
      })),
    [estudiantes, hoy],
  );

  const textoReporte = useMemo(
    () => generarReporte(estadoMatricula),
    [estadoMatricula],
  );

  const columnasEstudiante = useMemo<
    readonly ColumnaTabla<Estudiante>[]
  >(
    () => [
      {
        clave: 'nombreCompleto',
        encabezado: 'Nombre completo',
      },
      {
        clave: 'email',
        encabezado: 'Correo electrónico',
      },
      {
        clave: 'fechaMatricula',
        encabezado: 'Fecha de matrícula',
        editableEnLinea: false,
        formatear: (v) =>
          v instanceof Date
            ? v.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : String(v ?? ''),
      },
    ],
    [],
  );

  const alGuardarFila = useCallback(
    (filaOriginal: Estudiante, cambios: Partial<Estudiante>) => {
      setEstudiantes((prev) =>
        prev.map((f) =>
          f.id === filaOriginal.id ? { ...f, ...cambios } : f,
        ),
      );
    },
    [],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestión académica universitaria</h1>
        <p className="app-lead">
          Laboratorio de interfaz con tipado estricto: tabla genérica, unión
          discriminada y utilidades de fecha.
        </p>
      </header>

      <main className="app-main">
        <section className="panel" aria-labelledby="titulo-reporte">
          <h2 id="titulo-reporte">Reporte de matrícula</h2>
          <p className="panel-texto">{textoReporte}</p>
        </section>
        <section className="panel" aria-labelledby="titulo-calendario">
          <h2 id="titulo-calendario">Referencia de curso</h2>
          <p className="panel-texto">
            Desde el inicio de curso ({inicioCurso.toLocaleDateString('es-ES')}
            ) hasta hoy han transcurrido{' '}
            <strong>{diasEntreFechas(inicioCurso, hoy)}</strong> días
            (date-fns, cálculo por días de calendario).
          </p>
        </section>

        <section className="panel" aria-labelledby="titulo-antiguedad">
          <h2 id="titulo-antiguedad">Antigüedad desde la matrícula</h2>
          <ul className="lista-metricas">
            {diasDesdeMatricula.map((d) => (
              <li key={d.id}>
                <span className="lista-metricas-nombre">{d.nombre}</span>
                <span className="lista-metricas-valor">
                  {d.dias} días hasta la fecha de referencia
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel panel-tabla" aria-labelledby="titulo-tabla">
          <h2 id="titulo-tabla">Estudiantes</h2>
          <p className="panel-hint">
            La edición en línea mantiene un borrador tipado como{' '}
            <code>Partial&lt;Estudiante&gt;</code> hasta confirmar los cambios.
          </p>
          <DataTable<Estudiante>
            datos={estudiantes}
            columnas={columnasEstudiante}
            obtenerClaveFila={(e) => e.id}
            alGuardarFila={alGuardarFila}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>Práctica · Módulo 3 · React, TypeScript y Vite</p>
      </footer>
    </div>
  );
}
