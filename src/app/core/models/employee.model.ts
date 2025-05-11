import { Attendance } from './attendance.model';
import { Department } from './department.model';
import { Role } from './role.model';

export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  departmentId?: number;
  roleId: number;
  hireDate: Date;
  isActive: boolean;
  department?: Department;
  role?: Role;
  attendances?: Attendance[];
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  employeeId: number;
  fullName: string;
  roleId: number;
  role: Role;
}

export interface CreateEmployeeDto {
  name: string;
  email: string;
  phone: string;
  role: string;
  departmentId: string;
  hireDate: Date;
  isActive: boolean;
}

export interface UpdateEmployeeDto {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  departmentId?: string;
  hireDate?: Date;
  isActive?: boolean;
}
