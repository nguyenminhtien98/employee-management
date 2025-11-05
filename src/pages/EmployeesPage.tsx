/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import EmployeeTable from "../components/EmployeeTable";
import EmployeeFormModal from "../components/EmployeeFormModal";
import EmployeeDetailModal from "../components/EmployeeDetailModal";
import { useEmployees } from "../hooks/useEmployees";
import { useDebounce } from "../hooks/useDebounce";
import type { Employee } from "../types/employee";
import type { EmployeeFormValues } from "../schemas/employee";
import { DEPARTMENTS } from "../constants";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Dropdown from "../components/common/Dropdown";
import Label from "../components/common/Label";
import TableSkeleton from "../components/loading/TableSkeleton";

export default function EmployeesPage() {
  const {
    data,
    total,
    loading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    totalPages,
    setFilters,
    sort,
    order,
    setSorting,
    // ⚡ CRUD operations từ hook
    createEmployee,
    updateEmployee,
    deleteEmployee,
    submitting,
  } = useEmployees();

  const [searchName, setSearchName] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchDept, setSearchDept] = useState<string>("");
  const debouncedName = useDebounce(searchName, 500);
  const debouncedEmail = useDebounce(searchEmail, 500);
  const debouncedDept = useDebounce(searchDept, 100);

  useEffect(() => {
    setFilters({
      name: debouncedName,
      email: debouncedEmail,
      department: debouncedDept,
    });
  }, [debouncedName, debouncedEmail, debouncedDept, setFilters]);

  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [limitInput, setLimitInput] = useState<string>(String(limit));

  useEffect(() => {
    setLimitInput(String(limit));
  }, [limit]);

  const departmentOptions = [
    { value: "", label: "-- Phòng ban --" },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
  ];

  // ⚡ Simplified handlers
  const handleCreate = async (values: EmployeeFormValues) => {
    try {
      await createEmployee(values);
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      // Error already handled in hook with toast
    }
  };

  const handleUpdate = async (values: EmployeeFormValues) => {
    if (!editing) return;
    try {
      await updateEmployee(editing.id, values);
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      // Error already handled in hook with toast
    }
  };

  const handleViewDetail = (employee: Employee) => {
    setViewingEmployee(employee);
    setDetailModalOpen(true);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Quản lý Nhân viên</h2>

      <div className="filter-bar">
        <Input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Tìm theo tên"
        />
        <Input
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          placeholder="Tìm theo email"
        />
        <Dropdown
          value={searchDept}
          onChange={setSearchDept}
          options={departmentOptions}
          placeholder="-- Phòng ban --"
        />
        <div className="spacer" />
        <div className="filter-actions mobile-break">
          <Button
            onClick={() => {
              setSearchName("");
              setSearchEmail("");
              setSearchDept("");
            }}
          >
            Xóa lọc
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            + Thêm nhân viên
          </Button>
        </div>
      </div>

      <div className="page-info">
        {loading
          ? "Đang tải..."
          : error
            ? `Lỗi: ${error}`
            : `Tổng: ${total} nhân viên`}
      </div>

      {loading ? (
        <TableSkeleton columns={7} rows={limit} />
      ) : error ? (
        <div className="error-container">
          <div className="error-message">{error}</div>
          <div className="error-hint">
            Vui lòng đảm bảo JSON Server đang chạy: <code>npm run api</code>
          </div>
        </div>
      ) : (
        <EmployeeTable
          employees={data}
          onEdit={(e) => {
            setEditing(e);
            setModalOpen(true);
          }}
          onDelete={deleteEmployee}
          onViewDetail={handleViewDetail}
          sort={sort}
          order={order}
          onChangeSort={setSorting}
        />
      )}

      <div className="pagination-container">
        <Button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          {"<"}
        </Button>
        <span className="pagination-label">
          Trang {page}/{totalPages}
        </span>
        <Button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          {">"}
        </Button>
        <div className="pagination-spacer" />
        <Label className="pagination-label">Mỗi trang</Label>
        <Input
          value={limitInput}
          onChange={(e) => {
            const val = e.target.value;
            setLimitInput(val);
            const numVal = Number(val);
            if (!isNaN(numVal) && numVal >= 10 && numVal <= 100) {
              setLimit(numVal);
            }
          }}
          onBlur={(e) => {
            const val = Number(e.target.value);
            let finalVal = limit;
            if (isNaN(val) || val < 10) {
              finalVal = 10;
            } else if (val > 100) {
              finalVal = 100;
            } else {
              finalVal = val;
            }
            setLimit(finalVal);
            setLimitInput(String(finalVal));
          }}
          style={{ width: "80px" }}
        />
      </div>

      <EmployeeFormModal
        open={modalOpen}
        onClose={() => {
          if (!submitting) {
            setModalOpen(false);
            setEditing(null);
          }
        }}
        defaultValues={editing ?? undefined}
        onSubmit={editing ? handleUpdate : handleCreate}
        title={editing ? "Sửa nhân viên" : "Thêm nhân viên"}
        submitting={submitting}
      />

      <EmployeeDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        employee={viewingEmployee}
      />
    </div>
  );
}