import type { Asignatura } from './asignatura';

export interface MatriculaActiva {
  tipo: 'ACTIVA';
  asignaturas: Asignatura[];
}

export interface MatriculaSuspendida {
  tipo: 'SUSPENDIDA';
  motivoSuspension: string;
}

export interface MatriculaFinalizada {
  tipo: 'FINALIZADA';
  notaMedia: number;
}

export type EstadoMatricula =
  | MatriculaActiva
  | MatriculaSuspendida
  | MatriculaFinalizada;
