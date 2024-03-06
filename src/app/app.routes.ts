import { Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
import { FindFilmsComponent } from './components/find-films/find-films.component';
import { FindSeriesComponent } from './components/find-series/find-series.component';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { ProfilComponent } from './components/profil/profil.component';

export const routes: Routes = [
    {path:"",component: AccueilComponent},
    {path:"connexion", component: ConnexionComponent},
    {path:"inscription",component: InscriptionComponent},
    {path:"findFilms",component:FindFilmsComponent},
    {path:"findSeries", component:FindSeriesComponent},
    {path:"watchlist", component:WatchlistComponent},
    {path:"profil", component:ProfilComponent},
];

