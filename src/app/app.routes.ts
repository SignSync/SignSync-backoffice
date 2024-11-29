import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import NavegacionComponent from './components/navegacion/navegacion.component';
export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    loadChildren: () => import('./auth/feature/auth.routes')
  },
  {
    path:'',
    component: NavegacionComponent,
    loadChildren: () => import('./components/components.routes')
  },
  {
    path:'tablas',
    component: NavegacionComponent,
    loadChildren: () => import('./components/tablas/tablas.routes')
  },
  {
    path:'metricas',
    component: NavegacionComponent,
    loadChildren: () => import('./components/metricas/metricas.routes')
  },
  {
    path:'*',
    redirectTo: ''
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  }

];
