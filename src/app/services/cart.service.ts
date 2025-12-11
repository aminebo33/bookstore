import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book';

export interface CartItem {
  book: Book;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('bookstore_cart');
    if (savedCart) {
      this.cartItemsSubject.next(JSON.parse(savedCart));
    }
  }

  private saveToLocalStorage(items: CartItem[]): void {
    localStorage.setItem('bookstore_cart', JSON.stringify(items));
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(book: Book, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.book.id === book.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ book, quantity });
    }

    this.cartItemsSubject.next([...currentItems]);
    this.saveToLocalStorage(currentItems);
  }

  removeFromCart(bookId: string): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.book.id !== bookId);
    this.cartItemsSubject.next([...currentItems]);
    this.saveToLocalStorage(currentItems);
  }

  updateQuantity(bookId: string, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.book.id === bookId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(bookId);
      } else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...currentItems]);
        this.saveToLocalStorage(currentItems);
      }
    }
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem('bookstore_cart');
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + (item.book.price * item.quantity);
    }, 0);
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  getItemCount(): number {
    return this.cartItemsSubject.value.length;
  }
}