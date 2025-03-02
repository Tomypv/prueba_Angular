import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song, RawSong } from '../models/song.interface';
import { ArtistService } from 'app/features/artists/services/artist.service';
import { Artist } from 'app/features/artists/models/artist.interface';
import { BehaviorSubject, Observable, forkJoin, tap, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { map, switchMap } from 'rxjs/operators';

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
          return this.artistService.getArtistById(raw.artist).pipe(
            map(artist => this.mapRawSongToSong(raw, artist))
          );
        });
        return forkJoin(songObservables);
      }),
      //delay(2000) // Simulamos un retraso de 2 segundos para ver el loading (se desactiva en producción)
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
        return this.artistService.getArtistById(raw.artist).pipe(
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
  createSong(noIdSong: Song): Observable<Song> {
    
    const currentSongs = this.songsSubject.value || [];
    // Calculamos el máximo id actual para asignar el siguiente
    const maxId = currentSongs.reduce(
      (max, song) => Number(song.id) > max ? Number(song.id) : max,
      0
    );
    const newId = maxId + 1;
    const newSong: Song = { ...noIdSong, id: newId };
    
    // Buscar ID del artista según el nombre
    return this.artistService.getArtistByName(newSong.artist).pipe(
      switchMap(artist => {
        if (artist === null) {
          // Se crea un nuevo artista con el nombre recibido; el resto de propiedades se dejan en blanco.
          const newArtist: Artist = { 
            id: 0, // Valor de placeholder, se asignará en createArtist
            name: newSong.artist,
            bornCity: '',
            birthdate: '',
            img: '',
            rating: 0,
            songs: [] 
          };
          return this.artistService.createArtist(newArtist);
        } else {
          return of(artist);
        }
      }),
      switchMap((artist: Artist) => {
        const raw = this.mapSongToRawSong(newSong, artist.id);
        // Mapeamos a Song
        return this.http.post<RawSong>(`${this.baseUrl}`, raw).pipe(
          map(savedRaw => this.mapRawSongToSong(savedRaw, artist))
        );
      }),
      tap(createdSong => {
        // Insertamos en la lista local
        const current = this.songsSubject.value || [];
        this.songsSubject.next([...current, createdSong]);
      })
    );
  }


  /**
   * Actualiza una canción existente
   * @param id ID de la canción a actualizar
   * @param changes Cambios a aplicar
   * @returns Observable con la canción actualizada
   */
  updateSong(id: number, uiSong: Song): Observable<Song> {
    return this.artistService.getArtistByName(uiSong.artist).pipe(
      switchMap(artist => {
        if (artist === null) {
          // Crear un nuevo artista con el nombre recibido; el resto de propiedades se dejan en blanco o por defecto.
          const newArtist: Artist = { 
            id: 0, // Se asigna en el servicio de artistas
            name: uiSong.artist,
            bornCity: '',
            birthdate: '',
            img: '',
            rating: 0,
            songs: [] 
          };
          return this.artistService.createArtist(newArtist).pipe(
            switchMap(createdArtist => {
              const raw = this.mapSongToRawSong(uiSong, createdArtist.id);
              return this.http.patch<RawSong>(`${this.baseUrl}/${id}`, raw);
            })
          );
        } else {
          const raw = this.mapSongToRawSong(uiSong, artist.id);
          return this.http.patch<RawSong>(`${this.baseUrl}/${id}`, raw);
        }
      }),
      switchMap(updatedRaw => {
        return this.artistService.getArtistById(updatedRaw.artist).pipe(
          map(artist => this.mapRawSongToSong(updatedRaw, artist))
        );
      }),
      map(updatedSong => {
        // Reemplazamos la canción en la lista local
        const current = this.songsSubject.value || [];
        const idx = current.findIndex(s => s.id === id);
        if (idx >= 0) {
          const updatedList = [...current];
          updatedList[idx] = updatedSong;
          this.songsSubject.next(updatedList);
        }
        return updatedSong;
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
   * Mapea un RawSong (ID artista, duración en segundos) a Song (nombre artista, duración mm:ss)
   * @param raw Canción en formato crudo
   * @param artist Artista asociado
   * @returns Canción en formato de interfaz Song
   */
  private mapRawSongToSong(raw: RawSong, artist: Artist): Song {
    return {
      id: raw.id || 0,
      title: raw.title,
      poster: raw.poster,
      genre: raw.genre,
      year: raw.year,
      duration: this.formatDuration(raw.duration),
      rating: raw.rating,
      artist: artist.name
    };
  }

  /**
   * Mapea un Song (nombre artista, duración mm:ss) a RawSong (ID artista, duración en segundos)
   * @param ui Canción en formato de interfaz Song
   * @param artistId ID del artista asociado
   * @returns Canción en formato crudo
   */
  private mapSongToRawSong(ui: Song, artistId: number): RawSong {
    return {
      id: ui.id,
      title: ui.title,
      poster: ui.poster,
      genre: ui.genre,
      year: ui.year,
      duration: this.parseDuration(ui.duration),
      rating: ui.rating,
      artist: artistId
    };
  }

  // Convierten segundos <-> "mm:ss"

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  private parseDuration(d: string): number {
    const [mm, ss] = d.split(':');
    return (+mm) * 60 + (+ss);
  }

}