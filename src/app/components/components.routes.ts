import { Routes } from '@angular/router';

const navRoutes: unknown = [
  // {
  //   path: 'tablas',
  //   loadComponent: () => import('./tablas/usuario/usuario.component').then(m => m.UsuarioComponent),
  // },
  {
    path: 'miperfil',
    loadComponent: () => import('./miperfil/miperfil.component')
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes')
  },
  {
    path:'upload',
    loadComponent: () => import('./dashboard/upload/upload.component')
  },
];

// Fuerza la conversión a Routes
export default navRoutes as Routes;
