import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from '../models/department.model';
import { environment } from '../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = `${environment.apiUrl}/departments`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createDepartment(department: CreateDepartmentDto): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department, {
      headers: this.getHeaders(),
    });
  }

  updateDepartment(
    id: string,
    department: UpdateDepartmentDto
  ): Observable<Department> {
    return this.http.patch<Department>(`${this.apiUrl}/${id}`, department, {
      headers: this.getHeaders(),
    });
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
