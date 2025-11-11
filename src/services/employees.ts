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

type ComparableEmployeeFields = Pick<
  Employee,
  "name" | "email" | "department" | "phone"
>;

const normalizeTextValue = (value: string | null | undefined): string =>
  value ? value.trim().replace(/\s+/g, "").toLowerCase() : "";

const normalizePhoneValue = (value: string | null | undefined): string =>
  value ? value.replace(/\D/g, "") : "";

const toComparableEmployee = (
  data: Partial<ComparableEmployeeFields>
): ComparableEmployeeFields => ({
  name: normalizeTextValue(data.name),
  email: normalizeTextValue(data.email),
  department: normalizeTextValue(data.department),
  phone: normalizePhoneValue(data.phone),
});

const filtersHaveValue = (filters: Record<string, string>): boolean =>
  Object.values(filters).some((value) => value && value.trim());

async function fetchEmployeesByFilters(
  filters: Record<string, string>
): Promise<Employee[]> {
  if (!filtersHaveValue(filters)) {
    return [];
  }

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      params.set(key, trimmedValue);
    }
  });

  const res = await apiClient.get(`/employees?${params.toString()}`);
  return Array.isArray(res.data) ? (res.data as Employee[]) : [];
}

async function ensureEmployeeIsUnique(
  payload: EmployeeCreateInput,
  options?: { excludeId?: number }
): Promise<void> {
  const filterCandidates: Record<string, string>[] = [];

  if (payload.email) {
    filterCandidates.push({ email: payload.email });
  }

  if (payload.phone) {
    filterCandidates.push({ phone: payload.phone });
  }

  filterCandidates.push({
    name: payload.name,
    department: payload.department,
  });

  const candidateResults = await Promise.all(
    filterCandidates
      .filter((candidate) => filtersHaveValue(candidate))
      .map((candidate) => fetchEmployeesByFilters(candidate))
  );

  const candidateMap = new Map<number, Employee>();
  candidateResults
    .flat()
    .filter(
      (employee) =>
        employee &&
        (options?.excludeId === undefined || employee.id !== options.excludeId)
    )
    .forEach((employee) => {
      candidateMap.set(employee.id, employee);
    });

  if (candidateMap.size === 0) {
    return;
  }

  const targetComparable = toComparableEmployee(payload);
  const hasDuplicate = Array.from(candidateMap.values()).some((employee) => {
    const comparable = toComparableEmployee(employee);
    return (
      comparable.name === targetComparable.name &&
      comparable.email === targetComparable.email &&
      comparable.department === targetComparable.department &&
      comparable.phone === targetComparable.phone
    );
  });

  if (hasDuplicate) {
    throw new Error("Nhân viên đã tồn tại trong hệ thống!");
  }
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
  const normalizedPayload: EmployeeCreateInput = {
    ...payload,
    name: payload.name.trim(),
    email: payload.email.trim(),
    department: payload.department.trim(),
    phone: (payload.phone || "").trim(),
    joinDate: payload.joinDate.trim(),
  };

  await ensureEmployeeIsUnique(normalizedPayload);

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

  const newEmployee = { ...normalizedPayload, id: maxId + 1 };
  const res = await apiClient.post("/employees", newEmployee);
  return res.data as Employee;
}

export async function updateEmployee(
  id: number,
  payload: EmployeeUpdateInput
): Promise<Employee> {
  const existingEmployee = await getEmployeeById(id);

  const sanitizedUpdate: EmployeeUpdateInput = {};

  if (payload.name !== undefined) {
    sanitizedUpdate.name = payload.name.trim();
  }

  if (payload.email !== undefined) {
    sanitizedUpdate.email = payload.email.trim();
  }

  if (payload.department !== undefined) {
    sanitizedUpdate.department = payload.department.trim();
  }

  if (payload.phone !== undefined) {
    sanitizedUpdate.phone = payload.phone.trim();
  }

  if (payload.joinDate !== undefined) {
    sanitizedUpdate.joinDate = payload.joinDate.trim();
  }

  const mergedEmployee: EmployeeCreateInput = {
    name: sanitizedUpdate.name ?? existingEmployee.name,
    email: sanitizedUpdate.email ?? existingEmployee.email,
    phone:
      sanitizedUpdate.phone !== undefined
        ? sanitizedUpdate.phone
        : existingEmployee.phone,
    department: sanitizedUpdate.department ?? existingEmployee.department,
    joinDate: sanitizedUpdate.joinDate ?? existingEmployee.joinDate,
  };

  await ensureEmployeeIsUnique(mergedEmployee, { excludeId: id });

  const res = await apiClient.patch(`/employees/${id}`, sanitizedUpdate);
  return res.data as Employee;
}

export async function deleteEmployee(id: number): Promise<void> {
  await apiClient.delete(`/employees/${id}`);
}
