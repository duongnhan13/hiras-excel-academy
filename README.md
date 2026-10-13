# Excel Assessment Platform - KNTH

Hệ thống đánh giá năng lực Excel chuyên sâu dành cho Kế toán & Tài chính.

## Tính năng chính
- **Học tập đa cấp độ:** Hệ thống bài học từ Cơ bản, Trung cấp đến Nâng cao (Power Query, Tài chính).
- **Ngân hàng câu hỏi thông minh:** Hơn 150+ câu hỏi trắc nghiệm được sinh tự động với tình huống thực tế.
- **Cơ chế chống gian lận:** Vô hiệu hóa Copy/Paste, Chụp màn hình và khóa tài khoản khi hủy bài thi.
- **Báo cáo năng lực:** Thống kê chi tiết điểm số và tiến độ học tập cho từng nhân viên.
- **Bảng xếp hạng:** Thi đua năng lực giữa các thành viên trong hệ thống.
- **Quản trị hệ thống:** Admin có thể quản lý người dùng, phân quyền và cài đặt thời gian thi.

## Cấu trúc thư mục
- `src/App.tsx`: Thành phần chính xử lý giao diện và logic ứng dụng.
- `src/data/excelData.ts`: Ngân hàng câu hỏi và nội dung bài học.
- `src/data/mockDB.ts`: Hệ thống lưu trữ dữ liệu giả lập sử dụng LocalStorage.
- `src/index.css`: Hệ thống thiết kế (Design System) với phong cách Premium Glassmorphism.

## Hướng dẫn khởi chạy
1. Cài đặt dependency: `npm install`
2. Chạy môi trường phát triển: `npm run dev`
3. Xây dựng bản production: `npm run build`

## Thông tin đăng nhập mặc định
- **Admin:** `admin` / `admin`
- **User:** `NV001` / `123`
