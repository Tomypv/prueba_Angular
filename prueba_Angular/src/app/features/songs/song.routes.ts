import { Routes } from '@angular/router';
import { SongListComponent } from './pages/song-list/song-list.component';
import { SongDetailComponent } from './pages/song-detail/song-detail.component'; 
import { SongFormComponent } from './components/song-form/song-form.component';

export const SONGS_ROUTES: Routes = [
  { path: '', component: SongListComponent },
  { path: 'new', component: SongFormComponent },
  { path: ':id', component: SongDetailComponent, outlet: 'detail' },
  { path: 'edit/:id', component: SongFormComponent }
];