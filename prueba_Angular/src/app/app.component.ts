import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    RouterModule
  ]
})
export class AppComponent implements OnInit {
  title = 'Music App';
  sidenavMode: 'side' | 'over' = 'side';
  isSidenavOpened = true;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    // Se observa el tamaño de pantalla para ajustar el comportamiento del sidenav
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.sidenavMode = 'over';
        this.isSidenavOpened = false;
      } else {
        this.sidenavMode = 'side';
        this.isSidenavOpened = true;
      }
    });
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }
}
