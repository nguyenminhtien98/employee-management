import { z } from "zod";
import { validateEmail } from "../utils/validateEmail";
import { validatePhone } from "../utils/validatePhone";

export const employeeFormSchema = z.object({
  name: z.string().trim().min(1, "Tên không được để trống").max(100),
  email: z
    .string()
    .trim()
    .min(1, "Email không được để trống")
    .max(120, "Email không được quá 120 ký tự")
    .refine((val) => validateEmail(val), {
      message: "Email không đúng định dạng",
    }),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") {
          return true;
        }
        return validatePhone(val);
      },
      {
        message: "Số điện thoại phải có đúng 10 chữ số",
      }
    ),
  department: z.string().trim().min(1, "Phòng ban là bắt buộc"),
  joinDate: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") {
          return true;
        }
        return /^\d{4}-\d{2}-\d{2}$/.test(val);
      },
      {
        message: "Ngày tham gia phải là YYYY-MM-DD",
      }
    ),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
