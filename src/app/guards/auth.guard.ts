// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar se usuário está logado usando signal
  if (authService.isLoggedIn()) {
    return true; // Permitir acesso
  } else {
    // Redirecionar para login se não autenticado
    router.navigate(['/login']);
    return false;
  }
};
