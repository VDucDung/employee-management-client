import { Employee } from './employee.model';

export interface Attendance {
  attendanceId: number;
  employeeId: number;
  checkInTime?: Date;
  checkOutTime?: Date;
  workDate: Date;
  notes: string;
  employee?: Employee;
}
