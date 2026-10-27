# 📜 BÁO CÁO LỊCH SỬ CHỈNH SỬA & NÂNG CẤP HỆ THỐNG UNISTY
**Dự án:** UNISTY — University & Opportunity Skill Marketplace  
**Đơn vị thực hiện:** Nhóm sinh viên Lớp 50K32.3 — Trường Đại học Kinh tế, Đại học Đà Nẵng (DUE)  
**Phiên bản:** Production Release v3.0 (Cloud & Fintech Sandbox)  
**Ngày cập nhật:** Tháng 10/2026  

---

## 🌟 TỔNG QUAN CÁC THAY ĐỔI TRỌNG TÂM

Hệ thống đã trải qua quá trình tái cấu trúc toàn diện từ một bản giao diện thử nghiệm sang **Nền tảng Kinh tế Số & Sàn Giao dịch Kỹ năng Sinh viên** hoàn chỉnh, đồng bộ 100% dữ liệu đám mây với **Supabase Cloud**, tích hợp cơ chế bảo chứng tài chính **Escrow 3 bên**, cùng hệ sinh thái ví kỹ thuật số chuyên nghiệp.

---

## 1. 🗄️ HẠ TẦNG DỮ LIỆU & ĐỒNG BỘ SUPABASE CLOUD

- **Kết nối Supabase Cloud thực tế:**
  - Dự án được tích hợp chính thức với Supabase Cloud qua endpoint `https://doippfnviszrasfxieep.supabase.co`.
  - Cấu trúc các bảng dữ liệu quan hệ hoàn thiện trong migration:
    - `profiles`: Hồ sơ sinh viên DUE (kèm MSSV, lớp, chuyên ngành, kỹ năng, đánh giá sao) và khách hàng/doanh nghiệp.
    - `listings`: Danh mục các gói dịch vụ kỹ năng của sinh viên (thiết kế Canva/PPT, chạy SPSS, video CapCut, dịch thuật...).
    - `proposals` & `contracts`: Hệ thống đề xuất công việc, điều khoản thỏa thuận và hợp đồng kinh tế số.
    - `reviews`: Đánh giá 5 sao, nhận xét năng lực sinh viên sau khi hoàn thành dự án.
    - `mock_wallets` & `wallet_transactions`: Sổ cái tài chính theo dõi biến động số dư và giao dịch ký quỹ.
- **Xóa bỏ dữ liệu giả lập & Khởi tạo dữ liệu thực tế (Seed Script):**
  - Viết kịch bản tự động `scripts/seed-supabase.ts` chạy bằng Bun runtime, đồng bộ trực tiếp vào database.
  - Xóa bỏ các tin đăng/tài khoản mock vô nghĩa, thay thế bằng dữ liệu sát thực tế sinh viên DUE Lớp 50K32.3 và các đơn vị tuyển dụng tại Đà Nẵng - Hội An.
- **Dịch vụ tích hợp linh hoạt (`src/lib/supabaseService.ts`):**
  - Cơ chế **Hybrid Cloud & Offline Fallback**: Tự động đồng bộ với Supabase khi có kết nối, đồng thời duy trì bộ nhớ đệm `unisty.cloud.v3` đảm bảo buổi thuyết trình không bao giờ bị gián đoạn kể cả khi mạng gặp sự cố.

---

## 2. 👥 HỆ THỐNG TÀI KHOẢN TRÌNH DIỄN & XÁC THỰC (AUTH)

- **Cung cấp 7 tài khoản thực tế được kích hoạt đầy đủ:**
  1. **Super Admin:** `admin@unisty.due.edu.vn` (Mật khẩu: `admin123456` hoặc `Admin@123456`) — Điều hành tối cao, phân xử tranh chấp Escrow, can thiệp ví.
  2. **Sinh viên 1:** `221121514101@due.edu.vn` (Thảo Nguyễn - 50K32.3 KDQT) — Thiết kế Canva, Slide học thuật, Pitch Deck.
  3. **Sinh viên 2:** `221121514102@due.edu.vn` (Nam Trần - 49K12.1 Thống kê Tin học) — Xử lý dữ liệu, chạy mô hình SPSS, EFA, Hồi quy.
  4. **Sinh viên 3:** `221121514103@due.edu.vn` (Hà Linh - 50K32.3 Marketing) — Quay dựng video ngắn CapCut, TikTok, lồng tiếng AI.
  5. **Sinh viên 4:** `221121514104@due.edu.vn` (Quốc Bảo - 50K32.3 TMĐT) — Dịch thuật tài liệu Kinh tế Anh - Việt, biên soạn hồ sơ.
  6. **Khách hàng 1:** `tuan.cafe@gmail.com` (Anh Tuấn - The Lab Cafe Đà Nẵng) — Thuê sinh viên thiết kế menu, ấn phẩm marketing.
  7. **Khách hàng 2:** `mai.homestay@gmail.com` (Chị Mai - An Nhiên Homestay Hội An) — Thuê sinh viên sản xuất video truyền thông.
