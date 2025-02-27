import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from '../models/song.interface';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {

  private baseUrl = `${environment.apiUrl}/songs`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las canciones
   * @returns Observable con la lista de canciones
   */
  getSongs(): Observable<Song[]> {
    return this.http.get<Song[]>(this.baseUrl).pipe(
      delay(1500) // Demora de 1,5 segundos en el desarrollo para mostrar el spinner
    );
  }

  /**
   * Obtiene una canción por su ID
   * @param id ID de la canción a obtener
   * @returns Observable con la canción
   */
  getSongById(id: number): Observable<Song> {
    return this.http.get<Song>(`${this.baseUrl}/${id}`);
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

}