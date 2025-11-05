import { create } from "zustand";

type SortOrder = "asc" | "desc";

interface EmployeesParamsState {
  page: number;
  limit: number;
  name: string;
  email: string;
  department: string;
  sort: string;
  order: SortOrder;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  setFilters: (f: {
    name?: string;
    email?: string;
    department?: string;
  }) => void;
  setSorting: (field: string) => void;
  reset: () => void;
}

export const useEmployeesParamsStore = create<EmployeesParamsState>()(
  (set) => ({
    page: 1,
    limit: 10,
    name: "",
    email: "",
    department: "",
    sort: "id",
    order: "desc",
    setPage: (p: number) => set({ page: p }),
    setLimit: (l: number) => set({ limit: l }),
    setFilters: (f: { name?: string; email?: string; department?: string }) =>
      set((s: EmployeesParamsState) => ({
        name: f.name !== undefined ? f.name : s.name,
        email: f.email !== undefined ? f.email : s.email,
        department: f.department !== undefined ? f.department : s.department,
        page: 1,
      })),
    setSorting: (field: string) =>
      set((s: EmployeesParamsState) => ({
        sort: field === s.sort ? s.sort : field,
        order: field === s.sort ? (s.order === "asc" ? "desc" : "asc") : "asc",
      })),
    reset: () =>
      set({
        page: 1,
        limit: 10,
        name: "",
        email: "",
        department: "",
        sort: "id",
        order: "desc",
      }),
  })
);
