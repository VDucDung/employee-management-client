import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, LoginResponse } from '../models/user.model';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<User> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      .pipe(
        map((response) => {
          // Lưu thông tin user và token vào localStorage
          const user = { ...response.user, token: response.token };
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token);

          // Cập nhật BehaviorSubject
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    // Xóa user từ localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    // Reset currentUserSubject
    this.currentUserSubject.next(null);

    // Chuyển hướng về trang login
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (e) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }
}
