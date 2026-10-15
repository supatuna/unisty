import React, { useState } from 'react';
import { Sliders, RefreshCw, UserCheck, Shield, ExternalLink, X, User, CreditCard, Sparkles, Scale, FileText, CheckCircle2 } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { UserAvatar } from './UserAvatar';

export const PresenterToolbar: React.FC<{ onStateChange?: () => void }> = ({ onStateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentUser = mockStore.getCurrentUser();
  const allUsers = mockStore.getAllUsers();

  const handleSwitchUser = (userId: string) => {
    mockStore.setCurrentUserId(userId);
    if (onStateChange) onStateChange();
    window.location.reload();
  };

  const handleResetData = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục toàn bộ dữ liệu mẫu ban đầu không?')) {
      mockStore.resetAll();
      if (onStateChange) onStateChange();
      window.location.reload();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white text-xs font-semibold shadow-xl backdrop-blur hover:scale-105 transition-all border border-slate-700/80"
          title="Bảng điều khiển các kịch bản demo trước lớp"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>Kịch bản Trình diễn</span>
          {currentUser && (
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
          )}
        </button>
      </div>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-84 bg-white border-l border-slate-200 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div className="overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Kịch bản Demo Trước Lớp</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              5 tình huống thực tế để nhóm lần lượt trình bày cho Giảng viên và các bạn trong lớp.
            </p>

            {/* 5 CLASSROOM DEMO SCENARIOS */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
                5 Kịch bản Demo Trực tiếp
              </span>

              {/* Scenario 1 */}
              <a
                href="/work/con-100"
                className="block p-2.5 rounded-xl bg-teal-50/80 hover:bg-teal-100/70 border border-teal-200/80 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-teal-950 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                    1. Thanh toán Escrow VietQR
                  </span>
                  <ExternalLink className="w-3 h-3 text-teal-600 opacity-60 group-hover:opacity-100" />
                </div>
                <p className="text-[11px] text-teal-800 mt-1 leading-snug">
                  Hợp đồng #con-100 đang chờ thanh toán 200k qua VietQR Sandbox / Ví.
                </p>
              </a>

              {/* Scenario 2 */}
              <a
                href="/work/con-102"
                className="block p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/90 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    2. Bàn giao & Nghiệm thu 5★
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  #con-102 đã nộp video CapCut. Bấm duyệt bài, chấm 5 sao & giải phóng thù lao.
                </p>
              </a>

              {/* Scenario 3 */}
              <a
                href="/listings/list-5"
                className="block p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/90 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    3. Duyệt Đề xuất ứng tuyển
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Bài tuyển menu The Lab Cafe có 2 đề xuất của Thảo và Linh. Bấm chọn bạn phù hợp.
                </p>
              </a>

              {/* Scenario 4 */}
              <a
                href="/profiles/user-due-thao"
                className="block p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/90 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    4. Hồ sơ Năng lực LinkedIn
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Profile Thảo Nguyễn: Huy hiệu DUE, NCKH 2025, IELTS 7.5, sản phẩm mẫu & review.
                </p>
              </a>

              {/* Scenario 5 */}
              <a
                href="/admin"
                className="block p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50/50 border border-slate-200/90 transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    5. Hòa giải Tranh chấp & Quản trị
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Trang Admin: Xử lý khiếu nại #con-104 (hoàn tiền / giải ngân) & kiểm toán tiền.
                </p>
              </a>
            </div>

            {/* Role Switcher */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Đổi tài khoản đăng nhập:
              </label>
              <div className="space-y-1.5">
                {allUsers.map((user) => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user.id)}
                      className={`w-full text-left p-2 rounded-xl text-xs transition flex items-center justify-between border ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-50/60 text-teal-900 font-semibold' 
                          : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <UserAvatar
                          name={user.name}
                          avatarUrl={user.avatarUrl}
                          avatarInitial={user.avatarInitial}
                          avatarColor={user.avatarColor}
                          size="xs"
                          shape="circle"
                        />
                        <div className="truncate">
                          <p className="truncate font-medium text-[11px]">{user.name}</p>
                        </div>
                      </div>
                      {isSelected && <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Reset All Data Button */}
          <div className="pt-3 border-t border-slate-100 shrink-0">
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Làm mới toàn bộ dữ liệu mẫu ban đầu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
