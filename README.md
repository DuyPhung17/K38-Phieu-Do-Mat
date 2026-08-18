# Ứng Dụng Web Điền Phiếu Thực Hành Khúc Xạ Mắt (Optometry Web)

Ứng dụng web hỗ trợ luyện tập, nháp kết quả khám khúc xạ mắt (**Phiếu thực hành chủ quan** & **Phiếu thực hành Skiascopy**) thay thế việc ghi giấy thủ công. Thiết kế tối ưu chuyên biệt cho điện thoại di động (Mobile First).

---

## 🌟 Tính Năng Nổi Bật

1. **Nhập Tên Bệnh Nhân & Quản lý Ca trong Phiên (`sessionStorage`)**:
   - Nhập tên bệnh nhân trước khi chọn form khám.
   - 1 bệnh nhân có thể làm cả **Phiếu Chủ Quan** và **Phiếu Skiascopy**.
   - Dữ liệu lưu trong `sessionStorage` (an toàn, siêu nhẹ máy, đóng trình duyệt/tab là tự động xóa trắng).
   - Danh sách các ca đã thực hành hiển thị trực quan ở trang chủ, bấm vào để điền tiếp hoặc xem kết quả.

2. **Giao diện Điền Từng Bước (Step-by-Step UI)**:
   - **Cột Tab bên trái**: Liệt kê các bước, làm nổi bật bước đang chọn, bấm vào tab nào nhảy ngay tới bước đó.
   - **Điền song song MP & MT**: Ô nhập liệu Mắt phải (MP) và Mắt trái (MT) to, rõ, dễ chạm trên mobile.
   - **Bàn phím ảo nhanh 1 chạm (Virtual Keypad)**: Nằm ngay dưới ô nhập liệu với các phím ký hiệu `°`, `⁻`, `+`, `-`, `x`, các độ chuẩn `.25`, `.50`, `.75`, `1.00`, `180°`, `90°` và nút chuyển bước tiếp theo `>`.

3. **Màn hình Form Hoàn Chỉnh (Full Result View)**:
   - Bấm nút **"Xem kết quả ➔"** bất cứ lúc nào để xem toàn bộ bảng tổng hợp MP & MT của các bước theo chuẩn mẫu phiếu giấy y khoa.
   - Chạm vào bất kỳ dòng nào trong bảng để quay lại sửa bước đó ngay lập tức.
   - Nút **"✏️ Chọn tab để điền tiếp"** và **"➕ Làm ca mới"**.

---

## 📁 Cấu Trúc Mã Nguồn

```
phieu-kham-mat/
├── index.html          # File HTML chính (Giao diện chuẩn Responsive Tailwind)
├── css/
│   └── style.css       # Style tùy biến cho cảm ứng mobile, bàn phím ảo và bảng y khoa
├── js/
│   ├── config.js       # Dữ liệu 17 bước Chủ Quan & 15 mục Skiascopy
│   ├── storage.js      # Module quản lý sessionStorage
│   └── app.js          # Logic điều hướng, bàn phím ảo, stepper và render kết quả
└── README.md           # Tài liệu hướng dẫn sử dụng và deploy
```

---

## 🚀 Hướng Dẫn Sử Dụng & Mở Nhanh Trên Máy

Bạn có thể mở trực tiếp file `index.html` bằng bất kỳ trình duyệt nào (Chrome, Safari, Edge, Cốc Cốc) trên máy tính hoặc điện thoại mà không cần cài đặt thêm phần mềm nào.

---

## 🌐 Hướng Dẫn Deploy Lên GitHub Pages (Dùng Trên Điện Thoại Miễn Phí)

Để có một đường link web (dạng `https://username.github.io/phieu-kham-mat/`) mở trên điện thoại bất cứ lúc nào:

1. **Tạo Repository trên GitHub**:
   - Truy cập [github.com](https://github.com) và tạo một repo mới (ví dụ đặt tên là `phieu-kham-mat`).
2. **Đẩy mã nguồn lên GitHub**:
   Mở terminal / PowerShell tại thư mục này và chạy:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao web phieu kham mat"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/phieu-kham-mat.git
   git push -u origin main
   ```
3. **Bật GitHub Pages**:
   - Vào mục **Settings** của repository trên GitHub.
   - Chọn mục **Pages** ở thanh menu bên trái.
   - Tại phần **Branch**, chọn nhánh `main` và thư mục `/ (root)` rồi bấm **Save**.
   - Sau khoảng 1 phút, GitHub sẽ cấp cho bạn một đường link web miễn phí để mở trên điện thoại!
