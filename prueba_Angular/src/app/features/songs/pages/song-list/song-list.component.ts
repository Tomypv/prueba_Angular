import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song.interface';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

// Módulos de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Componente de Loading
import { LoadingComponent } from 'app/shared/loading/loading.component';


@Component({
  standalone: true,
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
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
export class SongListComponent implements OnInit {
  // El observable puede emitir Song[] o null mientras carga
  songs$!: Observable<Song[] | null>;

  pageTitle = 'Canciones';

  constructor( private songService: SongService ) {}

  ngOnInit(): void {
    // Cargamos las canciones si no las habíamos cargado antes
    this.songService.loadSongs(); 
    this.songs$ = this.songService.getSongs();
  }

  /**
   * trackBy para optimizar la renderización de la lista
   */
  trackBySongId(index: number, song: Song): number | undefined {
    return song.id;
  }
}
