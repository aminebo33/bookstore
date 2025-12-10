// Response from Google Books API
export interface GoogleBooksApiResponse {
  kind: string;
  totalItems: number;
  items: VolumeItem[];
}

// Represents a single book volume
export interface VolumeItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: VolumeInfo;
  saleInfo?: SaleInfo;
  accessInfo?: AccessInfo;
}

// Core book information from Google Books
export interface VolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: IndustryIdentifier[];
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  imageLinks?: ImageLinks;
  language?: string;
  previewLink?: string;
  infoLink?: string;
  canonicalVolumeLink?: string;
}

// Simplified Book model for your application
export interface Book {
  id: string;
  title: string;
  author: string; // Derived from authors[]
  description: string;
  price: number; // Derived from saleInfo
  genre: string; // Derived from categories[]
  publicationDate: string;
  isbn: string; // Derived from industryIdentifiers
  coverImage: string; // Derived from imageLinks
  rating: number;
  pages: number;
  publisher: string;
}

// Supporting interfaces for Google Books API
export interface IndustryIdentifier {
  type: string; // e.g., "ISBN_13", "ISBN_10"
  identifier: string;
}

export interface ImageLinks {
  smallThumbnail?: string;
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  extraLarge?: string;
}

export interface SaleInfo {
  country: string;
  saleability: string;
  isEbook: boolean;
  listPrice?: {
    amount: number;
    currencyCode: string;
  };
  retailPrice?: {
    amount: number;
    currencyCode: string;
  };
  buyLink?: string;
}

export interface AccessInfo {
  country: string;
  viewability: string;
  embeddable: boolean;
  publicDomain: boolean;
  textToSpeechPermission: string;
  epub: {
    isAvailable: boolean;
  };
  pdf: {
    isAvailable: boolean;
  };
  webReaderLink: string;
  accessViewStatus: string;
}

// For authentication
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  book: Book;
  quantity: number;
}