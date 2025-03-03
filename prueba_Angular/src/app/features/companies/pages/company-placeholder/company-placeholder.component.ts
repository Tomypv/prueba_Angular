import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-company-placeholder',
  imports: [CommonModule],
  template: `
    <div class="placeholder">
      <h2>Compañías Discográficas</h2>
      <p>Implementación más adelante...</p>
    </div>
  `
})
export class CompanyPlaceholderComponent {}
