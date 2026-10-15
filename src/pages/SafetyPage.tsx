import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award, FileText, ArrowLeft, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang chủ</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-teal-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Trung tâm An toàn & Quy chuẩn Nền tảng</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Quy chế Vận hành & Tiêu chuẩn Cộng đồng <span className="text-teal-400">UNISTY DUE</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
          Bảo vệ quyền lợi tối đa cho cả sinh viên nhận việc và khách hàng thuê dịch vụ thông qua cơ chế thanh toán đảm bảo và minh bạch học thuật.
        </p>
      </div>

      {/* 4 Pillars of Safety */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pillar 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">1. Cơ chế Két bảo đảm (Escrow Ledger)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Khoản tiền thanh toán của khách hàng không được chuyển thẳng cho sinh viên mà được UNISTY tạm giữ trong két an toàn. Tiền chỉ được giải ngân sau khi khách hàng đã xem sản phẩm và bấm xác nhận hài lòng.
          </p>
          <ul className="text-[11px] text-slate-500 space-y-1.5 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Khách hàng không sợ bị &quot;bùng tiền, mất tích&quot;
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Sinh viên yên tâm 100% có thù lao khi hoàn thành công việc
            </li>
          </ul>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">2. Xác thực Danh tính Sinh viên DUE</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Toàn bộ sinh viên cung cấp dịch vụ trên UNISTY đều được xác thực thông qua email sinh viên <span className="font-mono text-teal-700 font-semibold">@due.edu.vn</span>, lớp sinh hoạt và mã số sinh viên chính khóa.
          </p>
          <ul className="text-[11px] text-slate-500 space-y-1.5 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Tránh hoàn toàn các tài khoản ảo, lừa đảo trôi nổi
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Tích hợp thành tích học thuật (NCKH, Học bổng, IELTS) thật
            </li>
          </ul>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">3. Quy trình Trọng tài Hòa giải</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nếu xảy ra bất đồng ý kiến (trễ deadline, chất lượng không đạt yêu cầu), bất kỳ bên nào cũng có thể gửi yêu cầu hòa giải. Ban Quản trị UNISTY sẽ căn cứ theo lịch sử chat và file bàn giao để xử lý.
          </p>
          <ul className="text-[11px] text-slate-500 space-y-1.5 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Hoàn tiền 100% nếu người làm không giao bài hoặc trễ &gt; 48h
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Bảo vệ sinh viên nếu khách hàng yêu cầu vượt ngoài hợp đồng
            </li>
          </ul>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">4. Chuẩn mực Đạo đức & Bản quyền</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            UNISTY nghiêm cấm mọi hành vi đạo văn, làm hộ bài thi học phần có gian lận, hoặc sử dụng tài sản trí tuệ trái phép. Nền tảng khuyến khích sản phẩm thực chất và trung thực học thuật.
          </p>
          <ul className="text-[11px] text-slate-500 space-y-1.5 pt-1">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Tôn trọng quyền sở hữu trí tuệ của sản phẩm bàn giao
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              Khóa tài khoản vĩnh viễn nếu vi phạm kỷ luật của Trường
            </li>
          </ul>
        </div>

      </div>

      {/* Safety Notice */}
      <div className="p-6 rounded-3xl bg-teal-50/80 border border-teal-200/80 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="text-xs text-teal-900 space-y-1">
          <p className="font-bold">Khuyến cáo an toàn dành cho sinh viên DUE:</p>
          <p className="leading-relaxed text-teal-800">
            Luôn thực hiện toàn bộ trao đổi và nộp sản phẩm trực tiếp bên trong <strong>Phòng làm việc UNISTY</strong>. Không nhận thanh toán trực tiếp qua chuyển khoản ngoài sàn trước khi nghiệm thu để đảm bảo quyền lợi bảo vệ 100% của quỹ Escrow.
          </p>
        </div>
      </div>

    </div>
  );
};
