import type { EstadoMatricula } from './types';

/**
 * Genera una descripción textual del estado de matrícula.
 * El bloque `default` con `never` obliga a actualizar esta función si se amplía la unión discriminada.
 */
export function generarReporte(estado: EstadoMatricula): string {
  switch (estado.tipo) {
    case 'ACTIVA': {
      const nombres = estado.asignaturas.map((a) => a.nombre).join(', ');
      return `Matrícula activa con ${estado.asignaturas.length} asignatura(s): ${nombres || 'sin asignaturas registradas'}.`;
    }
    case 'SUSPENDIDA':
      return `Matrícula suspendida. Motivo: ${estado.motivoSuspension}`;
    case 'FINALIZADA':
      return `Matrícula finalizada. Nota media: ${estado.notaMedia.toFixed(2)}.`;
    default: {
      const comprobacionExhaustiva: never = estado;
      throw new Error(
        `Estado de matrícula no contemplado: ${String(comprobacionExhaustiva)}`,
      );
    }
  }
}
