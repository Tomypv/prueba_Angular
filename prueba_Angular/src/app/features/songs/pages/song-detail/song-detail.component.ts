import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song.interface';

// RxJS
import { Observable, of } from 'rxjs';
import { switchMap, startWith, catchError } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Componente de Loading
import { LoadingComponent } from 'app/shared/loading/loading.component';

@Component({
  standalone: true,
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LoadingComponent
  ]
})
export class SongDetailComponent implements OnInit {
  /**
   * Este observable emite:
   * - null: si aún no tenemos datos (loading)
   * - Song: si el servicio devuelve la canción
   * - undefined: si ocurre un error o la canción no existe
   */
  song$!: Observable<Song | null | undefined>;
  closing = false; // Controla la animación de cierre

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.song$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.songService.getSongById(id).pipe(
          startWith(null), // Inicialmente => "loading"
          catchError(() => of(undefined)) // Si falla, emitimos undefined => "not found"
        );
      })
    );
  }

  closeOverlay(): void {

    this.closing = true;

    // Esperamos 300ms (duración de la animación) y navegamos
    setTimeout(() => {
        this.router.navigate([{ outlets: { primary: ['songs'], detail: null } }]);
      }, 300);
}

  /**
   * Elimina la canción y vuelve a la lista
   */
  deleteSong(id: number): void {
    if (!id) return;

    const confirmed = confirm('¿Seguro que quieres eliminar esta canción?');
    if (!confirmed) return;

    this.songService.deleteSong(id).subscribe(() =>{
        // Al terminar, volvemos a la lista de canciones
        this.closeOverlay();
    });
  }

  /**
   * Navega a la página de edición
   */
  editSong(id: number): void {
    if (!id) return;



    this.closeOverlay();
    
    
    setTimeout(() => {
      this.router.navigate([{ outlets: { primary: ['songs', 'edit', id], detail: null } }]);
    }, 300);

  }

}
