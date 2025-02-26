import { Routes } from '@angular/router';
import { SongListComponent } from './features/songs/pages/song-list/song-list.component';
import { ArtistPlaceholderComponent } from './features/artists/pages/artist-placeholder/artist-placeholder.component';
import { CompanyPlaceholderComponent } from './features/companies/pages/company-placeholder/company-placeholder.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'songs' },
    { path: 'songs', component: SongListComponent },
    { path: 'artists', component: ArtistPlaceholderComponent },
    { path: 'companies', component: CompanyPlaceholderComponent }
];
