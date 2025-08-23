import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  private productService = inject(ProductService);
  public products = signal<Product[]>([]);
  public loading = signal<boolean>(false);
  public error = signal<string>('');
  public deleting = signal<Set<number>>(new Set());
  public searchTerm = '';
  public selectedCategory = '';

  public categories = computed(() => {
    const allCategories = this.products().map(p => p.category);
    return [...new Set(allCategories)].sort();
  });

  public filteredProducts = computed(() => {
    let filtered = this.products();

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(product =>
        product.category === this.selectedCategory
      );
    }

    return filtered;
  });

  public averagePrice = computed(() => {
    const prices = this.products().map(p => p.price);
    return prices.length > 0
      ? prices.reduce((sum, price) => sum + price, 0) / prices.length
      : 0;
  });

  public averageRating = computed(() => {
    const ratings = this.products().map(p => p.rating.rate);
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
      // Adicionar ID ao conjunto de produtos sendo deletados
      const currentDeleting = new Set(this.deleting());
      currentDeleting.add(productId);
      this.deleting.set(currentDeleting);

      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // Remover produto da lista
          const updatedProducts = this.products().filter(p => p.id !== productId);
          this.products.set(updatedProducts);

          // Remover do conjunto de deletando
          const newDeleting = new Set(this.deleting());
          newDeleting.delete(productId);
          this.deleting.set(newDeleting);

          // Feedback de sucesso (você pode substituir por uma notificação mais elegante)
          console.log('Produto deletado com sucesso!');
        },
        error: (err) => {
          // Remover do conjunto de deletando em caso de erro
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
    // Navegar para página de detalhes do produto
    window.open(`/product/${productId}`, '_blank');
  }

  onSearchChange(): void {
    // O computed já se encarrega de atualizar automaticamente
    // Este método existe caso você queira adicionar debounce no futuro
  }

  onCategoryChange(): void {
    // O computed já se encarrega de atualizar automaticamente
  }
};
