import { Employee } from './employee.model';

export interface Role {
  roleId: number;
  name: string;

  employees?: Employee[];
}
