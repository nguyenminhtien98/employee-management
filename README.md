# Employee Management System

Ứng dụng quản lý nhân viên được xây dựng bằng ReactJS + TypeScript + Vite, sử dụng JSON Server làm mock API.

## 🚀 Demo

- **Live Demo**: [Link demo sẽ được cập nhật sau khi deploy]
- **Repository**: [Link GitHub của bạn]

## Mục lục

- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt](#cài-đặt)
- [Chạy dự án](#chạy-dự-án)
- [API Endpoints](#api-endpoints)

## Tính năng

### Chức năng cốt lõi (CRUD)

- ✅ **Hiển thị danh sách nhân viên** với bảng có đầy đủ thông tin
- ✅ **Thêm nhân viên mới** qua Modal form với validation
- ✅ **Cập nhật thông tin** nhân viên hiện có
- ✅ **Xóa nhân viên** với xác nhận trước khi xóa
- ✅ **Xem chi tiết** nhân viên khi click vào tên

### Tìm kiếm & Lọc

- ✅ **Tìm kiếm theo tên** với debounce 500ms
- ✅ **Tìm kiếm theo email** với debounce 500ms
- ✅ **Lọc theo phòng ban** với custom dropdown
- ✅ **Kết hợp nhiều điều kiện lọc** cùng lúc

### Phân trang

- ✅ **Phân trang server-side** sử dụng `_page` và `_limit` của JSON Server
- ✅ **Điều chỉnh số lượng** items mỗi trang (mặc định: 10)
- ✅ **Hiển thị tổng số trang** và trang hiện tại

### Sắp xếp

- ✅ **Sắp xếp theo Tên** (A-Z hoặc Z-A)
- ✅ **Sắp xếp theo Ngày tham gia** (tăng/giảm dần)
- ✅ **Sắp xếp kết hợp** với tìm kiếm và phân trang

### Tính năng nâng cao

- ✅ **Loading skeleton** khi đang tải dữ liệu
- ✅ **Error handling** với thông báo lỗi rõ ràng
- ✅ **Debounce search** tránh gọi API liên tục
- ✅ **Zustand state management** quản lý params & filters
- ✅ **Form validation** với React Hook Form + Zod
- ✅ **Responsive design** hoạt động tốt trên mobile
- ✅ **Custom components** có thể tái sử dụng

## 🛠 Công nghệ sử dụng

### Frontend

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Zustand** - State Management
- **React Hook Form** - Form Management
- **Zod** - Schema Validation
- **Axios** - HTTP Client

### Backend (Mock)

- **JSON Server** - REST API Mock
- **json-server@0.16.3** - Version ổn định cho pagination

### Styling

- **CSS3** - Custom Styling
- **CSS Variables** - Theming
- **Flexbox/Grid** - Layout

## Cấu trúc dự án

```
employee-management/
├── src/
│   ├── components/          # React Components
│   │   ├── common/         # Shared components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── TableSkeleton.tsx
│   │   │   └── Icons.tsx
│   │   ├── EmployeeTable.tsx
│   │   ├── EmployeeFormModal.tsx
│   │   └── EmployeeDetailModal.tsx
│   ├── pages/              # Page components
│   │   └── EmployeesPage.tsx
│   ├── services/           # API services
│   │   ├── api.ts
│   │   └── employees.ts
│   ├── hooks/              # Custom hooks
│   │   ├── useEmployees.ts
│   │   └── useDebounce.ts
│   ├── store/              # Zustand stores
│   │   └── employeesParams.ts
│   ├── types/              # TypeScript types
│   │   └── employee.ts
│   ├── schemas/            # Zod schemas
│   │   └── employee.ts
│   ├── utils/              # Utility functions
│   │   ├── formatPhoneNumber.ts
│   │   └── formatDate.ts
│   ├── constants/          # Constants
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── db.json                 # JSON Server database
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Cài đặt

### Yêu cầu hệ thống

- Node.js >= 16.x
- npm >= 8.x hoặc yarn >= 1.22.x

### Các bước cài đặt

1. **Clone repository**

```bash
git clone [URL_REPOSITORY_CUA_BAN]
cd employee-management
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cài đặt JSON Server (nếu chưa có)**

```bash
npm install -g json-server@0.16.3
# Hoặc cài local
npm install --save-dev json-server@0.16.3
```

## 🚀 Chạy dự án

### Chạy cả 2 services cùng lúc

**Cách 1: Sử dụng npm scripts (Khuyến nghị)**

Mở 2 terminal riêng biệt:

**Terminal 1 - Chạy JSON Server:**

```bash
npm run api
```

Server sẽ chạy tại: http://localhost:3001

**Terminal 2 - Chạy React App:**

```bash
npm run dev
```

App sẽ chạy tại: http://localhost:5173

**Cách 2: Chạy thủ công**

**Terminal 1 - JSON Server:**

```bash
npx json-server --watch db.json --port 3001
```

**Terminal 2 - React App:**

```bash
npm run dev
```

### Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

### Preview build

```bash
npm run preview
```

## API Endpoints

JSON Server tự động tạo REST API từ file `db.json`:

### Lấy danh sách nhân viên (với pagination & filters)

```
GET /employees?_page=1&_limit=10&name_like=Nguyen&department=Kỹ thuật
```

### Lấy thông tin 1 nhân viên

```
GET /employees/:id
```

### Thêm nhân viên mới

```
POST /employees
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0987654321",
  "department": "Kỹ thuật",
  "joinDate": "2023-01-15"
}
```

### Cập nhật nhân viên

```
PATCH /employees/:id
Content-Type: application/json

{
  "name": "Nguyễn Văn B"
}
```

### Xóa nhân viên

```
DELETE /employees/:id
```

### Query Parameters hỗ trợ

- `_page`: Số trang (bắt đầu từ 1)
- `_limit`: Số items mỗi trang
- `_sort`: Trường cần sort (vd: `name`, `joinDate`)
- `_order`: Thứ tự sort (`asc` hoặc `desc`)
- `name_like`: Tìm kiếm tên (partial match)
- `email_like`: Tìm kiếm email (partial match)
- `department`: Lọc theo phòng ban (exact match)

### Ví dụ kết hợp

```
GET /employees?_page=1&_limit=10&name_like=Van&department=Kỹ thuật&_sort=joinDate&_order=desc
```

## Tính năng UI/UX

- **Responsive Design**: Hoạt động mượt mà trên mọi kích thước màn hình
- **Loading States**: Skeleton loading khi đang tải dữ liệu
- **Error Handling**: Thông báo lỗi rõ ràng, hướng dẫn khắc phục
- **Form Validation**: Validate real-time với thông báo lỗi cụ thể
- **Debounce Search**: Tối ưu performance khi tìm kiếm
- **Hover Effects**: Feedback trực quan khi tương tác
- **Modal Dialogs**: Thêm/sửa/xem chi tiết trong modal
- **Confirmation**: Xác nhận trước khi xóa
- **Custom Dropdown**: Dropdown đẹp hơn select mặc định
- **Date Picker**: Calendar picker cho ngày tham gia
- **Disabled States**: Button disabled khi form chưa hợp lệ

## Scripts có sẵn

```json
{
  "dev": "vite", // Chạy dev server
  "build": "tsc && vite build", // Build production
  "preview": "vite preview", // Preview build
  "api": "json-server --watch db.json --port 3001" // Chạy JSON Server
}
```

## Xử lý lỗi thường gặp

### Lỗi: "Cannot GET /employees"

- **Nguyên nhân**: JSON Server chưa chạy
- **Giải pháp**: Chạy `npm run api` trong terminal riêng

### Lỗi: Port 3001 already in use

- **Nguyên nhân**: Port 3001 đã được sử dụng
- **Giải pháp**:
  - Kill process đang dùng port 3001
  - Hoặc đổi port trong file `.env`: `VITE_API_URL=http://localhost:3002`
  - Chạy: `json-server --watch db.json --port 3002`

### Lỗi: Pagination không hoạt động

- **Nguyên nhân**: Sai version JSON Server
- **Giải pháp**: Cài đúng version `json-server@0.16.3`

```bash
npm uninstall json-server
npm install json-server@0.16.3
```

## Environment Variables

Tạo file `.env` ở root directory:

```env
VITE_API_URL=http://localhost:3001
```

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

MIT License - Xem file [LICENSE](LICENSE) để biết thêm chi tiết

## Tác giả

[Nguyễn Minh Tiến] - [nguyenminhtienhy98@gmail.com]

## Liên hệ

- GitHub: [Link GitHub của bạn]
- Email: [nguyenminhtienhy98@gmail.com]

---

⭐️ Nếu project này hữu ích, hãy cho một star nhé!
