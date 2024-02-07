import { Routes } from '@angular/router';
import { AccueilComponent } from './components/accueil/accueil.component';
import { ConnexionComponent } from './components/connexion/connexion.component';
import { InscriptionComponent } from './components/inscription/inscription.component';
<<<<<<< HEAD
import { FindFilmsComponent } from './components/find-films/find-films.component';
import { FindSeriesComponent } from './components/find-series/find-series.component';
=======
>>>>>>> 027a55dfc25506321cb7529911fce202d9aff634

export const routes: Routes = [
    {path:"",component: AccueilComponent},
    {path:"connexion", component: ConnexionComponent},
<<<<<<< HEAD
    {path:"inscription",component: InscriptionComponent},
    {path:"findFilms",component:FindFilmsComponent},
    {path:"findSeries", component:FindSeriesComponent}
];

=======
    {path:"inscription",component: InscriptionComponent}
];
>>>>>>> 027a55dfc25506321cb7529911fce202d9aff634
