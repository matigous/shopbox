import { Injectable, computed, signal } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);
  public items = this.cartItems.asReadonly();

  public totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  public totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + (item.product.price * item.quantity), 0)
  );

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.cartItems.set(updatedItems);
    } else {
      this.cartItems.set([...currentItems, { product, quantity }]);
    }
  }

  removeFromCart(productId: number): void {
    const updatedItems = this.cartItems().filter(item => item.product.id !== productId);
    this.cartItems.set(updatedItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const itemIndex = currentItems.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex].quantity = quantity;
      this.cartItems.set(updatedItems);
    }
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
