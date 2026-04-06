import { differenceInCalendarDays } from 'date-fns';

/**
 * Diferencia en días calendario entre dos fechas (inicio → fin).
 * Orden coherente con date-fns: cuenta días completos desde fechaInicio hasta fechaFin.
 */
export function diasEntreFechas(fechaInicio: Date, fechaFin: Date): number {
  return differenceInCalendarDays(fechaFin, fechaInicio);
}
