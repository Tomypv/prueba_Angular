# JSON Server Documentation

Este documento explica cómo configurar y utilizar el servidor de _mock_ local para el proyecto **prueba_Angular**.

## 1. ¿Qué es JSON Server?

[JSON Server](https://github.com/typicode/json-server) es una librería de Node.js que permite convertir un simple archivo `JSON` en una API REST completa con endpoints `GET`, `POST`, `PUT`, `PATCH` y `DELETE`.  
Es ideal para **prototipos** o **pruebas** cuando no existe un backend real disponible.

## 2. Estructura del archivo `mock.json`

El archivo `mock.json` se encuentra en la raíz del proyecto. Contiene tres colecciones principales:
- **songs**  
- **artists**  
- **companies**

Cada colección es un array de objetos con campos relevantes para nuestro proyecto. Por ejemplo:

```json
{
  "songs": [
    {
      "id": 1,
      "title": "Who did you think i was",
      "poster": "...",
      "genre": ["Pop", "Rock", "Alternative"],
      ...
    },
    ...
  ],
  "artists": [
    {
      "id": 1,
      "name": "John Mayer",
      "bornCity": "Conecticut",
      ...
    },
    ...
  ],
  "companies": [
    {
      "id": 1,
      "name": "Apple Corps Ltd",
      "country": "Colombia",
      ...
    },
    ...
  ]
}
```

## 3. Inicialización del Servidor de Mock

El servidor de mock se puede iniciar mediante el script definido en el archivo `package.json`. Este script utiliza JSON Server para transformar el archivo `mock.json` en una API REST completa. A continuación, se detalla el proceso de inicio:

1. Abrir la terminal integrada de Visual Studio Code o una ventana de terminal en el sistema operativo.
2. Navegar hasta la raíz del proyecto.
3. Ejecutar el comando:

   ```bash
   npm run start:mock
   ```

Esto levantará el servidor en [http://localhost:3000](http://localhost:3000).

- `--watch mock.json` indica que JSON Server leerá el archivo `mock.json`.
- `--port 3000` especifica el puerto en el que se servirá la API.

## 4. Endpoints Disponibles

Una vez levantado el servidor, se podrá acceder a las siguientes rutas:

- `GET http://localhost:3000/songs`
- `GET http://localhost:3000/artists`
- `GET http://localhost:3000/companies`

Además, JSON Server admite los métodos `POST`, `PUT`, `PATCH` y `DELETE` sobre estas mismas rutas, por ejemplo:

- `POST http://localhost:3000/songs` (para crear una nueva canción)
- `DELETE http://localhost:3000/songs/1` (para eliminar la canción con id=1)


## Notas y Consideraciones

- El puerto 3000 se eligió porque es común en aplicaciones Node, pero se puede cambiar a 3001 o cualquier otro si aparecen conflictos.
- JSON Server no es para producción, sino para desarrollo y pruebas.
- Se puede modificar el archivo mock.json según las necesidades. JSON Server recargará los datos automáticamente (hot reload) cuando detecte cambios.