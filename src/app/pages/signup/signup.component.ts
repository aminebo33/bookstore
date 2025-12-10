import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  agreeToTerms = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      
      const mockUser = {
        id: 'new_' + Date.now(),
        email: this.email,
        name: this.name,
        role: 'user'
      };

      localStorage.setItem('current_user', JSON.stringify(mockUser));
      localStorage.setItem('auth_token', 'mock-jwt-token');
      
      this.successMessage = 'Account created successfully! Redirecting...';
      
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    }, 1500);
  }

  validateForm(): boolean {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (!this.agreeToTerms) {
      this.errorMessage = 'You must agree to the terms and conditions';
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}