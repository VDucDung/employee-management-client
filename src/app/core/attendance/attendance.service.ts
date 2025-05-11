import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Attendance } from '../models/attendance.model';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private endpoint = 'attendance';

  constructor(private apiService: ApiService) {}

  getAllAttendance(): Observable<Attendance[]> {
    return this.apiService.get<Attendance[]>(this.endpoint);
  }

  getAttendanceById(id: number): Observable<Attendance> {
    return this.apiService.getById<Attendance>(this.endpoint, id);
  }

  getAttendanceByDate(
    startDate: Date,
    enddate: Date
  ): Observable<Attendance[]> {
    const formattedDate = this.formatDate(startDate);
    const formattedEndDate = this.formatDate(enddate);
    return this.apiService.get<Attendance[]>(
      `${this.endpoint}?fromDate=${formattedDate}&toDate=${formattedEndDate}`
    );
  }

  getEmployeeAttendance(employeeId: number): Observable<Attendance[]> {
    return this.apiService.get<Attendance[]>(
      `${this.endpoint}/employee/${employeeId}`
    );
  }

  checkIn(attendance: Attendance): Observable<Attendance> {
    return this.apiService.post<Attendance>(
      `${this.endpoint}/check-in`,
      attendance
    );
  }

  checkOut(id: number, attendance: Attendance): Observable<Attendance> {
    return this.apiService.put<Attendance>(
      `${this.endpoint}/check-out`,
      id,
      attendance
    );
  }

  deleteAttendance(id: number): Observable<any> {
    return this.apiService.delete<any>(this.endpoint, id);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
