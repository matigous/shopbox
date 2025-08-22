// src/app/components/navbar/navbar.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/home">Angular Store</a>

        <div class="navbar-nav ms-auto d-flex flex-row align-items-center">
          <a class="nav-link me-3" routerLink="/home">Home</a>

          @if (authService.isLoggedIn()) {
            <a class="nav-link me-3" routerLink="/cart">
              Carrinho ({{ cartService.totalItems() }})
            </a>
            <a class="nav-link me-3" routerLink="/admin">Admin</a>
            <span class="navbar-text me-3">
              Olá, {{ authService.currentUser() }}!
            </span>
            <button class="btn btn-outline-light btn-sm" (click)="logout()">
              Sair
            </button>
          } @else {
            <a class="nav-link" routerLink="/login">Login</a>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public cartService = inject(CartService);

  logout(): void {
    this.authService.logout();
  }
}
