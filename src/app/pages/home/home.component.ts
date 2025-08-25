import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  public products = signal<Product[]>([]);
  public loading = signal<boolean>(false);
  public error = signal<string>('');

  constructor(public translate: TranslateService) {
    this.translate.use('pt-BR');
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    this.error.set('');

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar produtos. Tente novamente.');
        this.loading.set(false);
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }
}
