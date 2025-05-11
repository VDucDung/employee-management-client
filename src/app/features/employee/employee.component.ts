import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Department } from '../../core/models/department.model';
import { Employee } from '../../core/models/employee.model';
import { EmployeeService } from '../../core/employee/employee.service';
import { DepartmentService } from '../../core/department/department.service';
import { ConfirmDialogComponent } from '../../components/confirm/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
  ],
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'role',
    'department',
    'hireDate',
    'status',
    'actions',
  ];
  isLoading = false;
  employeeForm: FormGroup;
  isEditing = false;
  currentEmployeeId: number | null = null;
  searchText = '';

  statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];

  roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Employee', label: 'Employee' },
  ];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      role: ['Employee', [Validators.required]],
      departmentId: ['', [Validators.required]],
      hireDate: [new Date(), [Validators.required]],
      isActive: [true, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDepartments();
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading employees', error);
        this.snackBar.open('Error loading employees', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (data) => {
        this.departments = data;
      },
      error: (error) => {
        console.error('Error loading departments', error);
        this.snackBar.open('Error loading departments', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onAddEmployee(): void {
    this.isEditing = false;
    this.currentEmployeeId = null;
    this.employeeForm.reset({
      role: 'Employee',
      hireDate: new Date(),
      isActive: true,
    });
  }

  onEditEmployee(employee: Employee): void {
    this.isEditing = true;
    this.currentEmployeeId = employee.employeeId;

    // Format the date correctly for the form
    const hireDate = employee.hireDate
      ? new Date(employee.hireDate)
      : new Date();

    this.employeeForm.patchValue({
      name: employee.fullName,
      email: employee.email,
      phone: employee.phoneNumber,
      role: employee.role,
      departmentId: employee.departmentId,
      hireDate: hireDate,
      isActive: employee.isActive,
    });
  }

  onDeleteEmployee(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this employee?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.employeeService.deleteEmployee(+id).subscribe({
          next: () => {
            this.loadEmployees();
            this.snackBar.open('Employee deleted successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error('Error deleting employee', error);
            this.snackBar.open('Error deleting employee', 'Close', {
              duration: 3000,
            });
          },
        });
      }
    });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return;
    }

    const employeeData = this.employeeForm.value;

    this.isLoading = true;

    if (this.isEditing && this.currentEmployeeId) {
      this.employeeService
        .updateEmployee(this.currentEmployeeId, employeeData)
        .subscribe({
          next: () => {
            this.loadEmployees();
            this.resetForm();
            this.snackBar.open('Employee updated successfully', 'Close', {
              duration: 3000,
            });
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating employee', error);
            this.snackBar.open('Error updating employee', 'Close', {
              duration: 3000,
            });
            this.isLoading = false;
          },
        });
    } else {
      this.employeeService.createEmployee(employeeData).subscribe({
        next: () => {
          this.loadEmployees();
          this.resetForm();
          this.snackBar.open('Employee added successfully', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding employee', error);
          this.snackBar.open('Error adding employee', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
    }
  }

  resetForm(): void {
    this.employeeForm.reset({
      role: 'Employee',
      hireDate: new Date(),
      isActive: true,
    });
    this.isEditing = false;
    this.currentEmployeeId = null;
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(
      (d) => d.departmentId === departmentId
    );
    return department ? department.name : 'N/A';
  }

  applyFilter(): void {
    if (!this.searchText) {
      this.loadEmployees();
      return;
    }

    const searchTerm = this.searchText.toLowerCase();
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees.filter(
          (employee) =>
            (employee?.fullName || '').toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm) ||
            employee.phoneNumber.toLowerCase().includes(searchTerm)
        );
      },
    });
  }
}
