export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
}

export type EmployeeCreateInput = Omit<Employee, "id">;
export type EmployeeUpdateInput = Partial<EmployeeCreateInput>;