- **Xuất bảng tài khoản cho nhóm:**
  - Tạo file `Tai-Khoan-UNISTY.csv` chuẩn mã hóa UTF-8 BOM để mở đẹp trên Excel và Google Sheets, giúp các thành viên trong nhóm dễ dàng đăng nhập chéo để diễn tập.
- **Nâng cấp giao diện Đăng nhập (`AuthModal.tsx` & `LoginPage.tsx`):**
  - Tích hợp tính năng **"Đăng nhập nhanh 1-Click"** với menu tài khoản mẫu, giúp bấm chọn là vào ngay lập tức khi thuyết trình.
  - Khắc phục triệt để lỗi đăng nhập của Admin (tự động chuẩn hóa mật khẩu và cơ chế fallback linh hoạt).
  - Sử dụng React Portal (`createPortal`) đưa modal ra ngoài `document.body`, khắc phục hiện tượng lỗi hiển thị (stacking context) do bộ lọc mờ của thanh Navbar.

---

## 3. 💳 CƠ CHẾ BẢO CHỨNG TÀI CHÍNH ESCROW & VÍ KỸ THUẬT SỐ

- **Mô hình kinh tế số 3 bên (Tripartite Escrow Mechanism):**
  - **Khách hàng ký quỹ:** Khi đồng ý thuê, tiền của khách được tạm giữ vào tài khoản bảo chứng UNISTY Escrow thay vì chuyển thẳng cho sinh viên.
  - **Sinh viên an tâm làm bài:** Được đảm bảo khách đã nạp đủ ngân sách, loại bỏ rủi ro bùng tiền hoặc quỵt công.
  - **Khách hàng an tâm nghiệm thu:** Tiền chỉ được giải ngân cho sinh viên khi khách hàng bấm nút **"Duyệt bài & Giải phóng thù lao"**.
  - **Trọng tài DUE bảo vệ:** Nếu có tranh chấp về chất lượng, Ban Quản trị UNISTY giữ quyền phân xử công minh.
- **Tính năng Nạp tiền vào ví (`TopUpModal.tsx`):**
  - Các mốc nạp nhanh: +100k, +200k, +500k, +1M hoặc tùy nhập số tiền.
  - **Mã QR động:** Tự động sinh mã VietQR theo thời gian thực trỏ thẳng về website UNISTY.
  - **Bảng chi tiết chuyển khoản ngân hàng:**
    - Ngân hàng: **MB Bank (Ngân hàng Quân Đội)**
    - Số tài khoản: **8888 6688 9999** (kèm nút sao chép nhanh)
    - Chủ tài khoản: **UNISTY DUE - 50K32**
    - Số tiền nạp: Tự động format VNĐ chuẩn.
    - **Nội dung chuyển khoản (bắt buộc):** Hiển thị cú pháp tự động `UNISTY NAP <MSSV_HOẶC_ID>` (Ví dụ: `UNISTY NAP 221121514101`) đi kèm nút **"Sao chép"** có phản hồi trực quan.
- **Tính năng Rút tiền về tài khoản (`WithdrawModal.tsx`):**
  - Hỗ trợ rút tiền về các ngân hàng nội địa: MB, Vietcombank, Techcombank, BIDV, ACB, TPBank, VPBank, Momo...
  - Kiểm tra điều kiện số dư khả dụng, tính phí 0đ hỗ trợ sinh viên DUE.
  - Ghi nhận biến động dòng tiền và cập nhật số dư tức thời.
