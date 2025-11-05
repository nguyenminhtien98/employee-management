import type { Employee } from "../types/employee";
import Button from "./common/Button";
import Table, { type TableColumn } from "./common/Table";
import { EditIcon, DeleteIcon } from "./common/Icons";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import { formatDate } from "../utils/formatDate";

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
  type Row = Employee & Record<string, unknown>;

  const columns: TableColumn<Row>[] = [
    {
      key: "id",
      title: "ID",
      width: "60px",
    },
    {
      key: "name",
      title: "Tên",
      width: "20%",
      maxWidth: "200px",
      truncate: true,
      sortable: true,
      render: (row) => (
        <span className="employee-name" onClick={() => onViewDetail(row)}>
          {row.name}
        </span>
      ),
    },
    {
      key: "email",
      title: "Email",
      width: "25%",
      maxWidth: "250px",
      truncate: true,
    },
    {
      key: "phone",
      title: "SĐT",
      width: "140px",
      render: (row) => {
        const formatted = formatPhoneNumber(row.phone);
        return formatted || "";
      },
    },
    {
      key: "department",
      title: "Phòng ban",
      width: "12%",
      maxWidth: "130px",
      truncate: true,
    },
    {
      key: "joinDate",
      title: "Ngày tham gia",
      width: "130px",
      sortable: true,
      render: (row) => formatDate(row.joinDate),
    },
    {
      key: "actions",
      title: "Hành động",
      width: "120px",
      render: (row) => (
        <div className="table-actions">
          <Button onClick={() => onEdit(row)} className="btn-icon" title="Sửa">
            <EditIcon />
          </Button>
          <Button
            onClick={() => onDelete(row)}
            variant="danger"
            className="btn-icon"
            title="Xóa"
          >
            <DeleteIcon />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table<Row>
      columns={columns}
      data={employees as Row[]}
      sortKey={sort}
      sortOrder={order}
      onChangeSort={onChangeSort}
      rowKey={(row) => row.id}
    />
  );
}
