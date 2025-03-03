export interface Song {
    id: number;
    title: string;
    poster: string;
    genre: string[];
    year: number;
    duration: string; // Formato mm:ss
    rating: number;
    artist: string;  // Nombre del artista
  }

// Datos crudos, tal como se guardan en mock.json
export interface RawSong {
    id?: number; 
    title: string;
    poster: string;
    genre: string[];
    year: number;
    duration: number; // Almacenado en segundos
    rating: number;
    artist: number; // Almacena ID del artista
  }