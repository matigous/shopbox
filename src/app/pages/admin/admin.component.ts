import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private productService = inject(ProductService);
  public products = signal<Product[]>([]);
  public loading = signal<boolean>(false);
  public error = signal<string>('');
  public deleting = signal<Set<number>>(new Set());
  public searchTerm = signal<string>('');
  public selectedCategory = signal<string>('');

  constructor(public translate: TranslateService) {
    this.translate.use('pt-BR');
  }

  public categories = computed(() => {
    const allCategories = this.products().map(p => p.category);
    return [...new Set(allCategories)].sort();
  });

  public filteredProducts = computed(() => {
    let filtered = this.products();

    const searchTermValue = this.searchTerm().trim();
    if (searchTermValue) {
      const term = searchTermValue.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    const selectedCategoryValue = this.selectedCategory();
    if (selectedCategoryValue) {
      filtered = filtered.filter(product =>
        product.category === selectedCategoryValue
      );
    }

    return filtered;
  });

  public averagePrice = computed(() => {
    const prices = this.filteredProducts().map(p => p.price);
    return prices.length > 0
      ? prices.reduce((sum, price) => sum + price, 0) / prices.length
      : 0;
  });

  public averageRating = computed(() => {
    const ratings = this.filteredProducts().map(p => p.rating.rate);
    return ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;
  });

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
        this.error.set('Erro ao carregar produtos. Verifique sua conexão.');
        this.loading.set(false);
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }

  refreshProducts(): void {
    this.loadProducts();
  }

  deleteProduct(productId: number): void {
    const product = this.products().find(p => p.id === productId);
    const productName = product ? product.title.slice(0, 30) + '...' : 'este produto';

    if (confirm(`Tem certeza que deseja deletar "${productName}"?`)) {
      const currentDeleting = new Set(this.deleting());
      currentDeleting.add(productId);
      this.deleting.set(currentDeleting);

      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          const updatedProducts = this.products().filter(p => p.id !== productId);
          this.products.set(updatedProducts);
          const newDeleting = new Set(this.deleting());
          newDeleting.delete(productId);
          this.deleting.set(newDeleting);

          console.log('Produto deletado com sucesso!');
        },
        error: (err) => {
          const newDeleting = new Set(this.deleting());
          newDeleting.delete(productId);
          this.deleting.set(newDeleting);

          alert('Erro ao deletar produto. Tente novamente.');
          console.error('Erro ao deletar produto:', err);
        }
      });
    }
  }

  viewProduct(productId: number): void {
    window.open(`/product/${productId}`, '_blank');
  }

  updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  updateSelectedCategory(value: string): void {
    this.selectedCategory.set(value);
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.selectedCategory.set('');
  }
}
