import { apiClient } from "./api";
import type {
  Employee,
  EmployeeCreateInput,
  EmployeeUpdateInput,
} from "../types/employee";

export type SortOrder = "asc" | "desc";

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  department?: string;
  sort?: keyof Employee;
  order?: SortOrder;
}

export interface PagedEmployees {
  data: Employee[];
  total: number;
}

export async function getEmployees(
  params: EmployeeQueryParams
): Promise<PagedEmployees> {
  const searchParams = new URLSearchParams();

  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : 10;

  if (params.name && params.name.trim()) {
    searchParams.set("name_like", params.name.trim());
  }

  if (params.email && params.email.trim()) {
    searchParams.set("email_like", params.email.trim());
  }

  if (params.department && params.department.trim()) {
    searchParams.set("department", params.department.trim());
  }

  if (params.sort) {
    searchParams.set("_sort", String(params.sort));
    searchParams.set("_order", params.order || "asc");
  }

  searchParams.set("_page", String(page));
  searchParams.set("_limit", String(limit));

  const res = await apiClient.get(`/employees?${searchParams.toString()}`);

  const totalHeader =
    res.headers["x-total-count"] || res.headers["X-Total-Count"];
  let total = totalHeader ? Number(totalHeader) : 0;

  if (!totalHeader || total === 0) {
    const countParams = new URLSearchParams();
    if (params.name && params.name.trim()) {
      countParams.set("name_like", params.name.trim());
    }
    if (params.email && params.email.trim()) {
      countParams.set("email_like", params.email.trim());
    }
    if (params.department && params.department.trim()) {
      countParams.set("department", params.department.trim());
    }

    try {
      const countRes = await apiClient.get(
        `/employees?${countParams.toString()}`
      );
      total = Array.isArray(countRes.data) ? countRes.data.length : 0;
    } catch {
      total = Array.isArray(res.data) ? res.data.length : 0;
    }
  }

  return { data: res.data as Employee[], total };
}

export async function getEmployeeById(id: number): Promise<Employee> {
  const res = await apiClient.get(`/employees/${id}`);
  return res.data as Employee;
}

export async function createEmployee(
  payload: EmployeeCreateInput
): Promise<Employee> {
  const maxIdRes = await apiClient.get(
    "/employees?_sort=id&_order=desc&_limit=1"
  );
  const employees = maxIdRes.data as Employee[];

  let maxId = 0;
  if (employees.length > 0) {
    const firstId = employees[0].id;
    maxId = typeof firstId === "number" ? firstId : Number(firstId);
    if (isNaN(maxId)) {
      maxId = 0;
    }
  }

  const newEmployee = { ...payload, id: maxId + 1 };
  const res = await apiClient.post("/employees", newEmployee);
  return res.data as Employee;
}

export async function updateEmployee(
  id: number,
  payload: EmployeeUpdateInput
): Promise<Employee> {
  const res = await apiClient.patch(`/employees/${id}`, payload);
  return res.data as Employee;
}

export async function deleteEmployee(id: number): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}
