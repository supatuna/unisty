import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  ArrowLeft,
  Shield
} from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { supabaseService } from '../lib/supabaseService';
import { showToast } from '../components/Toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerMssv, setRegisterMssv] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerRole, setRegisterRole] = useState<'due' | 'guest'>('due');
  const [registerClass, setRegisterClass] = useState('50K32.3');
  const [registerSkills, setRegisterSkills] = useState('Thiết kế Canva, PowerPoint');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('Vui lòng nhập đầy đủ email và mật khẩu.', 'error');
      return;
    }

    setIsLoading(true);

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

        setIsLoading(false);
        showToast(`Đăng nhập thành công! Xin chào ${result.user.name}`, 'success');
        navigate('/marketplace');
        return;
      }
    }

    // Check existing internal accounts
    const allUsers = mockStore.getAllUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (found) {
      mockStore.setCurrentUserId(found.id);
      setIsLoading(false);
      showToast(`Đăng nhập thành công: ${found.name}`, 'success');
      navigate('/marketplace');
      return;
    }

    setIsLoading(false);
    showToast('Email hoặc mật khẩu không chính xác.', 'error');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      showToast('Vui lòng nhập đầy đủ thông tin đăng ký.', 'error');
      return;
    }
    if (registerPassword.length < 6) {
      showToast('Mật khẩu tối thiểu 6 ký tự.', 'error');
      return;
    }

    setIsLoading(true);
    const parsedSkills = registerSkills.split(',').map(s => s.trim()).filter(Boolean);

    if (supabaseService.isAvailable()) {
      const result = await supabaseService.signUp({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        role: registerRole,
        studentClass: registerRole === 'due' ? registerClass : undefined,
        skills: parsedSkills,
      });

      if (result.success && result.user) {
        const users = (mockStore as any).data.users;
        users.unshift(result.user);
        mockStore.setCurrentUserId(result.user.id);
        (mockStore as any).write((mockStore as any).data);

        setIsLoading(false);
        showToast(`Đăng ký thành công! Đã cấp 1.000.000đ vào ví UNISTY.`, 'success');
        navigate('/marketplace');
        return;
      } else if (result.error) {
        showToast(`Lỗi: ${result.error}`, 'error');
        setIsLoading(false);
        return;
      }
    }

    // Local fallback
    const newUserId = `user-${Date.now()}`;
    const newUser = {
      id: newUserId,
      name: registerName.trim(),
      email: registerEmail.trim(),
      avatarInitial: registerName.trim().charAt(0).toUpperCase(),
      avatarColor: registerRole === 'due' ? 'bg-teal-600' : 'bg-indigo-600',
      role: registerRole === 'due' ? ('due' as const) : ('member' as const),
      isDueVerified: registerRole === 'due' || registerEmail.toLowerCase().endsWith('@due.edu.vn'),
      isLocked: false,
      major: registerRole === 'due' ? `Sinh viên Lớp ${registerClass} — ĐH Kinh tế (DUE)` : 'Khách hàng ngoài trường',
      studentClass: registerRole === 'due' ? registerClass : undefined,
      skills: parsedSkills,
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

    setIsLoading(false);
    showToast(`Đăng ký thành công! Chào mừng ${newUser.name}`, 'success');
    navigate('/marketplace');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 space-y-6">
        
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ</span>
        </Link>

        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
            <span className="text-teal-400">U</span>N
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Chào mừng đến UNISTY
          </h1>
          <p className="text-xs text-slate-500">
            Nền tảng kỹ năng & Việc làm tự do sinh viên ĐH Kinh tế – ĐH Đà Nẵng
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'login' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng nhập</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'register' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng ký</span>
          </button>
        </div>

        {/* Form area */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@due.edu.vn"
                  required
                  className="w-full text-xs pl-9 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Mật khẩu:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="w-full text-xs pl-9 p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-teal-400" />
              <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập vào hệ thống'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Vai trò:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('due')}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    registerRole === 'due' ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-teal-600" />
                  Sinh viên DUE
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('guest')}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                    registerRole === 'guest' ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-xs' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-slate-600" />
                  Khách ngoài trường
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Họ và tên:</label>
              <input
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Tuấn"
                required
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            {registerRole === 'due' ? (
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Mã số sinh viên (MSSV): <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-teal-700 font-medium">@due.edu.vn</span>
                </label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:border-teal-500 bg-white">
                  <input
                    type="text"
                    value={registerMssv}
                    onChange={(e) => {
                      const mssv = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                      setRegisterMssv(mssv);
                      setRegisterEmail(mssv ? `${mssv.toLowerCase()}@due.edu.vn` : '');
                    }}
                    placeholder="Ví dụ: 221121514123"
                    required
                    className="w-full text-xs p-2.5 focus:outline-none"
                  />
                  <span className="bg-slate-100 text-slate-600 text-xs px-3 py-2.5 font-semibold border-l border-slate-200 flex items-center select-none shrink-0">
                    @due.edu.vn
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email:</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="tenban@gmail.com"
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Mật khẩu:</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            {registerRole === 'due' && (
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Lớp sinh hoạt tại trường DUE:</label>
                <input
                  type="text"
                  value={registerClass}
                  onChange={(e) => setRegisterClass(e.target.value)}
                  placeholder="Ví dụ: 50K32.3"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isLoading ? 'Đang đăng ký...' : 'Đăng ký'}</span>
            </button>
          </form>
        )}

        {/* Footer Admin Link */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Hệ thống bảo mật DUE</span>
          <Link to="/admin" className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition">
            <Shield className="w-3.5 h-3.5" />
            <span>Cổng Quản trị viên</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
