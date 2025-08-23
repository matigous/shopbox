import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.http.get<Product[]>(`${this.apiUrl}/products`)
      .pipe(
        catchError(this.handleError<Product[]>('loadProducts', []))
      )
      .subscribe(products => this.productsSubject.next(products));
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`)
      .pipe(
        catchError(this.handleError<Product[]>('getAllProducts', []))
      );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(
        catchError(this.handleError<Product>(`getProductById id=${id}`))
      );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/products/categories`)
      .pipe(
        catchError(this.handleError<string[]>('getCategories', []))
      );
  }

  addProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product)
      .pipe(
        tap(() => this.loadProducts()),
        catchError(this.handleError<Product>('addProduct'))
      );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product | void> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product)
      .pipe(
        tap(() => this.loadProducts()),
        catchError(this.handleError<void>('updateProduct'))
      );
  }

  deleteProduct(id: number): Observable<Product | void> {
    return this.http.delete<Product>(`${this.apiUrl}/products/${id}`)
      .pipe(
        tap(() => this.loadProducts()),
        catchError(this.handleError<void>('deleteProduct'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