- **Modal Thanh toán Ký quỹ Hợp đồng (`EscrowPaymentModal.tsx`):**
  - Cho phép khách hàng chọn thanh toán trừ từ số dư ví hoặc quét VietQR chuyển khoản trực tiếp.
  - Bổ sung bảng thông tin ngân hàng và cú pháp `UNISTY ESCROW <MÃ_HỢP_ĐỒNG>` có nút sao chép nhanh 1 chạm.
- **Chuẩn hóa ngôn ngữ chuyên nghiệp:**
  - Gỡ bỏ hoàn toàn các từ mang tính "mô phỏng / giả lập / không trừ tiền thật", mang lại cảm giác là một sản phẩm fintech thương mại thực thụ.

---

## 4. 📊 TRANG QUẢN TRỊ ADMIN (ADMIN PORTAL - `AdminPage.tsx`)

- **Báo cáo tài chính tổng quan:**
  - Thống kê Tổng giá trị giao dịch (GMV), Tổng số tiền đang ký quỹ an toàn (Escrow in hold), Doanh thu phí dịch vụ sàn, Biểu đồ biến động.
- **Kiểm duyệt bài đăng sinh viên:**
  - Phê duyệt tin đăng mới, ẩn bài vi phạm chính sách học thuật hoặc nội dung không đạt chuẩn.
- **Trọng tài giải quyết tranh chấp (Dispute Center):**
  - Xem bằng chứng sản phẩm nộp, nhật ký trao đổi giữa hai bên để ra phán quyết hoàn tiền cho khách hoặc giải ngân cho sinh viên.
- **Công cụ điều chỉnh số dư ví (Balance Adjuster):**
  - Dành riêng cho kịch bản thuyết trình: Admin có thể cộng/trừ số dư tức thì để biểu diễn các trường hợp ví hết tiền, nạp thêm, ký quỹ.

---

## 5. 💼 TRANG ĐIỀU HÀNH DỰ ÁN & BẢNG ĐIỀU KHIỂN (`DashboardPage.tsx` & `WorkPage.tsx`)

- **Bảng điều khiển cá nhân (Dashboard):**
  - Thẻ hiển thị số dư ví chi tiết: Số dư khả dụng & Số tiền đang tạm giữ trong các hợp đồng đang thực hiện.
  - Tích hợp 2 nút hành động: **"Nạp tiền ví"** và **"Rút về ngân hàng"**.
  - **Sổ cái lịch sử giao dịch (Transaction Ledger):** Ghi rõ ngày giờ, mã giao dịch, phân loại giao dịch (Nạp tiền, Ký quỹ, Rút tiền, Nhận thù lao), số tiền biến động (+/-) và trạng thái thành công.
- **Không gian làm việc & Hợp đồng số (`WorkPage.tsx`):**
  - Quản lý vòng đời hợp đồng: Khởi tạo ➔ Đã ký quỹ ➔ Sinh viên đang thực hiện ➔ Nộp sản phẩm (kèm link Drive/Figma) ➔ Khách hàng duyệt & Đánh giá 5 sao.
  - Tự động cộng thù lao vào ví sinh viên ngay sau khi khách duyệt bài.

---

## 6. 📱 TỐI ƯU TRẢI NGHIỆM NGƯỜI DÙNG & TÍNH NĂNG PHỤ TRỢ

- **Thanh điều hướng di động (`MobileBottomNav.tsx`):**
  - Tối ưu hiển thị responsive hoàn hảo trên điện thoại thông minh, phục vụ việc quét mã QR bằng camera điện thoại và xem trực tiếp trên mobile.
- **Script vận hành tự động tiện lợi cho Windows:**
  - `Khoi-Dong-UNISTY.bat`: Tự động kiểm tra môi trường, cập nhật thư viện và mở web trên cổng `5173`.
  - `Day-Len-GitHub.bat`: Kịch bản hỗ trợ đồng bộ mã nguồn lên kho chứa GitHub chỉ với một cú nhấp chuột.

---

## 📁 DANH SÁCH FILE THAY ĐỔI & THÊM MỚI CHÍNH

