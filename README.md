# UNISTY — University & Opportunity Skill Marketplace
> **Nền tảng kết nối kỹ năng & việc làm tự do cho sinh viên Trường Đại học Kinh tế – Đại học Đà Nẵng (DUE)**  
> **Đề tài bài tập nhóm môn Kinh tế số • Lớp 50K32.3 • Nhóm Unisty**

---

> 📋 **Xem nhanh:** Đọc toàn bộ lịch sử nâng cấp hệ thống & kịch bản trình diễn tại [**LICHSU_CHINHSUA.md**](./LICHSU_CHINHSUA.md).  
> 👥 **Danh sách tài khoản diễn tập:** Xem chi tiết tại [**Tai-Khoan-UNISTY.csv**](./Tai-Khoan-UNISTY.csv).

## 👥 Nhóm tác giả thực hiện (Lớp 50K32.3)
1. **Nguyễn Tuấn Anh**
2. **Nguyễn Thu Hiền**
3. **Phạm Thị Tú Vân**
4. **Nguyễn Thảo Vy**
5. **Trương Hoàng Song Thanh**
6. **Huỳnh Thị Kim Ngân**

---

## 🎯 Ý nghĩa & Sứ mệnh Đề tài

### 1. Ý nghĩa tên gọi
* **UNISTY** = **UNI**versity (Trường Đại học) + Opportun**ITY** (Cơ hội việc làm).
* Giải quyết bài toán "con gà - quả trứng" của sinh viên mới bắt đầu làm freelancer: Khó cạnh tranh trên các sàn lớn (Upwork, Fiverr) do chưa có đánh giá và kinh nghiệm thực tế.

### 2. Mô hình "Vườn ươm kỹ năng" (Freelance Sandbox)
* Tạo lập môi trường việc làm quy mô vừa và nhỏ ngay trong khuôn viên Đại học Kinh tế – ĐH Đà Nẵng.
* Thay thế CV truyền thống bằng **Hồ sơ năng lực thực chiến (Proof of Work)**: Tích hợp giải thưởng NCKH, học bổng, chứng chỉ IELTS/MOS, dự án mẫu và đánh giá 5 sao từ khách hàng thực tế.
* Ứng dụng nguyên lý **Thanh toán đảm bảo (Escrow)**: Khách hàng nạp tiền tạm giữ, sinh viên làm bài và chỉ nhận thù lao khi khách đã kiểm tra và duyệt bài.

---

## 🚀 Các tính năng cốt lõi (MVP)

1. **Sàn việc làm 2 chiều (Dual Marketplace):**
   * **Dịch vụ sinh viên:** Sinh viên chủ động đăng gói dịch vụ thế mạnh (Slide thuyết trình, xử lý số liệu SPSS, video CapCut, dịch thuật tài liệu...).
   * **Nhu cầu tuyển dụng:** Sinh viên hoặc khách hàng bên ngoài đăng việc cần tìm người làm.
2. **Quy trình kết nối & Đề xuất (Proposal Approval Flow):**
   * Cho phép ứng viên gửi đề xuất giá và kế hoạch.
   * Người đăng bài có thể xem danh sách đề xuất, kiểm tra portfolio của từng bạn và bấm chọn bạn phù hợp để bắt đầu hợp đồng.
3. **Phòng làm việc trực tuyến (Work Room):**
   * Chu trình 4 giai đoạn chuẩn mực: **Chờ thanh toán ➔ Đang thực hiện ➔ Bàn giao ➔ Duyệt & Hoàn tất**.
   * Trao đổi tin nhắn trực tiếp giữa hai bên.
   * Nộp liên kết sản phẩm (Google Drive, Canva, Figma...) và tính năng yêu cầu chỉnh sửa (Revision Request).
4. **Cơ chế Thanh toán đảm bảo (Escrow Sandbox):**
   * Tích hợp mã VietQR Sandbox và thanh toán qua ví nội bộ.
   * Tuân thủ nguyên lý Bảo toàn tiền tệ (Conservation of Money).
