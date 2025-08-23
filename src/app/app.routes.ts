import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component')
      .then(m => m.HomeComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component')
      .then(m => m.ProductDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.component')
      .then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component')
      .then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component')
      .then(m => m.NotFoundComponent)
  }
];
