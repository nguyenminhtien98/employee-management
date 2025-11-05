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
    register,
    handleSubmit,
    reset,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      joinDate: "",
      ...defaultValues,
    },
  });

  const watchedFields = watch();
  const hasValues =
    watchedFields.name && watchedFields.email && watchedFields.department;

  const isFormValid = hasValues && Object.keys(errors).length === 0;

  useEffect(() => {
    reset({
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      phone: defaultValues?.phone || "",
      department: defaultValues?.department || "",
      joinDate: defaultValues?.joinDate || "",
    });
    if (defaultValues) {
      clearErrors();
    }
  }, [defaultValues, reset, clearErrors]);

  useEffect(() => {
    if (!open) {
      if (!defaultValues) {
        reset({
          name: "",
          email: "",
          phone: "",
          department: "",
          joinDate: "",
        });
      }
      clearErrors();
    }
  }, [open, defaultValues, reset, clearErrors]);

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit(async (vals) => await onSubmit(vals))}>
        <div className="form-row">
          <Label requiredMark>Tên</Label>
          <Input {...register("name")} placeholder="Nguyễn Văn A" />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>
        <div className="form-row">
          <Label requiredMark>Email</Label>
          <Input {...register("email")} placeholder="email@company.com" />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>
        <div className="form-row">
          <Label>SĐT</Label>
          <Input {...register("phone")} placeholder="0987123456" />
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
          <Button type="button" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || submitting}
          >
            {submitting ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
