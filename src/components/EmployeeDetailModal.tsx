import Modal from "./common/Modal";
import Label from "./common/Label";
import type { Employee } from "../types/employee";
import { formatPhoneNumber } from "../utils/formatPhoneNumber";
import { formatDate } from "../utils/formatDate";

interface Props {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export default function EmployeeDetailModal({
  open,
  onClose,
  employee,
}: Props) {
  if (!employee) return null;

  return (
    <Modal open={open} onClose={onClose} title="Thông tin nhân viên">
      <div className="info-grid">
        <Label>ID:</Label>
        <div className="info-value">{employee.id}</div>

        <Label>Tên:</Label>
        <div className="info-value">{employee.name}</div>

        <Label>Email:</Label>
        <div className="info-value">{employee.email}</div>

        <Label>SĐT:</Label>
        <div className="info-value">{formatPhoneNumber(employee.phone)}</div>

        <Label>Phòng ban:</Label>
        <div className="info-value">{employee.department}</div>

        <Label>Ngày tham gia:</Label>
        <div className="info-value">{formatDate(employee.joinDate)}</div>
      </div>
    </Modal>
  );
}
