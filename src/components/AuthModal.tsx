import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GraduationCap, Building2, X, Sparkles, LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { supabaseService } from '../lib/supabaseService';
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
  const [customMssv, setCustomMssv] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customClass, setCustomClass] = useState('50K32.3');
  const [customRole, setCustomRole] = useState<'due' | 'guest'>('due');
  const [customSkills, setCustomSkills] = useState('Canva, PowerPoint, SPSS');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login Email State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const allUsers = mockStore.getAllUsers();

  // Auto-generate suggested email based on name and role
  useEffect(() => {
    if (customName.trim()) {
      const cleanName = customName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
      if (customRole === 'due') {
        setCustomEmail(`${cleanName}@due.edu.vn`);
      } else {
        setCustomEmail(`${cleanName}@gmail.com`);
      }
    }
  }, [customName, customRole]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    if (!customEmail.trim() || !customPassword.trim()) {
      showToast('Vui lòng điền đầy đủ email và mật khẩu.', 'error');
      return;
    }
    if (customPassword.length < 6) {
      showToast('Mật khẩu phải có tối thiểu 6 ký tự.', 'error');
      return;
    }

    setIsSubmitting(true);
    const parsedSkills = customSkills.split(',').map(s => s.trim()).filter(Boolean);

    // 1. Thử đăng ký với Supabase Cloud nếu có cấu hình
    if (supabaseService.isAvailable()) {
      const result = await supabaseService.signUp({
        name: customName.trim(),
        email: customEmail.trim(),
        password: customPassword,
        role: customRole,
        studentClass: customRole === 'due' ? customClass : undefined,
        skills: parsedSkills,
      });

      if (result.success && result.user) {
        const users = (mockStore as any).data.users;
        users.unshift(result.user);
        mockStore.setCurrentUserId(result.user.id);
        (mockStore as any).write((mockStore as any).data);

        setIsSubmitting(false);
        showToast(`Đăng ký thành công! Đã cấp 1.000.000đ vào ví UNISTY.`, 'success');
        if (onSuccess) onSuccess();
        onClose();
        window.location.reload();
        return;
      } else if (result.error) {
        showToast(`Lỗi: ${result.error}`, 'error');
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Fallback sang LocalStorage nếu chưa có mạng/Supabase
    const newUserId = `user-custom-${Date.now()}`;
    const initial = customName.trim().charAt(0).toUpperCase();

    const newUser = {
      id: newUserId,
      name: customName.trim(),
      email: customEmail.trim(),
      avatarInitial: initial,
      avatarColor: customRole === 'due' ? 'bg-teal-600' : 'bg-indigo-600',
      role: customRole === 'due' ? ('due' as const) : ('member' as const),
      isDueVerified: customRole === 'due' || customEmail.toLowerCase().endsWith('@due.edu.vn'),
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

    const users = (mockStore as any).data.users;
    users.push(newUser);
    mockStore.setCurrentUserId(newUserId);
    (mockStore as any).write((mockStore as any).data);

    setIsSubmitting(false);
    showToast(`Đăng ký thành công! Chào mừng ${newUser.name}`, 'success');
    if (onSuccess) onSuccess();
    onClose();
    window.location.reload();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('Vui lòng nhập đầy đủ email và mật khẩu.', 'error');
      return;
    }

    setIsSubmitting(true);

    // 1. Thử đăng nhập tài khoản thật với Supabase
    if (supabaseService.isAvailable()) {
      const result = await supabaseService.signIn(loginEmail, loginPassword);
      if (result.success && result.user) {
        const users = (mockStore as any).data.users;
        const existingIdx = users.findIndex((u: any) => u.id === result.user!.id);
        if (existingIdx !== -1) {
          users[existingIdx] = result.user;
        } else {
          users.unshift(result.user);
        }
        mockStore.setCurrentUserId(result.user.id);
        (mockStore as any).write((mockStore as any).data);

        setIsSubmitting(false);
        showToast(`Đăng nhập thành công! Xin chào ${result.user.name}`, 'success');
        if (onSuccess) onSuccess();
        onClose();
        window.location.reload();
        return;
      }
    }

    // 2. Thử tìm trong danh sách người dùng nội bộ
    const found = allUsers.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (found) {
      mockStore.setCurrentUserId(found.id);
      setIsSubmitting(false);
      showToast(`Đăng nhập thành công: ${found.name}`, 'success');
      if (onSuccess) onSuccess();
      onClose();
      window.location.reload();
      return;
    }

    setIsSubmitting(false);
    showToast('Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.', 'error');
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
        className="relative my-auto w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 animate-in fade-in zoom-in-95 duration-150 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="text-teal-400">U</span>N
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tài khoản UNISTY
              </h3>
              <p className="text-[11px] text-slate-500">Nền tảng kỹ năng & Việc làm tự do sinh viên DUE</p>
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

        {/* Content Area */}
        <div className="py-4">
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Email của bạn:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="ví dụ: thaonguyen@due.edu.vn"
                    required
                    className="w-full text-xs pl-9 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Mật khẩu:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                    className="w-full text-xs pl-9 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isSubmitting ? 'Đang xác thực...' : 'Đăng nhập vào hệ thống'}</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
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

              {customRole === 'due' ? (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                    <span>Mã số sinh viên (MSSV): <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-teal-700 font-medium">Nhận tích xanh @due.edu.vn</span>
                  </label>
                  <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 bg-white">
                    <input
                      type="text"
                      value={customMssv}
                      onChange={(e) => {
                        const mssv = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                        setCustomMssv(mssv);
                        setCustomEmail(mssv ? `${mssv.toLowerCase()}@due.edu.vn` : '');
                      }}
                      placeholder="Ví dụ: 221121514123"
                      required
                      className="w-full text-xs p-2.5 focus:outline-none"
                    />
                    <span className="bg-slate-100 text-slate-600 text-xs px-3 py-2.5 font-semibold border-l border-slate-200 flex items-center select-none shrink-0">
                      @due.edu.vn
                    </span>
                  </div>
                  {customMssv && (
                    <p className="text-[10px] text-teal-600 font-mono mt-1">
                      Email đăng ký: {customMssv.toLowerCase()}@due.edu.vn
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Email đăng ký: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="tenban@gmail.com"
                    required
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Mật khẩu: <span className="text-rose-500">* (tối thiểu 6 ký tự)</span>
                </label>
                <input
                  type="password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="Nhập mật khẩu của bạn"
                  required
                  minLength={6}
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!customName.trim() || isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}</span>
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