5. **Hồ sơ năng lực sinh viên (Mini-LinkedIn Portfolio):**
   * Thẻ định danh sinh viên DUE đã xác thực.
   * 3 chỉ số uy tín: Số dự án hoàn thành, Điểm đánh giá trung bình, Tỷ lệ giao đúng hạn.
   * Mục Thành tựu học thuật (NCKH, Học bổng, Chứng chỉ quốc tế).
   * Thư viện sản phẩm mẫu và đánh giá từ khách hàng cũ.
6. **Chuẩn PWA (Progressive Web App):**
   * Hỗ trợ cài đặt trực tiếp vào màn hình chính điện thoại thông minh (Add to Home Screen).
   * Thanh điều hướng đáy di động (Mobile Bottom Nav) mượt mà như app native.
7. **Trung tâm Quản trị & Công cụ Trình diễn (Presenter DevTools):**
   * Đổi vai nhanh giữa Sinh viên DUE, Khách hàng ngoài trường, Ban quản trị.
   * Nút kiểm tra tài chính và khôi phục dữ liệu mẫu 1-click.

---

## 🛠️ Hướng dẫn Khởi chạy trên Máy tính (Local)

### Cách 1: Sử dụng File khởi động 1-click (Dành cho Windows)
Chỉ cần nhấp đúp vào file:
```
Khoi-Dong-UNISTY.bat
```
Hệ thống sẽ tự động bật trình duyệt web tại `http://localhost:5173/` và khởi chạy máy chủ.

### Cách 2: Sử dụng dòng lệnh Bun / Node
```bash
# Cài đặt thư viện (nếu chưa cài)
bun install
# hoặc: npm install

# Chạy môi trường phát triển
bun dev
# hoặc: npm run dev
```

---

## 🌐 Hướng dẫn Đưa web lên Internet (Deploy Vercel - Miễn phí)

1. Đăng ký tài khoản miễn phí tại [vercel.com](https://vercel.com).
2. Kết nối tài khoản GitHub của bạn.
3. Nhấn **Add New Project** ➔ Chọn kho mã nguồn `unisty`.
4. Giữ nguyên các thông số mặc định (Framework Preset: **Vite**).
5. Nhấn **Deploy**. Sau khoảng 1 phút, bạn sẽ có đường link public trực tuyến (ví dụ: `unisty-due.vercel.app`) để chia sẻ cho thầy cô và bạn bè!

---

## 📁 Cấu trúc Thư mục Dự án

```
unisty/
├── public/                 # Manifest PWA, Icons, Service Worker
│   ├── icon.svg
│   ├── manifest.webmanifest
│   └── sw.js
├── src/
│   ├── components/         # Các thành phần giao diện dùng chung
│   │   ├── EscrowPaymentModal.tsx
│   │   ├── Footer.tsx
│   │   ├── ListingCard.tsx
│   │   ├── MobileBottomNav.tsx
│   │   ├── Navbar.tsx
│   │   └── PresenterToolbar.tsx
│   ├── data/               # Kho dữ liệu MockStore & Fixtures
│   │   ├── mockFixtures.ts
│   │   └── mockStore.ts
│   ├── pages/              # Các trang chính
│   │   ├── AboutPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ListingDetailPage.tsx
│   │   ├── MarketplacePage.tsx
│   │   ├── NewListingPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── WorkPage.tsx
│   ├── types/              # Định nghĩa Typescript
│   │   └── index.ts
│   ├── App.tsx             # Định tuyến React Router
│   └── main.tsx            # Điểm khởi chạy & Đăng ký PWA
├── supabase/
│   └── migrations/         # Script khởi tạo Database PostgreSQL (Supabase)
├── Khoi-Dong-UNISTY.bat    # Phím tắt khởi chạy 1-click cho Windows
├── vercel.json             # Cấu hình SPA routing trên Vercel
└── package.json
```

---
*© 2026 UNISTY. Đề tài Kinh tế số Lớp 50K32.3 • Trường Đại học Kinh tế – Đại học Đà Nẵng.*
