import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-artist-placeholder',
  imports: [CommonModule],
  template: `
    <div class="placeholder">
      <h2>Artistas</h2>
      <p>Implementación más adelante...</p>
    </div>
  `
})
export class ArtistPlaceholderComponent {}