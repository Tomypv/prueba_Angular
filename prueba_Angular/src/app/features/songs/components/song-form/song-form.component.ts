import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SongService } from '../../services/song.service';
import { Song } from '../../models/song.interface';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-song-form',
  standalone: true,
  templateUrl: './song-form.component.html',
  styleUrls: ['./song-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule
  ]
})
export class SongFormComponent implements OnInit {
  songForm!: FormGroup;
  isEditMode = false;
  songId!: number;

  // Lista de géneros disponibles (ejemplo); podrías cargarla desde un servicio
  availableGenres: string[] = [
    'Pop',
    'Rock',
    'Alternative',
    'Blues',
    'Heavy',
    'Romance',
    'Chill'
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private fb: FormBuilder,
    private songService: SongService
  ) {}

  ngOnInit(): void {
    this.songForm = this.fb.group({
      title: ['', Validators.required],
      year: [null, Validators.required],
      genre: [[]], // array de strings
      rating: [null],
      duration: [null],
      artist: [''],
      poster: ['']
    });

    // Detectar si estamos en modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.songId = +idParam;

      // Cargar la canción para editar
      this.songService.getSongById(this.songId).subscribe(song => {
        if (song) {
          this.songForm.patchValue(song);
        } else {
          // Manejo de error si no se encontró
          this.router.navigate(['/songs']);
        }
      });
    }
  }
 
  onSubmit(): void {
    if (this.songForm.invalid) return;

    const formValue = this.songForm.value as Partial<Song>;

    if (this.isEditMode) {
      this.songService.updateSong(this.songId, formValue).subscribe(() => {
        this.router.navigate(['/songs']);
      });
    } else {
      this.songService.createSong(formValue).subscribe(() => {
        this.router.navigate(['/songs']);
      });
    }
  }
}
