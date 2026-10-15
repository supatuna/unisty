import React, { useState } from 'react';
import { ShieldCheck, UserCheck, GraduationCap, Building2, Shield, X, ArrowRight, Sparkles } from 'lucide-react';
import { mockStore } from '../data/mockStore';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [customName, setCustomName] = useState('');
  const [customClass, setCustomClass] = useState('50K32.3');
  const [customRole, setCustomRole] = useState<'due' | 'guest'>('due');
  const [isCreating, setIsCreating] = useState(false);

  const allUsers = mockStore.getAllUsers();
  const currentUserId = mockStore.getCurrentUser().id;

  const handleSelectUser = (userId: string) => {
    mockStore.setCurrentUserId(userId);
    if (onSuccess) onSuccess();
    onClose();
    window.location.reload();
  };

  const handleCreateCustomUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    setIsCreating(true);
    const newUserId = `user-custom-${Date.now()}`;
    const initial = customName.trim().charAt(0).toUpperCase();

    const newUser = {
      id: newUserId,
      name: customName.trim(),
      email: customRole === 'due'
        ? `${customName.toLowerCase().replace(/\s+/g, '')}@due.edu.vn`
        : `${customName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      avatarInitial: initial,
      avatarColor: customRole === 'due' ? 'bg-teal-600' : 'bg-indigo-600',
      role: customRole === 'due' ? ('due' as const) : ('member' as const),
      isDueVerified: customRole === 'due',
      isLocked: false,
      major: customRole === 'due' ? `Sinh viên Lớp ${customClass} — ĐH Kinh tế (DUE)` : 'Khách hàng ngoài trường',
      studentClass: customRole === 'due' ? customClass : undefined,
      skills: customRole === 'due' ? ['Canva', 'PowerPoint', 'Thuyết trình'] : [],
      portfolioUrls: [],
      completedProjectsCount: 0,
      averageRating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };

    // Add to mockStore users
    const users = (mockStore as any).data.users;
    users.push(newUser);
    mockStore.setCurrentUserId(newUserId);
    (mockStore as any).write((mockStore as any).data);

    setIsCreating(false);
    if (onSuccess) onSuccess();
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <span className="text-teal-400">U</span>N
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Đăng nhập tài khoản UNISTY</h3>
              <p className="text-[11px] text-slate-500">Hệ thống định danh sinh viên Đại học Kinh tế – ĐH Đà Nẵng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Fast Switch for Demo */}
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Chọn tài khoản thử nghiệm nhanh (1-Click)
            </span>
            <span className="text-[11px] text-teal-700 font-medium">Khuyên dùng khi thuyết trình</span>
          </div>

          <div className="space-y-2">
            {allUsers.map((u) => {
              const isSelected = u.id === currentUserId;
              return (
                <button
                  key={u.id}
                  onClick={() => handleSelectUser(u.id)}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/70 shadow-sm'
                      : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${u.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}>
                      {u.avatarInitial}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{u.name}</span>
                        {u.isDueVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800">
                            <ShieldCheck className="w-3 h-3 text-teal-600" />
                            DUE
                          </span>
                        )}
                        {u.role === 'admin' && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-900 text-white">
                            <Shield className="w-3 h-3 text-teal-400" />
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {u.major || (u.role === 'due' ? 'Sinh viên DUE' : 'Đối tác ngoài trường')}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-xs font-semibold">
                    {isSelected ? (
                      <span className="text-teal-700 bg-white px-2 py-1 rounded-lg border border-teal-200 text-[11px]">
                        Đang chọn
                      </span>
                    ) : (
                      <span className="text-slate-400 group-hover:text-slate-600 flex items-center text-[11px]">
                        Chọn <ArrowRight className="w-3 h-3 ml-0.5" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] font-medium text-slate-400 uppercase">
            hoặc tạo tài khoản riêng để test
          </span>
        </div>

        {/* Custom User Form */}
        <form onSubmit={handleCreateCustomUser} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCustomRole('due')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                customRole === 'due'
                  ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Sinh viên DUE
            </button>
            <button
              type="button"
              onClick={() => setCustomRole('guest')}
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                customRole === 'guest'
                  ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-4 h-4 text-slate-600" />
              Khách ngoài trường
            </button>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Họ và tên của bạn:
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
            />
          </div>

          {customRole === 'due' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Lớp sinh hoạt tại trường DUE:
              </label>
              <input
                type="text"
                value={customClass}
                onChange={(e) => setCustomClass(e.target.value)}
                placeholder="Ví dụ: 50K32.3"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={!customName.trim() || isCreating}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Tạo & Đăng nhập ngay</span>
          </button>
        </form>

      </div>
    </div>
  );
};
