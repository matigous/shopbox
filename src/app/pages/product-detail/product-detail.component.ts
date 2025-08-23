import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
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
