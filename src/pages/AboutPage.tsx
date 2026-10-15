import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Users, Sparkles, Target, ArrowLeft, CheckCircle2 } from 'lucide-react';

const TEAM_MEMBERS = [
  'Nguyễn Tuấn Anh',
  'Nguyễn Thu Hiền',
  'Phạm Thị Tú Vân',
  'Nguyễn Thảo Vy',
  'Trương Hoàng Song Thanh',
  'Huỳnh Thị Kim Ngân',
];

export const AboutPage: React.FC = () => {
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
          <GraduationCap className="w-4 h-4" />
          <span>Bài tập nhóm Kinh tế số • Lớp 50K32.3</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Xây dựng nền tảng kết nối kỹ năng & việc làm tự do cho sinh viên — <span className="text-teal-400">UNISTY</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl font-normal">
          Đề tài nghiên cứu và phát triển sản phẩm ứng dụng thuộc Trường Đại học Kinh tế – Đại học Đà Nẵng (DUE).
        </p>
      </div>

      {/* Team Members Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Users className="w-5 h-5 text-teal-600" />
          <h2 className="font-bold text-base text-slate-900">Nhóm tác giả thực hiện (Nhóm Unisty)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((name, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                {idx + 1}
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">{name}</p>
                <p className="text-[10px] text-slate-400">Lớp 50K32.3 • DUE</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Vision & Problem Solved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-teal-700">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Ý nghĩa tên gọi UNISTY</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>UNISTY</strong> là sự kết hợp giữa <strong>University</strong> (Trường đại học) và <strong>Opportunity</strong> (Cơ hội). Ứng dụng đóng vai trò như một <em>"Bệ phóng việc làm tự do" (Freelance Launchpad / Sandbox)</em>, giúp sinh viên sớm tiếp cận thị trường lao động số một cách an toàn và tự tin.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-teal-700">
            <Target className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Giải quyết nghịch lý "Ao lớn"</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Các sàn quốc tế (Upwork, Fiverr, LinkedIn) đặt ra rào cản quá lớn cho sinh viên năm 1, năm 2 vì đòi hỏi thâm niên và cạnh tranh khốc liệt. UNISTY tạo ra một <strong>vườn ươm kỹ năng</strong> giúp các bạn tích lũy khách hàng đầu tiên, lượt đánh giá đầu tiên (Social Proof) và hồ sơ năng lực thực tế (Proof of Work).
          </p>
        </div>

      </div>

      {/* 7 Core Features Checklist */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <h2 className="font-bold text-base text-slate-900">
          7 Tính năng trọng tâm đã hoàn thành (MVP)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          {[
            '1. Hồ sơ năng lực cá nhân & Portfolio LinkedIn thu nhỏ',
            '2. Đăng tải gói dịch vụ kỹ năng (Phía Cung)',
            '3. Đăng tải nhu cầu tuyển người hỗ trợ (Phía Cầu)',
            '4. Bộ lọc & Tìm kiếm nhanh theo chi phí và lĩnh vực',
            '5. Quy trình kết nối, gửi và phê duyệt Đề xuất (Proposal)',
            '6. Quản lý tiến độ 4 bước & Bàn giao liên kết',
            '7. Hệ thống đánh giá sao (Social Proof) và Nhận xét năng lực',
            'Cơ chế Thanh toán đảm bảo (VietQR Sandbox)',
          ].map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-medium">{feat}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
