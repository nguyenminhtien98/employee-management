import { useCallback, useEffect, useMemo, useState } from "react";
import type { Employee } from "../types/employee";
import type {
  EmployeeQueryParams,
  PagedEmployees,
} from "../services/employees";
import {
  getEmployees,
  createEmployee as apiCreateEmployee,
  updateEmployee as apiUpdateEmployee,
  deleteEmployee as apiDeleteEmployee,
} from "../services/employees";
import type { EmployeeFormValues } from "../schemas/employee";
import { useEmployeesParamsStore } from "../store/employeesParams";
import { toast } from "react-toastify";

export function useEmployees() {
  const {
    page,
    limit,
    name,
    email,
    department,
    sort,
    order,
    setPage,
    setLimit,
    setFilters,
    setSorting,
  } = useEmployeesParamsStore();

  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const queryParams: EmployeeQueryParams = useMemo(
    () => ({
      page,
      limit,
      name,
      email,
      department,
      sort: sort as keyof Employee,
      order,
    }),
    [page, limit, name, email, department, sort, order]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: PagedEmployees = await getEmployees(queryParams);
      setData(res.data);
      setTotal(res.total);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Đã xảy ra lỗi";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  const createEmployee = useCallback(
    async (values: EmployeeFormValues) => {
      setSubmitting(true);
      try {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const currentDate = `${year}-${month}-${day}`;

        const phoneValue =
          values.phone &&
          typeof values.phone === "string" &&
          values.phone.trim() !== ""
            ? values.phone.trim()
            : "";

        const createValues = {
          name: values.name,
          email: values.email,
          phone: phoneValue,
          department: values.department,
          joinDate: currentDate,
        };

        await apiCreateEmployee(createValues);
        toast.success("Thêm nhân viên thành công!");
        await fetchData();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể thêm nhân viên";
        toast.error(`${message}`);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchData]
  );

  const updateEmployee = useCallback(
    async (id: number, values: EmployeeFormValues) => {
      setSubmitting(true);
      try {
        await apiUpdateEmployee(id, values);
        toast.success("Cập nhật nhân viên thành công!");
        await fetchData();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể cập nhật nhân viên";
        toast.error(`${message}`);
        throw err;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchData]
  );

  const deleteEmployee = useCallback(
    async (employee: Employee) => {
      const ok = confirm(`Bạn có chắc muốn xóa nhân viên ${employee.name}?`);
      if (!ok) return;

      try {
        await apiDeleteEmployee(employee.id);
        toast.success("Xóa nhân viên thành công!");
        await fetchData();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể xóa nhân viên";
        toast.error(`${message}`);
      }
    },
    [fetchData]
  );

  const setFiltersCb = useCallback(setFilters, [setFilters]);
  const setSortingCb = useCallback(setSorting, [setSorting]);

  return {
    data,
    total,
    loading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    totalPages,
    filters: { name, email, department },
    setFilters: setFiltersCb,
    sort,
    order,
    setSorting: setSortingCb,
    refresh: fetchData,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    submitting,
  };
}
