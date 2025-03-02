# Módulo Artists

El módulo **Artists** se encarga de gestionar la información relacionada con los artistas, que están vinculados a las canciones de la aplicación. Aunque actualmente su implementación es básica, ya proporciona las funcionalidades necesarias para el tratamiento de los artistas asociados a cada canción.

## Funcionalidades Principales

- **Obtención de Artistas:**  
  Permite obtener la información de un artista mediante su ID o su nombre. Esto facilita la integración con el módulo de *Songs* para comprobar la existencia de un artista y relacionarlo con una canción.

- **Creación de Artistas:**  
  Se puede crear un nuevo artista en caso de que no exista, asignándole un ID secuencial. Este proceso garantiza la integridad de la base de datos al evitar duplicados y brindar una identificación única a cada artista.

## Servicios

El servicio principal de este módulo es el `ArtistService`, el cual ofrece:

- `getArtistById(id: number): Observable<Artist>`  
  Obtiene un artista en base a su ID.

- `getArtistByName(name: string): Observable<Artist | null>`  
  Busca un artista por su nombre y retorna `null` si no se encuentra.

- `createArtist(noIdArtist: Artist): Observable<Artist>`  
  Crea un nuevo artista asignándole automáticamente un ID secuencial, basándose en la lista actual de artistas.

## Estructura del Módulo

El módulo se encuentra organizado de la siguiente manera:

- **artist.routes.ts:**  
  Configura las rutas del módulo, actualmente redirigiendo a una vista de placeholder.

- **models/artist.interface.ts:**  
  Define la estructura de los datos del artista, incluyendo campos opcionales como `bornCity`, `birthdate`, `img`, `rating` y la lista de canciones asociadas.

- **pages/artist-placeholder/artist-placeholder.component.ts:**  
  Componente que sirve como una vista temporal para el módulo mientras se desarrollan funcionalidades adicionales.

- **services/artist.service.ts:**  
  Implementa la lógica de negocio y las integraciones con el backend relacionadas con los artistas.

## Consideraciones

- El módulo **Artists** está actualmente enfocado en el manejo básico de los datos de artistas para integrarlos con el módulo de canciones. Fue necesario para completar la funcionalidad completa de `Songs`.
- El resto de funcionalidades del módulo no se desarrollan al no ser necesarias para la prueba.