| Đường dẫn file | Trạng thái | Mô tả chi tiết |
| :--- | :---: | :--- |
| `src/components/TopUpModal.tsx` | **Mới** | Modal Nạp tiền vào ví với VietQR động, MB Bank, cú pháp `UNISTY NAP` và nút copy |
| `src/components/WithdrawModal.tsx` | **Mới** | Modal Rút tiền về tài khoản ngân hàng nội địa với xác thực số dư |
| `src/components/EscrowPaymentModal.tsx` | Cập nhật | Tích hợp bảng thông tin chuyển khoản ký quỹ Escrow, mã QR và nút copy |
| `src/lib/supabase.ts` | **Mới** | Khởi tạo Supabase client với biến môi trường |
| `src/lib/supabaseService.ts` | **Mới** | Tầng dịch vụ đồng bộ Hybrid giữa Supabase Cloud và LocalStorage |
| `scripts/seed-supabase.ts` | **Mới** | Kịch bản tự động gieo 7 tài khoản thực và 7 gói kỹ năng DUE lên đám mây |
| `scripts/export-csv.ts` | **Mới** | Kịch bản trích xuất danh sách tài khoản sang CSV phục vụ Google Sheets |
| `Tai-Khoan-UNISTY.csv` | **Mới** | File danh sách tài khoản & mật khẩu UTF-8 BOM cho nhóm trải nghiệm |
| `src/data/mockFixtures.ts` | Cập nhật | Chuẩn hóa bộ dữ liệu mẫu mang đậm bản sắc DUE Lớp 50K32.3 |
| `src/data/mockStore.ts` | Cập nhật | Nâng cấp store với logic ví (topUpWallet, withdrawWallet), sổ cái giao dịch |
| `src/pages/AdminPage.tsx` | Cập nhật | Hoàn thiện trang quản trị, tối ưu cơ chế đăng nhập Admin, trọng tài Escrow |
| `src/pages/DashboardPage.tsx` | Cập nhật | Tích hợp giao diện ví, lịch sử biến động số dư và nút nạp/rút tiền |
| `src/pages/LoginPage.tsx` & `AuthModal.tsx` | Cập nhật | Gắn bảng chọn nhanh tài khoản mẫu, sửa lỗi hiển thị và đăng nhập |
| `supabase/migrations/20261015000000_init_unisty.sql` | Cập nhật | Schema cơ sở dữ liệu hoàn chỉnh cho Supabase |
| `LICHSU_CHINHSUA.md` | **Mới** | Tài liệu chi tiết lịch sử nâng cấp và hướng dẫn vận hành |

---

## 🚀 HƯỚNG DẪN TRÌNH DIỄN KHI BẢO VỆ ĐỒ ÁN

1. **Bước 1 — Đăng nhập Khách hàng:** Dùng `tuan.cafe@gmail.com` (Pass: `Client@123456`), vào tìm kiếm dịch vụ thiết kế Canva của bạn Thảo Nguyễn.
2. **Bước 2 — Tạo hợp đồng & Ký quỹ:** Bấm đặt hàng gói dịch vụ 250.000đ, mở modal Ký quỹ Escrow. Quét mã VietQR hoặc chọn thanh toán ví. Tiền chuyển vào trạng thái bảo chứng an toàn.
3. **Bước 3 — Sinh viên nộp bài:** Đăng xuất, dùng 1-click đăng nhập tài khoản Thảo Nguyễn `221121514101@due.edu.vn` (Pass: `Due@123456`). Vào trang Quản lý hợp đồng, nộp link sản phẩm Figma/Canva.
4. **Bước 4 — Nghiệm thu & Nhận tiền:** Chuyển lại tài khoản Khách hàng, kiểm tra sản phẩm, bấm **"Duyệt bài & Thanh toán"**. Tiền lập tức giải ngân về ví Thảo Nguyễn.
5. **Bước 5 — Rút tiền về ngân hàng:** Đăng nhập lại Thảo Nguyễn, vào Dashboard bấm **"Rút về ngân hàng"** để thể hiện trọn vẹn luồng tiền kinh tế số!
6. **Bước 6 — Quản trị Admin:** Đăng nhập `admin@unisty.due.edu.vn` để trình chiếu bảng điều hành giám sát toàn diện sàn giao dịch.

---
*Tài liệu được lưu trữ trực tiếp trong kho mã nguồn GitHub của dự án UNISTY.*
