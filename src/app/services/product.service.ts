import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockApiService } from './mocks/mock-api.service';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private mock = new MockApiService();

  constructor() {
    if (!environment.apiUrl) {
      this.mock.seed('products', [
        { name: 'Produto A', price: 10 },
        { name: 'Produto B', price: 20 }
      ]);
    }
  }

  getAllProducts(): Observable<Product[]> {
    if (!this.apiUrl) {
      return from(this.mock.list('products'));
    }

    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getProductById(id: number): Observable<Product> {
    if (!this.apiUrl) {
      return from(this.mock.get('products', id));
    }

    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getCategories(): Observable<string[]> {
    if (!this.apiUrl) {
      return from(this.mock.list('products/categories'));
    }

    return this.http.get<string[]>(`${this.apiUrl}/products/categories`);
  }

  deleteProduct(id: number): Observable<Product> {
    if (!this.apiUrl) {
      return from(this.mock.delete('products', id));
    }

    return this.http.delete<Product>(`${this.apiUrl}/products/${id}`);
  }
}
