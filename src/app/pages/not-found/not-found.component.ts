// src/app/pages/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container text-center my-5">
      <h1 class="display-1">404</h1>
      <h2>Página Não Encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <a routerLink="/home" class="btn btn-primary">Voltar ao Início</a>
    </div>
  `
})
export class NotFoundComponent { }
