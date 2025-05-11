import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private endpoint = 'employees';

  constructor(private apiService: ApiService) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apiService.get<Employee[]>(this.endpoint);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.apiService.getById<Employee>(this.endpoint, id);
  }

  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.apiService.post<Employee>(this.endpoint, employee);
  }

  updateEmployee(
    id: number,
    employee: UpdateEmployeeDto
  ): Observable<Employee> {
    return this.apiService.put<Employee>(this.endpoint, id, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.apiService.delete<void>(this.endpoint, id);
  }
}
