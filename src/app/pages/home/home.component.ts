import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/book';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  isLoading = true;
  searchTerm = '';
  selectedGenre = '';
  errorMessage = '';
  availableGenres: string[] = [];

  constructor(
    private bookService: BookService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  loadFeaturedBooks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getFeaturedBooks(12).subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = books;
        this.availableGenres = Array.from(new Set(books.map(book => book.genre)));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.errorMessage = 'Failed to load books.';
        this.isLoading = false;
      }
    });
  }

  searchBooks(): void {
    if (!this.searchTerm.trim()) {
      this.filteredBooks = this.books;
      return;
    }

    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  filterByGenre(): void {
    if (!this.selectedGenre) {
      this.filteredBooks = this.books;
      return;
    }

    this.filteredBooks = this.books.filter(book => book.genre === this.selectedGenre);
  }

  trackByBook(index: number, book: Book): string {
    return book.id;
  }

  addToCart(book: Book): void {
    this.cartService.addToCart(book);
    alert(`Added "${book.title}" to cart!`);
  }
}