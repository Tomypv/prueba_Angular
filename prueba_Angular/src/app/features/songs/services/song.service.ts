import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from '../models/song.interface';
import { ArtistService } from '../../artists/services/artist.service';
import { Artist } from 'app/features/artists/models/artist.interface';
import { Observable, forkJoin } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { map, switchMap } from 'rxjs/operators';

interface RawSong { // Datos de la canción tal como vienen del servidor
  id: number;
  title: string;
  poster?: string;
  genre: string[];
  year: number;
  duration: number; // En segundos
  rating: number;
  artist: number;   // ID del artista
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const paddedSecs = secs < 10 ? `0${secs}` : secs;
  return `${mins}:${paddedSecs}`;
}

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private baseUrl = `${environment.apiUrl}/songs`;

  constructor(
    private http: HttpClient,
    private artistService: ArtistService  
  ) {}

  /**
   * Obtiene todas las canciones
   * @returns Observable con la lista de canciones
   */
  getSongs(): Observable<Song[]> {
    return this.http.get<RawSong[]>(this.baseUrl).pipe(
      switchMap(rawSongs => {
        // Se mapea cada RawSong a un Observable<Song>, resolviendo el artista
        const songObservables = rawSongs.map(raw => {
          return this.artistService.getById(raw.artist).pipe(
            map(artist => this.mapRawSongToSong(raw, artist))
          );
        });
        return forkJoin(songObservables);
      }),
      delay(1500) // Demora de 1,5 segundos en el desarrollo para mostrar el spinner
    );
  }

  /**
   * Obtiene una canción por su ID
   * @param id ID de la canción a obtener
   * @returns Observable con la canción
   */
  getSongById(id: number): Observable<Song> {
    return this.http.get<RawSong>(`${this.baseUrl}/${id}`).pipe(
      switchMap(raw => {
        return this.artistService.getById(raw.artist).pipe(
          map(artist => this.mapRawSongToSong(raw, artist))
        );
      })
    );
  }

  /**
   * Crea una nueva canción
   * @param song Datos de la canción a crear
   * @returns Observable con la canción creada
   */
  createSong(song: Song): Observable<Song> {
    return this.http.post<Song>(this.baseUrl, song);
  }

  /**
   * Actualiza una canción existente
   * @param id ID de la canción a actualizar
   * @param song Datos de la canción actualizados
   * @returns Observable con la canción actualizada
   */
  updateSong(id: number, song: Song): Observable<Song> {
    return this.http.put<Song>(`${this.baseUrl}/${id}`, song);
  }

  /**
   * Elimina una canción
   * @param id ID de la canción a eliminar
   * @returns Observable que se completa cuando la canción se elimina
   */
  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Transforma una RawSong en un objeto Song con la duración formateada y el nombre del artista
   * @param artistId ID del artista
   * @returns Observable con la lista de canciones del artista
   */
  private mapRawSongToSong(raw: RawSong, artist: Artist): Song {
    return {
      ...raw,
      artist: artist.name,
      duration: formatDuration(raw.duration)
    };
  }

}