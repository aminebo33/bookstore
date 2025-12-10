import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { Book, GoogleBooksApiResponse, VolumeItem } from '../models/book';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = environment.googleBooksApiUrl;
  private apiKey = environment.googleBooksApiKey;

  /**
   * Search books using Google Books API[citation:1][citation:8]
   * @param query - Search query (supports keywords like intitle:, inauthor:)[citation:1]
   * @param maxResults - Maximum results to return (default: 20)
   */
  searchBooks(query: string, maxResults: number = 20): Observable<Book[]> {
    if (!query.trim()) {
      return of([]);
    }

    const params = new HttpParams()
      .set('q', query)
      .set('maxResults', maxResults.toString())
      .set('key', this.apiKey)
      .set('printType', 'books'); // Restrict to books only

    return this.http.get<GoogleBooksApiResponse>(`${this.apiUrl}/volumes`, { params })
      .pipe(
        map(response => this.transformApiResponse(response)),
        catchError(this.handleError)
      );
  }

  /**
   * Get books by genre/category
   */
  getBooksByGenre(genre: string, maxResults: number = 20): Observable<Book[]> {
    // Using subject: keyword to search in categories[citation:1]
    const query = `subject:${genre}`;
    return this.searchBooks(query, maxResults);
  }

  /**
   * Get featured books (popular programming books for demo)
   */
  getFeaturedBooks(maxResults: number = 6): Observable<Book[]> {
    const query = 'subject:programming';
    return this.searchBooks(query, maxResults);
  }

  /**
   * Get a specific book by ID[citation:5]
   */
  getBookById(bookId: string): Observable<Book | undefined> {
    const params = new HttpParams().set('key', this.apiKey);
    
    return this.http.get<VolumeItem>(`${this.apiUrl}/volumes/${bookId}`, { params })
      .pipe(
        map(volumeItem => this.transformVolumeToBook(volumeItem)),
        catchError(this.handleError)
      );
  }

  /**
   * Transform Google Books API response to our Book model
   */
  private transformApiResponse(response: GoogleBooksApiResponse): Book[] {
    if (!response.items) {
      return [];
    }

    return response.items
      .map(item => this.transformVolumeToBook(item))
      .filter((book): book is Book => book !== undefined);
  }

  /**
   * Transform a single VolumeItem to our Book model
   */
  private transformVolumeToBook(volumeItem: VolumeItem): Book | undefined {
    if (!volumeItem.volumeInfo) {
      return undefined;
    }

    const volumeInfo = volumeItem.volumeInfo;
    
    // Extract ISBN
    const isbn = volumeInfo.industryIdentifiers?.find(id => 
      id.type === 'ISBN_13' || id.type === 'ISBN_10'
    )?.identifier || 'N/A';

    // Extract price from sale info or use default
    const price = volumeItem.saleInfo?.retailPrice?.amount || 
                  volumeItem.saleInfo?.listPrice?.amount || 
                  9.99;

    // Create Book object
    return {
      id: volumeItem.id,
      title: volumeInfo.title || 'Unknown Title',
      author: volumeInfo.authors?.join(', ') || 'Unknown Author',
      description: volumeInfo.description || 'No description available.',
      price: price,
      genre: volumeInfo.categories?.[0] || 'Uncategorized',
      publicationDate: volumeInfo.publishedDate || 'Unknown',
      isbn: isbn,
      coverImage: volumeInfo.imageLinks?.thumbnail || 
                 volumeInfo.imageLinks?.smallThumbnail || 
                 'https://via.placeholder.com/128x196?text=No+Cover',
      rating: volumeInfo.averageRating || 3.5,
      pages: volumeInfo.pageCount || 0,
      publisher: volumeInfo.publisher || 'Unknown Publisher'
    };
  }

  /**
   * Handle HTTP errors[citation:2]
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your search query.';
          break;
        case 403:
          errorMessage = 'API key invalid or quota exceeded.';
          break;
        case 404:
          errorMessage = 'No books found matching your criteria.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Google Books API is currently unavailable.';
          break;
        default:
          errorMessage = `Server returned code ${error.status}: ${error.message}`;
      }
    }
    
    console.error('BookService error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}