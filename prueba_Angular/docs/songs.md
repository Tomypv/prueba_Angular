# Documentación del Módulo Songs

Este documento ofrece una descripción detallada y organizada de la funcionalidad de canciones implementada en la aplicación. Se abordan los componentes, páginas, rutas, servicios y modelos que conforman el módulo de *Songs*.

## Índice

1. [Introducción](#introducción)
2. [Estructura del Módulo](#estructura-del-módulo)
3. [Componentes](#componentes)
4. [Páginas](#páginas)
5. [Rutas](#rutas)
6. [Servicios](#servicios)
7. [Modelos](#modelos)
8. [Consideraciones y Mejores Prácticas](#consideraciones-y-mejores-prácticas)

## Introducción

El módulo *Songs* gestiona todas las operaciones relacionadas con la creación, edición, visualización y eliminación de canciones dentro de la aplicación. Este módulo se encarga de:
- Mostrar todas las canciones en tarjetas, con información breve.
- Mostrar información detallada de cada canción con una tarjeta más grande en Overlay sobre la aplicación.
- Validar los formularios para creación y actualización de canciones.
- Gestionar las relaciones entre canciones y artistas.
- Realizar operaciones CRUD (Create, Read, Update, Delete) mediante el servicio asociado.

## Estructura del Módulo

La funcionalidad de *Songs* se organiza en la carpeta `src/app/features/songs` y se compone de los siguientes subdirectorios:

- **components/**  
  Contiene componentes especializados, por ejemplo:
  - `song-form/`: Incluye el `SongFormComponent` para la creación y edición de canciones.

- **pages/**  
  Administra las vistas principales:
  - `song-list/`: Interfaz para listar todas las canciones.
  - `song-detail/`: Pantalla para mostrar los detalles de una canción seleccionada.

- **services/**  
  Define la lógica de negocio y las integraciones con el backend a través del `SongService`.

- **models/**  
  Contiene las interfaces que definen la estructura de los datos:
  - `song.interface.ts`: Define tanto la estructura de `Song` (usada en la interfaz de la aplicación) como la de `RawSong` (formato almacenado en el servidor o fichero _mock_).

- **song.routes.ts**  
  Configura las rutas específicas para el módulo de *Songs*.

## Componentes

### SongFormComponent

- **Descripción:**  
  El `SongFormComponent` permite tanto la creación como la edición de canciones. Incluye validaciones estrictas para asegurar que:
  - Todos los campos sean obligatorios.
  - La duración se maneje correctamente en formato `mm:ss`.
  
- **Funcionalidades destacadas:**  
  - Integración con Angular Material para elementos de formulario.
  - Soporte para distinguir entre el modo edición o creación a través de parámetros de la ruta.
  - Comunicación con el `SongService` para realizar operaciones CRUD.

## Páginas

### SongListComponent

- **Descripción:**  
  Es la vista principal que lista todas las canciones disponibles en el sistema.
  
- **Características:**
  - Renderiza una tarjeta por cada canción. Al seleccionar una te redirige a la vista de detalles de la canción seleccionada.
  - Incluye un botón flotante para navegar a la página de creación (`/songs/new`).
  - Emplea una animación para el hover del ratón sobre las tarjetas.
  - Utiliza técnicas de optimización con `trackBy` para una renderización eficiente.

### SongDetailComponent

- **Descripción:**  
  Muestra la información detallada de una canción seleccionada.  
- **Características:**
  - Permite visualizar todos los detalles de la canción, como título, artista, año, género, duración y rating.
  - Ofrece botones para editar y eliminar la canción.
  - Emplea animaciones para la transición y cierre del overlay de detalles.

## Rutas

El archivo `song.routes.ts` define la configuración del enrutamiento para el módulo de *Songs*. Entre las rutas configuradas se encuentran:
- Ruta base (`''`): Muestra el `SongListComponent`.
- Ruta `new`: Muestra el `SongFormComponent` para la creación de una nueva canción.
- Ruta `:id`: Muestra el `SongDetailComponent` en un outlet secundario para visualizar detalles. El outlet se define en `src/app/app.component.html` para que el efecto del overlay incluya toda la pantalla.
- Ruta `edit/:id`: Permite editar una canción existente utilizando el `SongFormComponent`.

## Servicios

### SongService

**Descripción:**  
El `SongService` es responsable de gestionar todas las operaciones CRUD relacionadas con las canciones. Entre sus tareas se incluyen:

- Realizar peticiones HTTP para comunicarse con el backend.
- Asignar IDs secuenciales a las nuevas canciones.
- Coordinar la relación entre una canción y su artista.
- Convertir los datos entre los formatos de la aplicación (`Song`) y el formato crudo (`RawSong`).

**Métodos clave:**

- `createSong(noIdSong: Song): Observable<Song>`: Crea una nueva canción.
- `updateSong(id: number, uiSong: Song): Observable<Song>`: Actualiza una canción existente.
- `deleteSong(id: number): Observable<void>`: Elimina una canción.
- `getSongById(id: number): Observable<Song>`: Obtiene una canción a partir de su ID.
- Métodos privados `mapRawSongToSong` y `mapSongToRawSong` para el mapeo de estructuras de datos.
- Métodos para la conversión de duración, mediante `formatDuration` y `parseDuration`.

## Modelos

### Song y RawSong

#### Song
Interfaz utilizada internamente en la aplicación. Sus campos principales son:
- `id`: Número identificador de la canción.
- `title`: Título de la canción.
- `poster`: URL de la imagen.
- `genre`: Lista de géneros asociados.
- `year`: Año de lanzamiento.
- `duration`: Duración en formato `mm:ss`.
- `rating`: Puntuación o rating de la canción.
- `artist`: Nombre del artista.

#### RawSong
Estructura que define el formato de almacenamiento, generalmente utilizada en el backend o en el fichero _mock_.
- `id?`: ID de la canción.
- `title`, `poster`, `genre`, `year`, `rating`: Igual que en `Song`.
- `duration`: Almacenada en segundos.
- `artist`: Almacena el ID del artista en vez del nombre.

## Consideraciones y Mejores Prácticas

- **Validaciones:**  
  Se implementan validaciones robustas en el `SongFormComponent` para asegurar la integridad de los datos (por ejemplo, validación del formato de duración).

- **Gestión del estado:**  
  El uso de un `BehaviorSubject` en el `SongService` permite mantener y actualizar de forma reactiva la lista local de canciones.

- **Optimización en la renderización:**  
  Métodos como `trackBy` en el `SongListComponent` ayudan a optimizar la representación de la lista de canciones cuando se actualizan.

- **Modularidad:**  
  La separación en componentes, páginas, servicios y modelos facilita el mantenimiento y escalabilidad del módulo.

- **Rutas Lazy-Loaded:**  
  El uso de rutas lazy-loaded para módulos (como se ve en `app.routes.ts`) permite una carga inicial más rápida y mejora la experiencia del usuario.
