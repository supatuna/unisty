import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, GraduationCap, Building2, Shield, X, ArrowRight, Sparkles, LogIn, UserPlus, KeyRound, Mail, CheckCircle2 } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { UserAvatar } from './UserAvatar';
import { showToast } from './Toast';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  // Register Form State
  const [customName, setCustomName] = useState('');
  const [customClass, setCustomClass] = useState('50K32.3');
  const [customRole, setCustomRole] = useState<'due' | 'guest'>('due');
  const [customSkills, setCustomSkills] = useState('Canva, PowerPoint');
  const [isCreating, setIsCreating] = useState(false);

  // Login Email/SSO Mock State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const allUsers = mockStore.getAllUsers();
  const currentUserId = mockStore.isLoggedIn() ? mockStore.getCurrentUser().id : null;

  const handleSelectUser = (userId: string) => {
    const selected = allUsers.find(u => u.id === userId);
    mockStore.setCurrentUserId(userId);
    showToast(`Đăng nhập thành công: ${selected?.name || userId}`, 'success');
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
    const parsedSkills = customSkills.split(',').map(s => s.trim()).filter(Boolean);

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
      skills: parsedSkills.length > 0 ? parsedSkills : ['Thiết kế', 'Thuyết trình'],
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
    showToast(`Đăng ký thành công! Chào mừng ${newUser.name}`, 'success');
    if (onSuccess) onSuccess();
    onClose();
    window.location.reload();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    // Try finding matching user by email
    const found = allUsers.find(u => u.email.toLowerCase().includes(loginEmail.trim().toLowerCase()));
    const targetUser = found || allUsers[0];

    mockStore.setCurrentUserId(targetUser.id);
    showToast(`Đăng nhập thành công với tài khoản: ${targetUser.name}`, 'success');
    if (onSuccess) onSuccess();
    onClose();
    window.location.reload();
  };

  // Lock body scroll when modal is mounted
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative my-auto w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="text-teal-400">U</span>N
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Tài khoản UNISTY
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  DUE Network
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Mạng lưới sinh viên ĐH Kinh tế – ĐH Đà Nẵng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2 Main Tabs: Đăng nhập vs Đăng ký */}
        <div className="flex rounded-xl bg-slate-100 p-1 mt-4 shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'login'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'register'
                ? 'bg-white text-teal-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng ký tài khoản</span>
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="overflow-y-auto pr-1 py-3 flex-1 mt-2">
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                  <span>Chọn tài khoản có sẵn (1-Click Demo):</span>
                  <span className="text-[10px] text-teal-600 font-medium">Khuyên dùng thử</span>
                </p>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Bấm để đăng nhập ngay với vai trò tương ứng:
                </p>

                <div className="space-y-2">
                  {allUsers.map((u) => {
                    const isSelected = u.id === currentUserId;
                    let roleLabel = 'Sinh viên DUE';
                    if (u.id === 'user-due-thao') roleLabel = 'Người làm • Thiết kế Canva';
                    else if (u.id === 'user-due-nam') roleLabel = 'Người thuê • Nghiên cứu khoa học';
                    else if (u.id === 'user-due-halinh') roleLabel = 'Người làm • Chuyên gia SPSS';
                    else if (u.id === 'user-client-tuan') roleLabel = 'Khách ngoài trường • Chuỗi F&B';
                    else if (u.id === 'user-admin') roleLabel = 'Ban Quản trị DUE • Hòa giải tranh chấp';

                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => handleSelectUser(u.id)}
                        className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <UserAvatar
                            name={u.name}
                            avatarUrl={u.avatarUrl}
                            avatarInitial={u.avatarInitial}
                            avatarColor={u.avatarColor}
                            size="sm"
                            shape="circle"
                            className="shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-slate-900 truncate">{u.name}</span>
                              {u.isDueVerified && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800">
                                  <ShieldCheck className="w-2.5 h-2.5 text-teal-600" />
                                  DUE
                                </span>
                              )}
                              {u.role === 'admin' && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-900 text-white">
                                  Admin
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {roleLabel}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 text-xs font-semibold">
                          {isSelected ? (
                            <span className="text-teal-700 bg-white px-2 py-0.5 rounded-lg border border-teal-200 text-[11px]">
                              Đang dùng
                            </span>
                          ) : (
                            <span className="text-slate-500 group-hover:text-slate-800 flex items-center text-[11px] px-2 py-0.5 rounded-lg bg-slate-100">
                              Chọn <ArrowRight className="w-3 h-3 ml-0.5" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SSO/Email Form */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                  <span>Hoặc đăng nhập bằng Email sinh viên:</span>
                </p>

                <form onSubmit={handleEmailLogin} className="space-y-2.5">
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Ví dụ: thaonguyen@due.edu.vn"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Mật khẩu (tùy ý cho bản demo)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-teal-400" />
                    <span>Đăng nhập hệ thống</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleCreateCustomUser} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Bạn tham gia UNISTY với tư cách:
                </label>
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
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Họ và tên của bạn: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Phương Thảo"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
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
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Kỹ năng chính:
                </label>
                <input
                  type="text"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  placeholder="Ví dụ: Thiết kế Slide, Canva, Tin học văn phòng"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!customName.trim() || isCreating}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Đăng ký & Đăng nhập ngay</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px]">
            {activeTab === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
            <button
              onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
              className="text-teal-700 hover:underline font-semibold ml-1"
            >
              {activeTab === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
