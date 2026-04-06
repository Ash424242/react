# Arquitectura final · Módulo 3

Este documento resume cómo el tipado estático de TypeScript, aplicado junto a React, reduce la probabilidad de errores en tiempo de ejecución respecto a una implementación equivalente en JavaScript sin tipos.

## Genéricos y tabla de datos

El componente `DataTable<T>` parametriza el tipo de cada fila. Las columnas declaran `clave: keyof T`, de modo que solo pueden referirse a propiedades reales de la entidad. Si se renombra un campo en el modelo, el compilador señala todas las columnas y vistas que deban actualizarse, evitando referencias silenciosamente rotas que en JavaScript solo fallarían al ejecutar la interfaz.

Al separar el tipo de fila (`T`) del contrato de columnas (`ColumnaTabla<T>`), la tabla permanece reutilizable para otros modelos (por ejemplo, asignaturas o resúmenes) sin duplicar lógica de presentación.

## Unión discriminada y dominio académico

El estado de matrícula se modela como una unión discriminada (`EstadoMatricula`) con el campo `tipo` como discriminante. Cada variante lleva únicamente los datos que tienen sentido para ese estado: las asignaturas en curso solo existen cuando la matrícula está activa; el motivo de suspensión no aparece como campo opcional ambiguo en todos los casos.

En JavaScript sería habitual usar un único objeto con muchas propiedades opcionales y decidir en la interfaz con comprobaciones frágiles. Eso abre la puerta a estados imposibles (por ejemplo, nota media y motivo de suspensión rellenados a la vez) que el sistema de tipos rechaza de forma temprana.

## Exhaustividad con `never`

La función `generarReporte` evalúa todas las variantes en un `switch` y cierra el flujo con un `default` que asigna el valor restante a una variable de tipo `never`. Si en el futuro se añade un nuevo literal al discriminante y se olvida un `case`, el compilador produce un error en lugar de degradar el comportamiento en producción.

Ese patrón es especialmente valioso cuando varios equipos tocan el mismo dominio: el fallo aparece en compilación, no como un informe incompleto en pantalla.

## Tipos de utilidad y edición parcial

La edición en línea de una fila mantiene un borrador con tipo `Partial<T>`. Así se expresa de manera explícita que el usuario puede haber modificado solo un subconjunto de campos antes de guardar, coherente con operaciones tipo «parche» sobre el modelo.

Sin `Partial`, habría que inventar estructuras paralelas o relajar el tipado con valores vacíos ficticios, lo que vuelve más difícil distinguir entre «no tocado» y «borrado a propósito».

## Integración de una librería de fechas

La utilidad `diasEntreFechas` encapsula `date-fns` con firma estricta `Date` → `number`. Las entradas y salidas están acotadas; no se mezclan cadenas con formatos heterogéneos ni instancias inválidas sin que el llamador sea consciente del contrato.

En JavaScript puro, pasar accidentalmente un `string` o un número de milisegundos mal interpretado suele producir `NaN` o diferencias silenciosamente erróneas.

## Conclusión

La combinación de genéricos, uniones discriminadas, comprobación de exhaustividad y tipos de utilidad establece contratos que el compilador vigila en cada cambio. El coste es mayor declaración de tipos al principio; el beneficio es menos incertidumbre en tiempo de ejecución, sobre todo en componentes de interfaz donde muchos errores de JavaScript tradicional solo se manifiestan ante interacciones concretas del usuario.
