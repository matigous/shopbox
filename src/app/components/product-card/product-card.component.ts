// src/app/components/product-card/product-card.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="card h-100">
      <img [src]="product.image" class="card-img-top" [alt]="product.title"
           style="height: 200px; object-fit: contain;">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">{{ product.title | slice:0:50 }}...</h5>
        <p class="card-text flex-grow-1">{{ product.description | slice:0:100 }}...</p>
        <div class="mt-auto">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="h5 text-primary">\${{ product.price }}</span>
            <small class="text-muted">⭐ {{ product.rating.rate }}/5</small>
          </div>
          <div class="d-grid gap-2">
            <a [routerLink]="['/product', product.id]" class="btn btn-outline-primary">
              Ver Detalhes
            </a>
            <button class="btn btn-primary" (click)="addToCart()">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  private cartService = inject(CartService);

  addToCart(): void {
    this.cartService.addToCart(this.product);
    // Aqui você poderia adicionar uma notificação de sucesso
  }
}
