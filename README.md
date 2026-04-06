# Repositorio React · Práctica 4 (Módulo 3)

Aplicación de ejemplo con **React**, **TypeScript** y **Vite**: gestión académica con tabla genérica tipada, modelo de dominio con unión discriminada y utilidades de fechas.

## Requisitos

- Node.js LTS reciente
- npm

## Instalación y ejecución

```bash
npm install
npm run dev
```

La interfaz estará disponible en la URL que indique la consola (por defecto `http://localhost:5173`).

## Comprobación de tipos

El entregable exige tipado estricto sin errores de compilación:

```bash
npx tsc --noEmit
```

## Estructura principal

- `src/components/DataTable.tsx` — Tabla genérica `DataTable<T>` con borrador de edición `Partial<T>`.
- `src/domain/types/` — Entidades del dominio y `EstadoMatricula` (unión discriminada).
- `src/domain/generarReporte.ts` — Informe textual con análisis exhaustivo (`never` en el `default`).
- `src/utils/diferenciaDias.ts` — Diferencia en días entre dos `Date` mediante `date-fns`.
- `docs/arquitectura-final.md` — Notas de arquitectura y justificación del tipado.

## Documentación adicional

Ver `docs/arquitectura-final.md` para el razonamiento sobre genéricos, uniones discriminadas, exhaustividad y tipos de utilidad.

## Licencia

Uso académico según las directrices de la asignatura.
