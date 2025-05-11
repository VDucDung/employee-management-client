import { Component, OnInit } from '@angular/core';
import { Attendance } from '../../core/models/attendance.model';
import { EmployeeService } from '../../core/employee/employee.service';
import { AuthService } from '../../core/auth/auth.service';
import { DepartmentService } from '../../core/department/department.service';
import { AttendanceService } from '../../core/attendance/attendance.service';
import { Employee, LoginResponse } from '../../core/models/employee.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  employeeCount: number = 0;
  departmentCount: number = 0;
  attendanceToday: number = 0;
  recentEmployees: Employee[] = [];
  recentAttendance: Attendance[] = [];

  loading: boolean = true;

  currentUser: LoginResponse | null = null;
  isAdmin: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private attendanceService: AttendanceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
    }

    this.isAdmin = this.currentUser?.role?.name === 'Admin';
  }

  loadDashboardData(): void {
    this.loading = true;

    this.employeeService.getAllEmployees().subscribe(
      (employees) => {
        this.employeeCount = employees.length;
        this.recentEmployees = employees
          .sort(
            (a, b) =>
              new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime()
          )
          .slice(0, 5);
        this.loading = false;
      },
      (error) => {
        console.error('Error', error);
        this.loading = false;
      }
    );

    this.departmentService.getAllDepartments().subscribe(
      (departments) => {
        this.departmentCount = departments.length;
      },
      (error) => {
        console.error('Error', error);
      }
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.attendanceService.getAttendanceByDate(today, today).subscribe(
      (attendance) => {
        this.attendanceToday = attendance.length;
        this.recentAttendance = attendance.slice(0, 5);
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
