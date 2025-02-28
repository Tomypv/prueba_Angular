import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from '../models/song.interface';
import { ArtistService } from '../../artists/services/artist.service';
import { Artist } from 'app/features/artists/models/artist.interface';
import { BehaviorSubject, Observable, forkJoin, tap } from 'rxjs';
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

  // Estado local de canciones
  private songsSubject = new BehaviorSubject<Song[] | null>(null);
  songs$ = this.songsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private artistService: ArtistService  
  ) {}

  /**
   * Carga todas las canciones desde el servidor y las almacena en el estado local
   * @returns void
   */
  loadSongs(): void {
    this.http.get<RawSong[]>(`${this.baseUrl}`).pipe(
      switchMap(rawSongs => {
        // Mapeo ID de artista -> nombre, formateo de duración, etc.
        const songObservables = rawSongs.map(raw => {
          return this.artistService.getById(raw.artist).pipe(
            map(artist => this.mapRawSongToSong(raw, artist))
          );
        });
        return forkJoin(songObservables);
      }),
      delay(2000) // Simulamos un retraso de 2 segundos para ver el loading (se desactiva en producción)
    ).subscribe(songs => {
      this.songsSubject.next(songs); // Emitimos el array transformado
    });
  }

  /**
   * Obtiene todas las canciones desde el estado local (ya las cargamos con loadSongs)
   * @returns Observable con la lista de canciones
   */
  getSongs(): Observable<Song[] | null> {
    return this.songs$;
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
   * @param newSong Datos de la canción a crear
   * @returns Observable con la canción creada
   */
  createSong(newSong: Partial<Song>): Observable<Song> {
    return this.http.post<Song>(this.baseUrl, newSong).pipe(
      tap(created => {
        // Actualizamos la lista local
        const current = this.songsSubject.value || [];
        this.songsSubject.next([...current, created]);
      })
    );
  }


  /**
   * Actualiza una canción existente
   * @param id ID de la canción a actualizar
   * @param changes Cambios a aplicar
   * @returns Observable con la canción actualizada
   */
  updateSong(id: number, changes: Partial<Song>): Observable<Song> {
    return this.http.patch<Song>(`${this.baseUrl}/${id}`, changes).pipe(
      tap(updated => {
        // Reemplazamos la canción en la lista local
        const current = this.songsSubject.value || [];
        const index = current.findIndex(s => s.id === id);
        if (index !== -1) {
          const updatedList = [...current];
          updatedList[index] = updated;
          this.songsSubject.next(updatedList);
        }
      })
    );
  }
 


  /**
   * Elimina una canción
   * @param id ID de la canción a eliminar
   * @returns Observable que se completa cuando la canción se elimina
   */
  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        // Actualizamos la lista local eliminando el song con ese id
        const currentSongs = this.songsSubject.value;
        if (currentSongs) { // Solo si currentSongs no es null
          const updatedSongs = currentSongs.filter(song => song.id !== id);
          this.songsSubject.next(updatedSongs);
        }
      })
    );
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