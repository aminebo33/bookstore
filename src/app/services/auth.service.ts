import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check localStorage for existing authentication
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('current_user');
    
    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<boolean> {
    // Mock authentication - in real app, this would call an API
    if (email === 'user@example.com' && password === 'password') {
      const mockUser = {
        id: '1',
        email: email,
        name: 'John Doe',
        role: 'user'
      };

      // Simulate API delay
      return of(true).pipe(
        delay(1000),
        tap(() => {
          localStorage.setItem('auth_token', 'mock-jwt-token');
          localStorage.setItem('current_user', JSON.stringify(mockUser));
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(mockUser);
        })
      );
    }
    
    return of(false).pipe(delay(1000));
  }

  signup(name: string, email: string, password: string): Observable<boolean> {
  // Mock signup - in real app, this would call an API
  const mockUser = {
    id: 'new_' + Date.now(),
    email: email,
    name: name,
    role: 'user'
  };

  return of(true).pipe(
    delay(1000),
    tap(() => {
      localStorage.setItem('auth_token', 'mock-jwt-token');
      localStorage.setItem('current_user', JSON.stringify(mockUser));
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(mockUser);
    })
  );
}

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}