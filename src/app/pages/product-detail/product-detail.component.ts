// src/app/pages/product-detail/product-detail.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container my-4">
      @if (loading()) {
        <div class="d-flex justify-content-center">
          <div class="spinner-border" role="status"></div>
        </div>
      } @else if (error()) {
        <div class="alert alert-danger">{{ error() }}</div>
      } @else if (product()) {
        <div class="row">
          <div class="col-md-6">
            <img [src]="product()!.image" [alt]="product()!.title"
                 class="img-fluid" style="max-height: 400px;">
          </div>
          <div class="col-md-6">
            <h1>{{ product()!.title }}</h1>
            <p class="text-muted">{{ product()!.category }}</p>
            <h3 class="text-primary">\${{ product()!.price }}</h3>

            <div class="my-3">
              <span class="badge bg-warning text-dark me-2">
                ⭐ {{ product()!.rating.rate }}/5
              </span>
              <small class="text-muted">
                ({{ product()!.rating.count }} avaliações)
              </small>
            </div>

            <p>{{ product()!.description }}</p>

            <div class="d-grid gap-2 d-md-flex">
              <button class="btn btn-primary me-md-2" (click)="addToCart()">
                Adicionar ao Carrinho
              </button>
              <button class="btn btn-outline-secondary" (click)="goBack()">
                Voltar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  public product = signal<Product | null>(null);
  public loading = signal<boolean>(false);
  public error = signal<string>('');

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.loadProduct(productId);
    } else {
      this.error.set('ID do produto inválido');
    }
  }

  private loadProduct(id: number): void {
    this.loading.set(true);

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar produto');
        this.loading.set(false);
      }
    });
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.addToCart(currentProduct);
      // Aqui você poderia mostrar uma notificação de sucesso
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
