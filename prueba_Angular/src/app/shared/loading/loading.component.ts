import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div class="loading-container" *ngIf="loading">
      <mat-progress-spinner
        [diameter]="diameter"
        [strokeWidth]="strokeWidth"
        mode="indeterminate"
        [color]="color">
      </mat-progress-spinner>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `],
  imports: [CommonModule, MatProgressSpinnerModule]
})
export class LoadingComponent {
  @Input() loading = false;
  @Input() diameter = 50;
  @Input() strokeWidth = 5;
  @Input() color: 'primary' | 'accent' | 'warn' = 'accent';
}