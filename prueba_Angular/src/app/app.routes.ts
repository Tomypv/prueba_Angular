import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
    { path: '', redirectTo: '/songs', pathMatch: 'full' },
    {
      path: 'songs',
      loadChildren: () => import('./features/songs/song.routes')
        .then(m => m.SONGS_ROUTES)
    },
    {
      path: 'artists',
      loadChildren: () => import('./features/artists/artist.routes')
        .then(m => m.ARTIST_ROUTES)
    },
    {
      path: 'companies',
      loadChildren: () => import('./features/companies/company.routes')
        .then(m => m.COMPANY_ROUTES)
    }
  ];
