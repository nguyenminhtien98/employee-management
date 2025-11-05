import { useCallback, useEffect, useMemo, useState } from "react";
import type { Employee } from "../types/employee";
import type {
  EmployeeQueryParams,
  PagedEmployees,
} from "../services/employees";
import { getEmployees } from "../services/employees";
import { useEmployeesParamsStore } from "../store/employeesParams";

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
  };
}
