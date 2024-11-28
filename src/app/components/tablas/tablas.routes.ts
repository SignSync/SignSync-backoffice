import { Routes } from '@angular/router';

const navRoutes: unknown = [
  {
    path: '',
    loadComponent: () => import('./all/all.component').then(m => m.AllComponent),
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuario/usuario.component').then(m => m.UsuarioComponent),
  },
  {
    path: 'empresas',
    loadComponent: () => import('./empresas/empresas.component').then(m => m.EmpresasComponent),
  },
  {
    path: 'contratos',
    loadComponent: () => import('./contratos/contratos.component').then(m => m.ContratosComponent),
  },
  {
    path: 'contratistas',
    loadComponent: () => import('./contratistas/contratistas.component').then(m => m.ContratistasComponent),
  },
  {
    path: 'documentos',
    loadComponent: () => import('./documentos/documentos.component').then(m => m.DocumentosComponent),
  },
  {
    path: 'paquetes',
    loadComponent: () => import('./paquetes/paquetes.component').then(m => m.PaquetesComponent),
  },
];

// Fuerza la conversión a Routes
export default navRoutes as Routes;
