import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;
  totalItems = 0;
  isProcessingCheckout = false;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalPrice = this.cartService.getTotalPrice();
    this.totalItems = this.cartService.getTotalItems();
  }

  removeItem(bookId: string): void {
    this.cartService.removeFromCart(bookId);
    this.loadCart();
  }

  updateQuantity(bookId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const quantity = parseInt(input.value, 10);
    
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(bookId, quantity);
      this.loadCart();
    }
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateQuantity(item.book.id, item.quantity + 1);
    this.loadCart();
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(item.book.id, item.quantity - 1);
      this.loadCart();
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
      this.loadCart();
    }
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    this.isProcessingCheckout = true;

    // Simulate payment processing delay
    setTimeout(() => {
      // Show success message
      const successMessage = `✅ Order Successful!\n\nOrder Summary:\nItems: ${this.totalItems}\nTotal: $${(this.totalPrice * 1.08).toFixed(2)}\n\nThank you for your purchase!`;
      alert(successMessage);
      
      // Clear the cart
      this.cartService.clearCart();
      
      // Reset local state
      this.cartItems = [];
      this.totalPrice = 0;
      this.totalItems = 0;
      this.isProcessingCheckout = false;
      
      // Redirect to home page after 1 second
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
      
    }, 1500); // Simulate 1.5 second payment processing
  }

  // Optional: Add method to calculate tax
  calculateTax(): number {
    return this.totalPrice * 0.08;
  }

  // Optional: Add method to calculate final total
  calculateFinalTotal(): number {
    return this.totalPrice + this.calculateTax();
  }
}