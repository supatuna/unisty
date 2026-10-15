import React, { useState } from 'react';
import { Sliders, RefreshCw, UserCheck, Shield, ExternalLink, X, User, CreditCard } from 'lucide-react';
import { mockStore } from '../data/mockStore';

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
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-medium shadow-lg backdrop-blur hover:scale-105 transition-all border border-slate-700/60"
          title="Bảng điều khiển dành cho người thuyết trình"
        >
          <Sliders className="w-3.5 h-3.5 text-teal-400" />
          <span>Công cụ Trình diễn</span>
          {currentUser && (
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* Slide-out Drawer Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-slate-200 shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          <div className="overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Sandbox Controller</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Chuyển nhanh giữa các vai trò và mở nhanh các trang quan trọng khi báo cáo đồ án.
            </p>

            {/* Role Switcher */}
            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Chọn vai trò đang xem:
              </label>
              <div className="space-y-1.5">
                {allUsers.map(user => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleSwitchUser(user.id)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition flex items-center justify-between border ${
                        isSelected 
                          ? 'border-teal-500 bg-teal-50/60 text-teal-900 font-semibold' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className={`w-6 h-6 rounded-full ${user.avatarColor} text-white flex items-center justify-center text-[10px] font-bold shrink-0`}>
                          {user.avatarInitial}
                        </div>
                        <div className="truncate">
                          <p className="truncate font-medium">{user.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {user.role === 'admin' ? 'Quản trị viên' : user.isDueVerified ? 'Sinh viên DUE' : 'Người thuê ngoài trường'}
                          </p>
                        </div>
                      </div>
                      {isSelected && <UserCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Test Navigation */}
            <div className="mt-6">
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Mở nhanh các trang trọng tâm:
              </label>
              <div className="space-y-1.5 text-xs">
                {/* Direct payment test link! */}
                <a
                  href="/work/con-100"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-amber-900 font-semibold transition"
                >
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                    Thử nghiệm nút Thanh toán (#con-100)
                  </span>
                  <ExternalLink className="w-3 h-3 text-amber-600" />
                </a>

                <a
                  href="/profiles/user-due-thao"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/60 hover:bg-teal-50 border border-teal-200/60 text-teal-900 font-medium transition"
                >
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    Hồ sơ & Portfolio (Thảo Nguyễn)
                  </span>
                  <ExternalLink className="w-3 h-3 text-teal-600" />
                </a>

                <a
                  href="/work/con-101"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                >
                  <span>Dự án đang làm (#con-101)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href="/work/con-102"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                >
                  <span>Dự án đã gửi bài (#con-102)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href="/about"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                >
                  <span>Về đề tài & Nhóm 50K32.3</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href="/admin"
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
                >
                  <span>Trung tâm Quản trị Admin</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Reset All Data Button */}
          <div className="pt-4 border-t border-slate-100 shrink-0">
            <button
              onClick={handleResetData}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Làm mới toàn bộ dữ liệu mẫu
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Dữ liệu được lưu trong trình duyệt (localStorage)
            </p>
          </div>
        </div>
      )}
    </>
  );
};
