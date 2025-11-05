Employee Management System

Ứng dụng quản lý nhân viên được xây dựng bằng ReactJS + TypeScript + Vite, sử dụng JSON Server làm mock API.

🚀 Demo

Live Demo: https://employee-management-eight-eta.vercel.app/

Repository: https://github.com/nguyenminhtien98/employee-management

Mục lục

Tính năng

Công nghệ sử dụng

Cấu trúc dự án

Cài đặt

Chạy dự án

API Endpoints

Tính năng

Chức năng cốt lõi (CRUD)

✅ Hiển thị danh sách nhân viên với bảng có đầy đủ thông tin.

✅ Thêm nhân viên mới qua Modal form với validation.

✅ Cập nhật thông tin nhân viên hiện có.

✅ Xóa nhân viên với xác nhận trước khi xóa.

✅ Xem chi tiết nhân viên khi click vào tên.

Tìm kiếm & Lọc

✅ Tìm kiếm theo tên với debounce 500ms.

✅ Tìm kiếm theo email với debounce 500ms.

✅ Lọc theo phòng ban với custom dropdown.

✅ Kết hợp nhiều điều kiện lọc cùng lúc.

Phân trang

✅ Phân trang server-side sử dụng \_page và \_limit của JSON Server.

✅ Điều chỉnh số lượng items mỗi trang (10-100).

✅ Hiển thị tổng số trang và trang hiện tại.

Sắp xếp

✅ Sắp xếp theo Tên (A-Z hoặc Z-A).

✅ Sắp xếp theo Ngày tham gia (tăng/giảm dần).

Validation & Xử lý nghiệp vụ

✅ Email validation: Kiểm tra format email hợp lệ.

✅ Phone validation: Kiểm tra số điện thoại 10 chữ số.

✅ Required fields: Các trường bắt buộc phải nhập.

✅ Kiểm tra trùng lặp (Server-side): Logic kiểm tra nhân viên đã tồn tại (dựa trên tên, email, SĐT, phòng ban) được thực hiện ở tầng service API trước khi gửi request POST, giả lập hành vi của server.

Tính năng UI/UX

✅ Toast notifications: Hiển thị thông báo (toast) khi thêm, sửa, hoặc xóa nhân viên thành công hoặc thất bại.

✅ Disable Button: Nút "Lưu" trong modal sẽ bị vô hiệu hóa (disabled) và hiển thị text "Đang lưu..." trong khi đang thực hiện gọi API (thêm/sửa).

✅ Loading skeleton khi đang tải dữ liệu.

✅ Error handling với thông báo lỗi rõ ràng.

✅ Debounce search tránh gọi API liên tục.

✅ Zustand state management quản lý params & filters.

✅ Form validation với React Hook Form + Zod.

✅ Responsive design hoạt động tốt trên mobile.

🛠 Công nghệ sử dụng

Frontend

React 18 - UI Library

TypeScript - Type Safety

Vite - Build Tool

Zustand - State Management

React Hook Form - Form Management

Zod - Schema Validation

Axios - HTTP Client

React Toastify - Toast Notifications

Backend (Mock)

JSON Server - REST API Mock

Styling

CSS3 - Custom Styling

CSS Variables - Theming

Flexbox/Grid - Layout

Cấu trúc dự án

(Cập nhật theo hình ảnh bạn cung cấp)

employee-management/
├── public/
├── src/
│ ├── assets/
│ │ └── react.svg
│ ├── components/
│ │ ├── common/
│ │ │ ├── Button.tsx
│ │ │ ├── Dropdown.tsx
│ │ │ ├── Icons.tsx
│ │ │ ├── Input.tsx
│ │ │ ├── Label.tsx
│ │ │ ├── Modal.tsx
│ │ │ └── Table.tsx
│ │ ├── loading/
│ │ │ ├── Skeleton.tsx
│ │ │ └── TableSkeleton.tsx
│ │ ├── EmployeeDetailModal.tsx
│ │ ├── EmployeeFormModal.tsx
│ │ └── EmployeeTable.tsx
│ ├── constants/
│ │ └── index.ts
│ ├── hooks/
│ │ ├── useDebounce.ts
│ │ └── useEmployees.ts
│ ├── pages/
│ │ └── EmployeesPage.tsx
│ ├── schemas/
│ │ └── employee.ts
│ ├── services/
│ │ ├── api.ts
│ │ └── employees.ts
│ ├── store/
│ │ └── employeesParams.ts
│ ├── types/
│ │ └── employee.ts
│ ├── utils/
│ │ ├── formatDate.ts
│ │ ├── formatPhoneNumber.ts
│ │ ├── validateEmail.ts
│ │ └── validatePhone.ts
│ ├── App.css
│ ├── App.tsx
│ ├── index.css
│ └── main.tsx
├── .gitignore
├── db.json
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

Cài đặt

Yêu cầu hệ thống

Node.js >= 16.x

npm hoặc yarn

Các bước cài đặt

Clone repository

git clone (https://github.com/nguyenminhtien98/employee-management.git)
cd employee-management

Cài đặt dependencies

npm install

# hoặc

yarn install

🚀 Chạy dự án

Mở 2 terminal riêng biệt:

Terminal 1 - Chạy JSON Server (API):

npm run api

Server sẽ chạy tại: http://localhost:3001

Terminal 2 - Chạy React App (Frontend):

npm run dev

App sẽ chạy tại: http://localhost:5173 (hoặc một port khác nếu 5173 bận)

Build cho production

npm run build

File build sẽ được tạo trong thư mục dist/

API Endpoints

JSON Server tự động tạo REST API từ file db.json:

GET /employees: Lấy danh sách nhân viên (hỗ trợ \_page, \_limit, \_sort, \_order, và các bộ lọc field_like=value hoặc field=value).

GET /employees/:id: Lấy thông tin 1 nhân viên.

POST /employees: Thêm nhân viên mới.

PATCH /employees/:id: Cập nhật một phần thông tin nhân viên.

PUT /employees/:id: Cập nhật toàn bộ thông tin nhân viên.

DELETE /employees/:id: Xóa nhân viên.

Scripts có sẵn

{
"dev": "vite",
"build": "tsc && vite build",
Example"preview": "vite preview",
"api": "json-server --watch db.json --port 3001"
}

Tác giả

Nguyễn Minh Tiến - nguyenminhtienhy98@gmail.com
