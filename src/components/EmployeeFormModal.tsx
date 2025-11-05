import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeFormSchema } from "../schemas/employee";
import type { EmployeeFormValues } from "../schemas/employee";
import { DEPARTMENTS } from "../constants";
import Modal from "./common/Modal";
import Input from "./common/Input";
import Dropdown from "./common/Dropdown";
import Button from "./common/Button";
import Label from "./common/Label";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<EmployeeFormValues>;
  onSubmit: (values: EmployeeFormValues) => Promise<void> | void;
  title: string;
  submitting?: boolean;
}

export default function EmployeeFormModal({
  open,
  onClose,
  defaultValues,
  onSubmit,
  title,
  submitting,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      joinDate: "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name || "",
        email: defaultValues.email || "",
        phone: defaultValues.phone || "",
        department: defaultValues.department || "",
        joinDate: defaultValues.joinDate || "",
      });
    }
  }, [defaultValues, reset]);

  useEffect(() => {
    if (!open && !defaultValues) {
      reset({
        name: "",
        email: "",
        phone: "",
        department: "",
        joinDate: "",
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(async (vals) => await onSubmit(vals))}>
        <div className="form-row">
          <Label requiredMark>Tên</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Nguyễn Văn A" />
            )}
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>
        <div className="form-row">
          <Label requiredMark>Email</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="email@company.com" />
            )}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>
        <div className="form-row">
          <Label>SĐT</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="0987123456" />
            )}
          />
          {errors.phone && (
            <span className="form-error">{errors.phone.message}</span>
          )}
        </div>
        <div className="form-row">
          <Label requiredMark>Phòng ban</Label>
          <Controller
            name="department"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "", label: "-- Chọn --" },
                  ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
                ]}
                placeholder="-- Chọn --"
              />
            )}
          />
          {errors.department && (
            <span className="form-error">{errors.department.message}</span>
          )}
        </div>
        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting || (defaultValues ? !isDirty || !isValid : !isDirty)}
          >
            {submitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}