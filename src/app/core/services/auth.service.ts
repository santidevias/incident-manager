import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private userSignal = signal<UserResponse['user'] | null>(null);
  currentUser = this.userSignal.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.userSignal.set(this.getUserFromStorage());
    }
  }

  login(credentials: { email: string; password: string }): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('auth_user', JSON.stringify(response.user));
        }
        this.userSignal.set(response.user);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.userSignal.set(null);
    this.router.navigate(["/login"]);
  }

  role = computed(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return "";
    }
    return this.currentUser()?.role ?? "";
  });

  roleInitial = computed(() => {
    return this.role().charAt(0) || 'U';
  });

  private getUserFromStorage(): UserResponse['user'] | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const userJson = localStorage.getItem('auth_user');
    if (userJson) {
      try {
        return JSON.parse(userJson) as UserResponse['user'];
      } catch {
        return null;
      }
    }
    return null;
  }
}
