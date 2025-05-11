import { Employee } from './employee.model';

export interface Department {
  departmentId: number;
  name: string;
  description: string;
  createdDate: Date;
  isActive: boolean;
  employees?: Employee[];
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}
