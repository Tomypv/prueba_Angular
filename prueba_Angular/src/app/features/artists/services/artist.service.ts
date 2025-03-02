// artist.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Artist } from '../models/artist.interface';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private baseUrl = `${environment.apiUrl}/artists`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene un artista por su ID
   * @param id ID del artista
   * @returns 
   */
  getArtistById(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene un artista por su nombre
   * @param name Nombre del artista
   * @returns 
   */
  getArtistByName(name: string): Observable<Artist | null> {
    return this.http.get<Artist[]>(`${this.baseUrl}?name=${name}`).pipe(
      map(artists => {
        if (artists && artists.length > 0) {
          return artists[0];
        }
        return null; // No se encuentra o no existe
      })
    );
  }

  /**
   * Crea un nuevo artista
   * @param newArtist 
   * @returns 
   */
  createArtist(noIdArtist: Artist): Observable<Artist> {
    // Obtenemos la lista actual de artistas mediante una petición GET
    return this.http.get<Artist[]>(this.baseUrl).pipe(
      switchMap((currentArtists: Artist[]) => {
        // Calculamos el máximo id actual (forzando que sea number)
        const maxId = currentArtists.reduce(
          (max: number, artist: Artist) => (Number(artist.id) > max ? Number(artist.id) : max),
          0
        );
        const newId = maxId + 1;
        const newArtist: Artist = { ...noIdArtist, id: newId };
        return this.http.post<Artist>(this.baseUrl, newArtist);
      })
    );
    }
}
