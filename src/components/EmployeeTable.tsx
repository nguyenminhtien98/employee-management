import type { Employee } from "../types/employee";
import Table from "./common/Table";
import { getEmployeeTableColumns } from "../constants/employeeTable.tsx";

interface Props {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onViewDetail: (employee: Employee) => void;
  sort: string;
  order: "asc" | "desc";
  onChangeSort: (field: string) => void;
}

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  onViewDetail,
  sort,
  order,
  onChangeSort,
}: Props) {
  const columns = getEmployeeTableColumns(onEdit, onDelete, onViewDetail);

  return (
    <Table<Employee>
      columns={columns}
      data={employees}
      sortKey={sort}
      sortOrder={order}
      onChangeSort={onChangeSort}
      rowKey={(row) => row.id}
    />
  );
}
