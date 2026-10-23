# Estantería Común — Tarea 2

**Autor:** Daniel Campos Sánchez  
**Curso:** Programación Web Avanzada

El proyecto implementa dos aplicaciones para un club de lectura:
un buscador desarrollado con JavaScript y un tablero desarrollado
con React.

## Requisitos

- Node.js 22.13.0 o superior.
- npm.
- Navegador moderno.
- Conexión a Internet para instalar dependencias y utilizar las
  APIs del buscador.

Cada aplicación administra sus propias dependencias y comandos.
Ejecute los comandos desde la carpeta indicada.

## Buscador con JavaScript

### Instalación y ejecución

Desde la raíz del repositorio:

```bash
cd buscador-js
npm ci
npm run build:css
npm run dev
```

Abra:

http://127.0.0.1:4173

El CSS se genera a partir de Sass y está excluido del repositorio.
Por eso es necesario ejecutar `npm run build:css` después de instalar
las dependencias.

Para recompilar automáticamente al modificar Sass, abre otra terminal
en `buscador-js` y ejecuta:

```bash
npm run watch:css
```

Mantenga el servidor de desarrollo ejecutándose en la primera terminal.

### Funcionalidades

- Consulta de libros en Open Library al enviar el formulario.
- Estados de carga, error, ausencia de resultados y resultados.
- Tarjetas con información del libro y modal de detalles.
- Portada de respaldo cuando no hay una imagen disponible.
- Lista de lecturas en memoria, sin duplicados.
- Cambio de estado entre Pendiente, Leyendo y Leído.
- Eliminación de lecturas con animaciones mediante clases CSS.
- Formulario de propuestas con autores dinámicos y validación.
- Envío simulado de propuestas mediante JSONPlaceholder.

La búsqueda y el envío de propuestas requieren conexión a Internet.
JSONPlaceholder simula el registro: no almacena permanentemente
las propuestas enviadas.

La lista de lecturas se conserva únicamente durante la sesión
de la página y se reinicia al recargar.

### Organización

- `js/api.js`: comunicación con las APIs.
- `js/search.js`: interacción del formulario de búsqueda.
- `js/render.js`: representación de resultados y detalles.
- `js/reading-state.js`: estado de las lecturas.
- `js/readings.js`: coordinación de eventos de la lista.
- `js/reading-render.js`: representación de las lecturas.
- `js/proposal-form.js`: validación y envío de propuestas.
- `js/proposal-authors.js`: campos dinámicos de autores.
- `scss/`: personalización de Bootstrap y estilos propios.
- `assets/`: recursos locales.

## Tablero con React

### Instalación y ejecución

Desde la raíz del repositorio, en otra terminal:

```bash
cd tablero-react
npm ci
npm run dev
```

Abra la dirección que indique Vite en la terminal.

Vite procesa los archivos Sass importados por la aplicación;
no es necesario ejecutar un comando separado para generar CSS.

### Funcionalidades

- Colección inicial cargada desde módulos locales.
- Formulario controlado para agregar libros y asignar un miembro.
- Validación por campo.
- Cambio de estado y eliminación de libros.
- Filtros combinados por estado y miembro.
- Resumen calculado a partir de los libros filtrados.
- Mensajes para una colección vacía o filtros sin coincidencias.
- Interfaz adaptable a diferentes tamaños de pantalla.

El tablero no consulta APIs. Los cambios se mantienen en memoria
y se reinician al recargar la página.

### Organización

- `src/components/layout/`: estructura compartida de la interfaz.
- `src/components/forms/`: formulario de libros.
- `src/components/readings/`: tablero, filtros, resumen y tarjetas.
- `src/data/`: libros, miembros y estados iniciales.
- `src/validation/`: reglas de validación.
- `src/styles/`: estilos Sass.

### Compilación de producción

Desde `tablero-react`:

```bash
npm run build
npm run preview
```

El primer comando genera la carpeta `dist`.
El segundo permite revisar localmente esa compilación.

## Estándares de código y verificaciones

Ambas aplicaciones utilizan módulos de JavaScript, ESLint y Prettier.
Los nombres de componentes React utilizan PascalCase y los hooks
se ejecutan en el nivel superior de los componentes.

En JavaScript, la representación de datos externos utiliza métodos
del DOM para evitar insertar contenido de la API como HTML.
En React, las actualizaciones de las colecciones generan nuevos
arreglos y objetos.

Desde la carpeta de cada aplicación:

```bash
npm run lint
npm run format:check
```

Para aplicar el formato:

```bash
npm run format
```

La compilación de estilos del buscador se verifica con
`npm run build:css`; la compilación del tablero, con `npm run build`.

## Del DOM manual a React

En el buscador, `buscador-js/js/render.js` crea y actualiza los
elementos que representan los resultados. La aplicación debe
coordinar explícitamente los datos, los eventos y los cambios
visuales. En la lista de lecturas, `readings.js` y
`reading-render.js` distribuyen esa responsabilidad entre la
interacción y la representación.

En React, `ReadingBoard.jsx` mantiene los libros y los filtros
con `useState`. Los controladores actualizan el estado mediante
nuevos arreglos y objetos; React utiliza el JSX para actualizar
la interfaz. `BookList.jsx` identifica las tarjetas mediante claves
estables asociadas al identificador de cada libro.

`BookForm.jsx` utiliza campos controlados: sus valores proceden
del estado y cambian mediante eventos. Después de validar,
el formulario comunica el libro al tablero mediante la función
recibida en `onAddBook`.

El estado compartido permanece en `ReadingBoard.jsx`.
`BookFilters.jsx` comunica los cambios mediante funciones recibidas
por props, mientras `BookList.jsx` y `BookSummary.jsx` reciben los
resultados derivados. La lista filtrada y sus conteos se calculan
durante el renderizado, evitando almacenar copias que podrían
quedar desactualizadas.

`AppLayout.jsx` utiliza `children` para componer el contenido dentro
de una estructura común. Esta composición permite distribuir la
interfaz en componentes con responsabilidades concretas.

## Depuración y optimización

El error de la portada de respaldo, las evidencias disponibles
y la comparación del CSS de Bootstrap están documentados en:

[Depuración y optimización](docs/depuracion.md)

Las capturas y el registro de tamaños se encuentran en
`docs/capturas/`. El documento distingue las mediciones realizadas
y las limitaciones de las evidencias.