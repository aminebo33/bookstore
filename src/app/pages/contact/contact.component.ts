import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';
  isSubmitting = false;
  showSuccess = false;
  errorMessage = '';

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    setTimeout(() => {
      this.isSubmitting = false;
      this.showSuccess = true;

      setTimeout(() => {
        this.resetForm();
        this.showSuccess = false;
      }, 3000);
    }, 1500);
  }

  validateForm(): boolean {
    if (!this.name || !this.email || !this.subject || !this.message) {
      this.errorMessage = 'Please fill in all fields';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  resetForm(): void {
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }
}