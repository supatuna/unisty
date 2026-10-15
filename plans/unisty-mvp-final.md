# UNISTY — Kế hoạch triển khai MVP (Bản cập nhật hiện hành)

## 1. Mục tiêu, hiện trạng và quyết định có hiệu lực
UNISTY kết nối người thuê trong/ngoài trường với sinh viên DUE. Hoàn thành sớm nhất có thể nhưng không bỏ chất lượng, bảo mật và kiểm thử. Mốc 4 tuần chỉ phục vụ báo cáo học thuật, không phải thời gian lập trình bắt buộc. Không cam kết ngày hoàn thành trước khi kiểm chứng email/SMTP và quyền truy cập hạ tầng.

**Đặc tả hiện hành:**
* Bản này là đặc tả hiện hành, thay thế mọi nội dung mâu thuẫn trong các kế hoạch cũ.
* Khách xem bài công khai; hồ sơ chỉ dành cho thành viên đã xác nhận email. Email không xuất hiện trong hồ sơ, bài, API sàn hoặc dữ liệu demo. Người dùng vẫn thấy email của chính mình trong phần tài khoản cá nhân.
* Mọi email đã xác nhận được thuê dịch vụ và đăng nhu cầu. Chỉ email đã xác nhận với domain chính xác `due.edu.vn` được đăng dịch vụ và nhận việc; không chấp nhận domain con/lookalike.
* Supabase Auth/Postgres, triển khai Vercel, PWA. UI và backend làm song song.
* Giao diện tiếng Việt, trẻ trung, nền sáng, tối giản (Minimalism), thanh lịch, teal/navy, ưu tiên mobile. Ngôn từ gần gũi, tinh tế, loại bỏ cách hành văn cứng nhắc, máy móc.
* Trao đổi văn bản không realtime, bàn giao bằng liên kết, đánh giá một chiều từ người thuê, kiểm duyệt sau đăng.
* Thanh toán hoàn toàn mô phỏng (Simulated Escrow Sandbox). Cấp 1.000.000 VNĐ đúng một lần cho mỗi tài khoản đã xác nhận. Giá mỗi thỏa thuận là số nguyên từ 1 đến 1.000.000 VNĐ. Giữ toàn bộ giá đến nghiệm thu; hủy đồng thuận hoàn toàn bộ. Admin giải quyết tranh chấp bằng hoàn hoặc giải ngân toàn bộ, bắt buộc lý do và lịch sử, không chia tiền.
* Tích hợp hình thức Cổng thanh toán giả lập (VietQR Sandbox / Mock PayGate) giúp giao diện chân thực, chuyên nghiệp nhưng an toàn pháp lý.
* Bảng điều khiển mô phỏng / demo được giấu kín đáo vào **Presenter DevTools Toolbar** và **Trang Admin (`/admin`)** để giữ mặt tiền trang web luôn sạch sẽ, đẳng cấp 100%.

## 2. Phạm vi

### Trong MVP
Đăng ký / email confirmation / đăng nhập / quên và reset mật khẩu; hồ sơ; bài dịch vụ và nhu cầu; tìm kiếm / lọc nhanh dạng chip / phân trang; đề xuất / trao đổi văn bản / chốt việc (immutable snapshot); ví và biên nhận mô phỏng; bàn giao link / yêu cầu sửa / nghiệm thu; hủy đồng thuận; tranh chấp; đánh giá 1 chiều; báo cáo / ẩn bài / khóa tài khoản; sandbox demo độc lập; PWA.

### Ngoài MVP
Tiền thật, ngân hàng / VietQR thật, upload ảnh / tệp dung lượng lớn lên server, websocket realtime chat, push notification, email marketing nghiệp vụ, đánh giá 2 chiều, AI tự động, đa trường ngoài DUE, app native iOS/Android, dashboard phân tích phức tạp.

## 3. Giao diện và Routes
* Navy (`#0F172A`) cho typography/điều hướng, Teal (`#0D9488`) cho hành động chính, Emerald (`#059669`) cho trạng thái bảo chứng, nền xám dịu (`#F8FAFC`).
* Font chữ: **Be Vietnam Pro** chuẩn tiếng Việt.
* Icon: **Lucide Icons** nhất quán, không dùng emoji cẩu thả.
* Routes:
  * `/`: Trang chủ tối giản, thanh tìm kiếm thanh thoát, danh mục nổi bật.
  * `/marketplace`: Sàn dịch vụ & nhu cầu, bộ lọc chip 1 chạm, sort mới nhất.
  * `/listings/:id`: Chi tiết bài đăng, thông tin sinh viên DUE đã xác thực.
  * `/listings/new`: Đăng bài mới (Dịch vụ hoặc Nhu cầu).
  * `/proposals/:id`: Xem chi tiết đề xuất và trao đổi.
  * `/work/:id`: Phòng làm việc tiến độ (4 bước rõ ràng), nộp link bài, yêu cầu sửa, nghiệm thu.
  * `/work/:id/payment`: Màn hình giữ tiền an toàn với cổng thanh toán VietQR Sandbox.
  * `/dashboard`: Quản lý bài đăng, công việc đang làm và số dư ví.
  * `/profiles/:id`: Hồ sơ sinh viên, kỹ năng và các đánh giá đã nhận.
  * `/admin`: Trung tâm kiểm duyệt báo cáo, xử lý tranh chấp và Sandbox Controller.

## 4. Auth & Phân quyền (RBAC)
* Backend kiểm tra quyền từ `auth.users` và `account_controls`.
* Email domain phải là `@due.edu.vn` (so sánh chữ thường) mới được cấp quyền sinh viên DUE.
* Không bao giờ hiển thị email của người khác trên giao diện.

## 5. Ví & Cơ chế Ký quỹ Mô phỏng (Simulated Escrow)
* Tặng 1.000.000 VNĐ trải nghiệm cho mỗi tài khoản đã xác thực.
* Định luật bảo toàn tiền:
  `Tổng tiền khả dụng (Available) + Tổng tiền đang giữ (Held) = Tổng tiền đã cấp (Credit Grants)`.
* Idempotency key chống bấm trùng lặp hoặc mất mạng.
* Biên nhận có mã giao dịch định danh (SIM-xxxxxx).
