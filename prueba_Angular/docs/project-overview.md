# Visión General del Proyecto

Este documento proporciona una visión global del proyecto **prueba_Angular**, describiendo tanto la configuración del entorno de desarrollo como la arquitectura y funcionalidades principales de la aplicación.

---

# 1. Estructura del Proyecto

El proyecto se organiza de la siguiente manera:

- **/src**: Contiene la aplicación Angular.
  - **/app**: Código fuente de la aplicación.
    - **core**: Servicios generales, interceptores, guardias y configuración global.
      - *Ejemplo:* `core/interceptors/http-error.interceptor.ts` para capturar errores HTTP.
    - **features**  
      Cada funcionalidad se agrupa en módulos específicos. Entre ellos:
      - **songs**:  
        - **components**: Componentes especializados, como el `SongFormComponent`, para la creación y edición de canciones.
        - **pages**: Páginas dedicadas; por ejemplo, `song-list` (para listar canciones) y `song-detail` (para mostrar detalles de una canción).
        - **services**: Lógica para la gestión CRUD de las canciones (`SongService`) y para mapear los datos entre los formatos internos y el formato _raw_ utilizado en el servidor.
        - **models**: Definición de interfaces, como `Song` y `RawSong`, que establecen la estructura de los datos.
        - *Nota:* Existe un documento de detalle llamado `songs.md` en `/docs` para profundizar en la documentación completa de este módulo.
      - **artists**:  
        - Incluye el servicio `ArtistService` y el modelo `Artist`, destinados a la gestión de la información de artistas.  
        - Se encuentra un breve README en la carpeta `/artists` que resume su funcionamiento.
      - **companies**:  
        - Módulo reservado para la gestión de compañías; se prevé su ampliación en futuras versiones.

    - **shared**  
      Componentes, directivas, pipes y otros recursos reutilizables en toda la aplicación, como la vista "Not Found" o el componente _loader_.

    - **App Component y Rutas**:  
        - `app.component.ts`: Es la base de la aplicación web, que integra el _sidenav_, el _toolbar_ y el área principal donde se muestra el contenido dinámico.
        - Las rutas principales se definen en `app.routes.ts`, implementando _lazy loading_ para optimizar la carga de módulos.
        - `app.config.ts` contiene configuraciones y constantes globales necesarias para la aplicación.    

  - **assets**: Recursos estáticos como imágenes, iconos y archivos de idioma (por ejemplo, `es.json`).
  - **environments**: Configuraciones específicas para cada entorno (desarrollo y producción).
  - Archivos raíz como `index.html`, `main.ts` y `styles.scss` que inician y configuran la aplicación Angular.

- **/docs**  
  Contiene la documentación centralizada del proyecto. Entre los documentos se encuentran:
  - `json-server.md`: Documenta el funcionamiento del servidor _mock_ y la configuración de `server.js`.
  - `project-overview.md` (este documento).
  - `songs.md`: Documentación extensa y detallada sobre la funcionalidad de canciones (componentes, páginas, servicios, modelos, etc.).

- **/public**  
  Archivos públicos, como el favicon.

- **Archivos de configuración y scripts de entorno**  
  - `server.js`: Archivo de configuración e inicialización del servidor _mock_. Permite editar centralizadamente la configuración del servidor; en este caso, se utiliza en lugar del comando directo de JSON Server.
  - `mock.json`: Base de datos _mock_ que simula la API REST con las colecciones de **songs**, **artists** y **companies**.
  - Archivo `package.json` define el script `"start:mock": "node server.js"`, entre otras dependencias y configuraciones.
  - Otros archivos de configuración: `.angular/`, `.eslintrc.json`, `.prettierrc`, `angular.json`, etc.

- **README.md**  
  Documento general en la raíz que ofrece una descripción y guía para la puesta en marcha del proyecto.

---

# 2. Configuración del Servidor Mock

El proyecto utiliza JSON Server para simular una API REST a partir del archivo `mock.json`. 

[Más información sobre JSON Server](json-server.md)

# 3. Funcionalidades Clave de la Aplicación

## 3.1. Módulo de Songs

### Componentes

- **SongFormComponent**: Permite crear y editar canciones. Se realizan validaciones estrictas (todos los campos son obligatorios) y se asegura el manejo correcto de la duración en formato `mm:ss`.

### Servicios

- **Componentes y Páginas**:  
  Se incluyen componentes para crear y editar canciones, y páginas para listar y mostrar los detalles de cada canción.  
  - La carpeta `src/app/features/songs/pages` contiene `song-list` y `song-detail`, esenciales para navegar y visualizar la información.

- **Servicios**:  
  - `SongService`: Gestiona todas las operaciones CRUD para las canciones, se encarga de asignar IDs secuenciales y de coordinar la relación entre la canción y su artista.

- **Modelos**:  
  - `Song` y `RawSong` definen la estructura de los datos, diferenciando entre el formato utilizado en la aplicación y el almacenado en el servidor _mock_.

> Para más detalles sobre este módulo, consulta el archivo [songs.md](songs.md).

## 3.2. Módulo de Artists

- **Servicio y Modelo**:  
  - `ArtistService`: Permite buscar un artista por nombre y, en caso de no existir, crear uno nuevo de forma automática.  
  - `Artist`: Define la estructura de la información del artista.
  
- Se incluye un README breve en la carpeta `/artists` que resume su funcionalidad y relaciona la integración con el módulo de canciones.

- El resto de funcionalidades se implementarán en futuras versiones.

## 3.3. Módulo de Companies

- Se implementará en futuras versiones.

## 3.4. Elementos Globales y Compartidos

### Interceptor de Errores

- El interceptor definido en `http-error.interceptor.ts` captura errores HTTP globalmente. Aunque actualmente muestra un alert, se ha previsto que en el futuro se puede sustituir por notificaciones más sofisticadas (modales, toasts, etc.). Situado en **core**.

### Módulos Compartidos (shared)

- La carpeta `shared` agrupa componentes, directivas y pipes de uso común, que proporcionan consistencia en la interfaz y la experiencia de usuario. Se incluyen la vista "Not Found" y un loader spinner.

# 4. Recomendaciones de Documentación

La estrategia de documentación adoptada en este proyecto es:
- **Centralizada en `/docs`**: Aquí se agrupa y se detalla la información global y específica de cada módulo (como en `project-overview.md`, `json-server.md` y `songs.md`).
- **Documentación local en cada módulo**:
  - Se recomienda incluir un breve `README.md` en las carpetas de cada feature que resuma la información y enlace a la documentación extensa ubicada en `/docs`.