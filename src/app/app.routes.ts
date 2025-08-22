import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rota padrão redireciona para home
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // Página inicial - carregamento direto
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },

  // Detalhes do produto
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component')
      .then(m => m.ProductDetailComponent)
  },

  // Login
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent)
  },

  // Carrinho - rota protegida
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component')
      .then(m => m.CartComponent),
    canActivate: [authGuard]
  },

  // Admin - lazy loading com guard
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component')
      .then(m => m.AdminComponent),
    canActivate: [authGuard]
  },

  // Rota 404 - página não encontrada
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
