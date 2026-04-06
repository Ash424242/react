import { type ReactNode, useCallback, useMemo, useState } from 'react';

export interface ColumnaTabla<T> {
  /** Clave de la fila cuyo valor se muestra en la celda. */
  clave: keyof T;
  encabezado: string;
  /** Si es false, la celda no se edita en línea (p. ej. fechas complejas). Por defecto: true. */
  editableEnLinea?: boolean;
  /** Opcional: formato personalizado del valor. */
  formatear?: (valor: T[keyof T], fila: T) => ReactNode;
}

export interface DataTableProps<T> {
  datos: readonly T[];
  columnas: readonly ColumnaTabla<T>[];
  obtenerClaveFila: (fila: T) => string;
  /** Invocado al guardar con la fila original y los campos editables aplicados desde el borrador. */
  alGuardarFila?: (filaOriginal: T, cambios: Partial<T>) => void;
  etiquetaAccionEditar?: string;
  etiquetaAccionGuardar?: string;
  etiquetaAccionCancelar?: string;
}

/**
 * Tabla genérica de datos con edición en línea.
 * El borrador de edición usa `Partial<T>` porque el usuario puede cambiar solo algunos campos antes de guardar.
 */
export function DataTable<T extends Record<string, unknown>>({
  datos,
  columnas,
  obtenerClaveFila,
  alGuardarFila,
  etiquetaAccionEditar = 'Editar',
  etiquetaAccionGuardar = 'Guardar',
  etiquetaAccionCancelar = 'Cancelar',
}: DataTableProps<T>) {
  const [claveEdicion, setClaveEdicion] = useState<string | null>(null);
  const [borradorEdicion, setBorradorEdicion] = useState<Partial<T>>({});

  const clavesColumnaEditables = useMemo(() => {
    const s = new Set<string>();
    for (const c of columnas) {
      if (c.editableEnLinea !== false) s.add(String(c.clave));
    }
    return s;
  }, [columnas]);

  const iniciarEdicion = useCallback(
    (fila: T) => {
      const clave = obtenerClaveFila(fila);
      setClaveEdicion(clave);
      const inicial: Partial<T> = {};
      for (const col of columnas) {
        if (col.editableEnLinea === false) continue;
        const k = col.clave;
        inicial[k] = fila[k];
      }
      setBorradorEdicion(inicial);
    },
    [columnas, obtenerClaveFila],
  );

  const cancelarEdicion = useCallback(() => {
    setClaveEdicion(null);
    setBorradorEdicion({});
  }, []);

  const actualizarCampoBorrador = useCallback(
    (clave: keyof T, valor: string) => {
      setBorradorEdicion((prev) => ({
        ...prev,
        [clave]: valor as T[keyof T],
      }));
    },
    [],
  );

  const guardarEdicion = useCallback(
    (filaOriginal: T) => {
      const cambios: Partial<T> = {};
      for (const col of columnas) {
        if (col.editableEnLinea === false) continue;
        const k = col.clave;
        if (borradorEdicion[k] !== undefined) {
          cambios[k] = borradorEdicion[k];
        }
      }
      alGuardarFila?.(filaOriginal, cambios);
      setClaveEdicion(null);
      setBorradorEdicion({});
    },
    [alGuardarFila, borradorEdicion, columnas],
  );

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={String(col.clave)} scope="col">
                {col.encabezado}
              </th>
            ))}
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((fila) => {
            const claveFila = obtenerClaveFila(fila);
            const enEdicion = claveEdicion === claveFila;

            return (
              <tr key={claveFila}>
                {columnas.map((col) => {
                  const valorOriginal = fila[col.clave];
                  const mostrar = col.formatear
                    ? col.formatear(valorOriginal, fila)
                    : String(valorOriginal ?? '');

                  const editable =
                    enEdicion &&
                    clavesColumnaEditables.has(String(col.clave));

                  return (
                    <td key={String(col.clave)}>
                      {editable ? (
                        <input
                          className="data-table-input"
                          type="text"
                          aria-label={`${col.encabezado} para fila ${claveFila}`}
                          value={String(borradorEdicion[col.clave] ?? '')}
                          onChange={(e) =>
                            actualizarCampoBorrador(col.clave, e.target.value)
                          }
                        />
                      ) : (
                        mostrar
                      )}
                    </td>
                  );
                })}
                <td>
                  {enEdicion ? (
                    <div className="data-table-actions">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => guardarEdicion(fila)}
                      >
                        {etiquetaAccionGuardar}
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={cancelarEdicion}
                      >
                        {etiquetaAccionCancelar}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn"
                      onClick={() => iniciarEdicion(fila)}
                    >
                      {etiquetaAccionEditar}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
