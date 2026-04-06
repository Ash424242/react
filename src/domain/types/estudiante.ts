export interface Estudiante {
  readonly id: string;
  nombreCompleto: string;
  email: string;
  /** Fecha de alta académica (para cálculos con utilidades de fechas). */
  fechaMatricula: Date;
}
