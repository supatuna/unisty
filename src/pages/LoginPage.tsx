import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Compass, 
  Briefcase, 
  User, 
  HelpCircle,
  KeyRound,
  FileCheck
} from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { UserAvatar } from '../components/UserAvatar';
import { showToast } from '../components/Toast';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = mockStore.getCurrentUser();
  const allUsers = mockStore.getAllUsers();

  const [activeTab, setActiveTab] = useState<'demo' | 'create' | 'sso'>('demo');

  // Custom User Creation State
  const [customName, setCustomName] = useState('');
  const [customClass, setCustomClass] = useState('50K32.3');
  const [customRole, setCustomRole] = useState<'due' | 'guest'>('due');
  const [customSkills, setCustomSkills] = useState('Canva, PowerPoint, Thuyết trình');
  const [isCreating, setIsCreating] = useState(false);

  // Mock SSO Form State
  const [ssoEmail, setSsoEmail] = useState('thaonguyen.50k32.3@due.udn.vn');
  const [ssoPassword, setSsoPassword] = useState('••••••••••••');
  const [isSsoLoading, setIsSsoLoading] = useState(false);

  const handleSelectUser = (userId: string) => {
    const selected = allUsers.find(u => u.id === userId);
    mockStore.setCurrentUserId(userId);
    showToast(`Đã chuyển đổi sang tài khoản: ${selected?.name || userId}`, 'success');
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
      skills: parsedSkills.length > 0 ? parsedSkills : ['Thiết kế', 'Tin học'],
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

    setIsCreating(false);
    showToast(`Chào mừng ${newUser.name}! Tài khoản của bạn đã được khởi tạo.`, 'success');
    navigate(`/profiles/${newUserId}`);
  };

  const handleSsoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSsoLoading(true);

    setTimeout(() => {
      // Find matching user or default to Thảo Nguyễn
      const targetUser = allUsers.find(u => u.id === 'user-due-thao') || allUsers[0];
      mockStore.setCurrentUserId(targetUser.id);
      setIsSsoLoading(false);
      showToast(`Xác thực SSO DUE thành công! Xin chào ${targetUser.name}`, 'success');
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-teal-400">U</span>N
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">UNISTY</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  DUE Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Hệ thống Định danh & Làm việc số Sinh viên Đại học Kinh tế – ĐHĐN</p>
            </div>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cổng Đăng Nhập & Chuyển Đổi Tài Khoản
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            Lựa chọn vai trò phù hợp để trải nghiệm toàn bộ quy trình: Đăng việc, Ký quỹ an toàn, Bàn giao sản phẩm và Đánh giá năng lực sinh viên.
          </p>
        </div>

        {/* Current Active Account Card */}
        <div className="bg-white rounded-2xl border border-teal-200 shadow-sm p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-teal-50/50 via-white to-slate-50">
          <div className="flex items-center gap-3.5">
            <UserAvatar
              name={currentUser.name}
              avatarUrl={currentUser.avatarUrl}
              avatarInitial={currentUser.avatarInitial}
              avatarColor={currentUser.avatarColor}
              size="lg"
              shape="circle"
              className="ring-4 ring-teal-500/20 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-md">
                  Tài khoản đang đăng nhập
                </span>
                {currentUser.isDueVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Sinh viên DUE
                  </span>
                )}
                {currentUser.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                    <Shield className="w-3.5 h-3.5 text-purple-600" /> Quản trị viên
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">{currentUser.name}</h2>
              <p className="text-xs text-slate-500">{currentUser.major || currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Vào Dự án</span>
            </Link>
            <Link
              to={`/profiles/${currentUser.id}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              <User className="w-3.5 h-3.5" />
              <span>Xem Portfolio</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50/70 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-4 px-4 text-center border-b-2 transition flex items-center justify-center gap-2 ${
                activeTab === 'demo'
                  ? 'border-teal-600 text-teal-800 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>1-Click Đổi Vai Trò Demo (5 Tài Khoản)</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 px-4 text-center border-b-2 transition flex items-center justify-center gap-2 ${
                activeTab === 'create'
                  ? 'border-teal-600 text-teal-800 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Tạo Tài Khoản Mới</span>
            </button>

            <button
              onClick={() => setActiveTab('sso')}
              className={`hidden sm:flex flex-1 py-4 px-4 text-center border-b-2 transition items-center justify-center gap-2 ${
                activeTab === 'sso'
                  ? 'border-teal-600 text-teal-800 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <Lock className="w-4 h-4 text-teal-600" />
              <span>Cổng DUE SSO (Office 365)</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Tab 1: Demo Personas */}
            {activeTab === 'demo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Chọn tài khoản mẫu để kiểm thử chức năng</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      Khuyên dùng khi thuyết trình trước lớp
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Nhấp vào bất kỳ tài khoản nào để chuyển quyền ngay lập tức mà không cần nhập mật khẩu.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    let roleBadge = 'Sinh viên DUE';
                    let roleDesc = 'Tham gia nhận việc và hoàn thiện hồ sơ portfolio năng lực';

                    if (u.id === 'user-due-thao') {
                      roleBadge = 'Người làm (Freelancer)';
                      roleDesc = 'Sinh viên Marketing nhận thiết kế Canva, làm Slide báo cáo và nhận thanh toán Escrow.';
                    } else if (u.id === 'user-due-nam') {
                      roleBadge = 'Người thuê (Client)';
                      roleDesc = 'Trưởng nhóm NCKH đăng tin tìm cộng tác viên, ký quỹ 1.200.000đ và nghiệm thu sản phẩm.';
                    } else if (u.id === 'user-due-halinh') {
                      roleBadge = 'Chuyên gia SPSS';
                      roleDesc = 'Sinh viên Thống kê Tin học xử lý số liệu NCKH, đánh giá 5.0 sao, 8 dự án thành công.';
                    } else if (u.id === 'user-client-tuan') {
                      roleBadge = 'Khách hàng F&B';
                      roleDesc = 'Chủ quán cà phê / Chuỗi F&B ngoài trường đặt thiết kế Menu và bài truyền thông khai trương.';
                    } else if (u.id === 'user-admin') {
                      roleBadge = 'Ban Quản trị DUE';
                      roleDesc = 'Kiểm duyệt bài đăng, giám sát ký quỹ Smart Escrow, trọng tài hòa giải bảo vệ SV.';
                    }

                    return (
                      <div
                        key={u.id}
                        className={`rounded-2xl border p-4 sm:p-5 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-md'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <UserAvatar
                                name={u.name}
                                avatarUrl={u.avatarUrl}
                                avatarInitial={u.avatarInitial}
                                avatarColor={u.avatarColor}
                                size="md"
                                shape="circle"
                                className="shrink-0"
                              />
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                                  <span>{u.name}</span>
                                  {u.isDueVerified && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                                      <ShieldCheck className="w-3 h-3 text-teal-600" />
                                      DUE
                                    </span>
                                  )}
                                  {u.role === 'admin' && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-900 text-white">
                                      <Shield className="w-3 h-3 text-teal-400" />
                                      Admin
                                    </span>
                                  )}
                                </h4>
                                <span className="inline-block mt-0.5 text-[11px] font-semibold text-teal-700">
                                  {roleBadge}
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <span className="text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full">
                                Đang chọn
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                            {roleDesc}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleSelectUser(u.id)}
                            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                              isSelected
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Đang dùng tài khoản này</span>
                              </>
                            ) : (
                              <>
                                <span>Đăng nhập vai trò này</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Create Custom User */}
            {activeTab === 'create' && (
              <div className="max-w-xl mx-auto">
                <div className="text-center mb-6">
                  <h3 className="text-base font-bold text-slate-900">Khởi tạo hồ sơ người dùng thử nghiệm</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Nhập tên và lớp học của bạn để tạo hồ sơ riêng và kiểm tra quá trình tương tác.
                  </p>
                </div>

                <form onSubmit={handleCreateCustomUser} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Vai trò trên sàn UNISTY:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCustomRole('due')}
                        className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                          customRole === 'due'
                            ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-teal-600" />
                        <span>Sinh viên DUE (Đã xác minh)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomRole('guest')}
                        className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
                          customRole === 'guest'
                            ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 className="w-4 h-4 text-slate-600" />
                        <span>Khách hàng ngoài trường</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Họ và tên hiển thị: <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Phương Thảo"
                      required
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  {customRole === 'due' && (
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Lớp sinh hoạt tại trường DUE:
                      </label>
                      <input
                        type="text"
                        value={customClass}
                        onChange={(e) => setCustomClass(e.target.value)}
                        placeholder="Ví dụ: 50K32.3"
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Kỹ năng chính (phân cách bằng dấu phẩy):
                    </label>
                    <input
                      type="text"
                      value={customSkills}
                      onChange={(e) => setCustomSkills(e.target.value)}
                      placeholder="Ví dụ: Canva, Thiết kế Slide, Dịch thuật Anh - Việt"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!customName.trim() || isCreating}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 pt-3"
                  >
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    <span>Tạo Tài Khoản & Đi Tới Hồ Sơ</span>
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: DUE SSO Mock Portal */}
            {activeTab === 'sso' && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center mx-auto mb-3">
                    <KeyRound className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Cổng Đăng Nhập Một Lần (SSO)</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Đăng nhập bằng tài khoản email trường do Đại học Kinh tế – ĐH Đà Nẵng cấp (@due.udn.vn).
                  </p>
                </div>

                <form onSubmit={handleSsoLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email sinh viên (@due.udn.vn):
                    </label>
                    <input
                      type="email"
                      value={ssoEmail}
                      onChange={(e) => setSsoEmail(e.target.value)}
                      placeholder="thaonguyen.50k32.3@due.udn.vn"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Mật khẩu cổng trường:
                    </label>
                    <input
                      type="password"
                      value={ssoPassword}
                      onChange={(e) => setSsoPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                    <FileCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>
                      Hệ thống tự động đồng bộ mã số sinh viên, lớp sinh hoạt và chứng chỉ từ cơ sở dữ liệu trường DUE.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSsoLoading}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isSsoLoading ? (
                      <span>Đang xác thực với máy chủ DUE...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Đăng nhập SSO & Đồng bộ dữ liệu</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* 3 Pillars Footer */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-900">100% Định danh Sinh viên</h4>
            <p className="text-[11px] text-slate-500 mt-1">Loại trừ tài khoản ảo, cam kết đúng lớp & đúng chuyên ngành DUE.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <Lock className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Ký quỹ Smart Escrow</h4>
            <p className="text-[11px] text-slate-500 mt-1">Người thuê nộp tiền trước vào sàn, nghiệm thu mới giải ngân cho SV.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <GraduationCap className="w-6 h-6 text-teal-600 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-900">Portfolio Năng lực Thực tế</h4>
            <p className="text-[11px] text-slate-500 mt-1">Dự án hoàn thành được lưu vào hồ sơ làm bằng chứng tuyển dụng.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
