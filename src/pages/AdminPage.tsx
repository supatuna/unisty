import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, CheckCircle2, AlertTriangle, Scale, RotateCcw, 
  FileText, Users, Eye, EyeOff, Lock, Unlock, ShieldAlert,
  Wallet, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCw,
  Search, ArrowLeft, LogOut, Check, Sliders, Trash2
} from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { supabaseService } from '../lib/supabaseService';
import { showToast } from '../components/Toast';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = mockStore.getCurrentUser();
  const isLoggedIn = mockStore.isLoggedIn();

  // Authentication gate state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return isLoggedIn && currentUser.role === 'admin';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'treasury' | 'moderation' | 'users' | 'disputes' | 'audit'>('treasury');
  const [, setRefreshKey] = useState(0);

  // Treasury (Wallet adjustment) state
  const allUsers = mockStore.getAllUsers();
  const allListings = mockStore.getAllListingsAdmin();
  const disputes = mockStore.getDisputes();

  const [selectedUserId, setSelectedUserId] = useState<string>(allUsers[0]?.id || '');
  const [customAvailable, setCustomAvailable] = useState<string>('1000000');
  const [customHeld, setCustomHeld] = useState<string>('0');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const selectedUser = allUsers.find(u => u.id === selectedUserId) || allUsers[0];
  const selectedWallet = selectedUser ? mockStore.getWallet(selectedUser.id) : { available: 0, held: 0, granted: true, userId: '' };

  // Calculate total circulating balance (Conservation of money)
  let totalAvailable = 0;
  let totalHeld = 0;
  allUsers.forEach((u) => {
    const w = mockStore.getWallet(u.id);
    totalAvailable += w.available;
    totalHeld += w.held;
  });

  // Admin login handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      showToast('Vui lòng điền đầy đủ thông tin Admin.', 'error');
      return;
    }

    setIsLoggingIn(true);

    // 1. Kiểm tra tài khoản qua Supabase nếu có
    if (supabaseService.isAvailable()) {
      const res = await supabaseService.signIn(adminEmail, adminPassword);
      if (res.success && res.user && res.user.role === 'admin') {
        mockStore.setCurrentUserId(res.user.id);
        setIsAdminAuthenticated(true);
        setIsLoggingIn(false);
        showToast('Xác thực Ban Quản trị cấp cao thành công!', 'success');
        return;
      }
    }

    // 2. Kiểm tra tài khoản nội bộ hoặc Master Key
    const internalAdmin = allUsers.find(u => u.email.toLowerCase() === adminEmail.trim().toLowerCase());
    const isMasterPassword = 
      adminPassword === 'admin123' || 
      adminPassword === 'admin123456' || 
      adminPassword === 'Admin@123456' || 
      adminPassword === 'due50k32';

    if ((internalAdmin && (internalAdmin.role === 'admin' && isMasterPassword)) || (adminEmail.toLowerCase().includes('admin') && isMasterPassword)) {
      const targetAdmin = internalAdmin || allUsers.find(u => u.role === 'admin') || allUsers[0];
      mockStore.setCurrentUserId(targetAdmin.id);
      setIsAdminAuthenticated(true);
      setIsLoggingIn(false);
      showToast('Xác thực Ban Quản trị cấp cao thành công!', 'success');
      return;
    }

    setIsLoggingIn(false);
    showToast('Tài khoản hoặc mật khẩu không có quyền Quản trị viên.', 'error');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Đã đăng xuất khỏi cổng Quản trị viên.', 'info');
    navigate('/');
  };

  // Treasury adjustments
  const handleSelectUserForTreasury = (uId: string) => {
    setSelectedUserId(uId);
    const w = mockStore.getWallet(uId);
    setCustomAvailable(w.available.toString());
    setCustomHeld(w.held.toString());
  };

  const handleApplyWalletChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const newAvail = parseInt(customAvailable.replace(/\D/g, ''), 10) || 0;
    const newHld = parseInt(customHeld.replace(/\D/g, ''), 10) || 0;

    const res = mockStore.adminAdjustWallet(selectedUser.id, newAvail, newHld);
    if (res.success) {
      showToast(`Đã cập nhật số dư cho "${selectedUser.name}": ${newAvail.toLocaleString('vi-VN')}đ khả dụng.`, 'success');
      setRefreshKey(k => k + 1);
    }
  };

  const handleQuickAddMoney = (amount: number) => {
    if (!selectedUser) return;
    const current = mockStore.getWallet(selectedUser.id);
    const newAvail = Math.max(0, current.available + amount);
    mockStore.adminAdjustWallet(selectedUser.id, newAvail);
    setCustomAvailable(newAvail.toString());
    showToast(`${amount > 0 ? 'Nạp thêm' : 'Trừ bớt'} ${Math.abs(amount).toLocaleString('vi-VN')}đ cho "${selectedUser.name}"!`, 'success');
    setRefreshKey(k => k + 1);
  };

  // Moderation
  const handleToggleHideListing = (listingId: string, title: string) => {
    const isHidden = mockStore.toggleHideListing(listingId);
    showToast(isHidden ? `Đã ẩn bài đăng: "${title}"` : `Đã mở lại bài đăng: "${title}"`, 'info');
    setRefreshKey(k => k + 1);
  };

  const handleDeleteListing = (listingId: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn bài đăng: "${title}"?`)) {
      mockStore.deleteListing(listingId);
      showToast(`Đã xóa vĩnh viễn bài đăng: "${title}"`, 'error');
      setRefreshKey(k => k + 1);
    }
  };

  // User management
  const handleToggleLockUser = (userId: string, name: string) => {
    const isLocked = mockStore.toggleLockUser(userId);
    showToast(isLocked ? `Đã khóa tài khoản: "${name}"` : `Đã mở khóa tài khoản: "${name}"`, isLocked ? 'error' : 'success');
    setRefreshKey(k => k + 1);
  };

  const handleToggleAdminRole = (userId: string, name: string) => {
    const isAdmin = mockStore.toggleAdminRole(userId);
    showToast(isAdmin ? `Đã cấp quyền Admin cho: "${name}"` : `Đã hạ quyền Admin của: "${name}"`, 'success');
    setRefreshKey(k => k + 1);
  };

  // Dispute resolution
  const handleResolve = (disputeId: string, resolution: 'refund_all' | 'release_all') => {
    const reason = resolution === 'refund_all'
      ? 'Ban Quản trị quyết định hoàn 100% tiền tạm giữ cho người thuê do sinh viên trễ hạn quá quy định.'
      : 'Ban Quản trị quyết định giải ngân thù lao cho sinh viên sau khi kiểm tra bằng chứng hoàn thành.';

    const res = mockStore.resolveDispute(disputeId, resolution, reason);
    if (res.success) {
      showToast(res.message, 'success');
      setRefreshKey(k => k + 1);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Filtered users for search in Treasury tab
  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // IF NOT AUTHENTICATED AS ADMIN: SHOW INDEPENDENT ADMIN GATE
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-900 text-white">
        <div className="w-full max-w-md bg-slate-800/90 rounded-3xl border border-slate-700 p-8 space-y-6 shadow-2xl backdrop-blur-md">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-inner">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
              Cổng Quản Trị Cấp Cao
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Restricted
              </span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khu vực giới hạn nghiêm ngặt. Yêu cầu tài khoản có thẩm quyền Ban Quản trị UNISTY để truy cập.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Email Quản trị viên:
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@unisty.due.edu.vn"
                required
                className="w-full text-xs p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Mật khẩu Quản trị:
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Nhập mật khẩu Admin"
                required
                className="w-full text-xs p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Đang xác minh quyền...' : 'Xác thực Quyền Quản trị viên'}</span>
            </button>
          </form>

          {/* Quick Fill Helper */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => {
                setAdminEmail('admin@unisty.due.edu.vn');
                setAdminPassword('admin123456');
              }}
              className="text-[11px] text-teal-400 hover:text-teal-300 underline font-medium transition cursor-pointer"
            >
              ⚡ Bấm vào đây để tự động điền tài khoản Admin
            </button>
          </div>

          <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-white transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chủ</span>
            </Link>
            <span className="text-[11px] text-slate-500">Security Layer 2.0</span>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-slate-900 text-teal-400 shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Trung tâm Điều hành & Quản trị Tối cao
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-xs">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toàn quyền can thiệp số dư ví, dòng tiền ký quỹ Escrow, kiểm duyệt sàn và hòa giải tranh chấp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Xem sàn UNISTY</span>
          </Link>

          <button
            onClick={handleAdminLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Thoát Admin</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('treasury')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition shrink-0 flex items-center gap-2 ${
            activeTab === 'treasury'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4 text-teal-600" />
          <span>Điều chỉnh Số dư Ví ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition shrink-0 flex items-center gap-2 ${
            activeTab === 'moderation'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Kiểm duyệt Bài đăng ({allListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition shrink-0 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Quản lý Thành viên & Khóa</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition shrink-0 flex items-center gap-2 ${
            activeTab === 'disputes'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Trọng tài Tranh chấp ({disputes.length})</span>
          {disputes.some(d => !d.resolution) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition shrink-0 flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Kiểm toán Dòng tiền</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TREASURY & WALLET ADJUSTMENT (QUYỀN HẠN CỰC CAO) */}
      {/* ========================================================================= */}
      {activeTab === 'treasury' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* User selector list */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 flex flex-col h-[640px]">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-600" />
                <span>Chọn tài khoản cần can thiệp</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tìm kiếm theo tên hoặc email của thành viên:
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Tìm tên, email..."
                className="w-full text-xs pl-9 p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {filteredUsers.map((u) => {
                const isSelected = u.id === selectedUserId;
                const userW = mockStore.getWallet(u.id);

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUserForTreasury(u.id)}
                    className={`w-full p-2.5 rounded-2xl text-left border transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/80 shadow-xs'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 truncate">{u.name}</span>
                        {u.role === 'admin' && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 text-white font-bold">Admin</span>
                        )}
                        {u.isDueVerified && (
                          <span className="text-[9px] px-1 py-0.2 rounded bg-teal-100 text-teal-800 font-semibold">DUE</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{u.email}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-teal-700 block">
                        {userW.available.toLocaleString('vi-VN')}đ
                      </span>
                      {userW.held > 0 && (
                        <span className="text-[10px] text-amber-600 block">
                          Treo: {userW.held.toLocaleString('vi-VN')}đ
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Modification Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selected user status banner */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${selectedUser.avatarColor || 'bg-teal-600'} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                    {selectedUser.avatarInitial}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>{selectedUser.name}</span>
                      {selectedUser.isDueVerified && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                          Xác thực DUE
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-slate-500 font-mono">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400 block">Tổng tài sản trong ví:</span>
                  <span className="text-2xl font-extrabold text-teal-700">
                    {(selectedWallet.available + selectedWallet.held).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* 2 Big Balance Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-1">
                  <span className="text-xs font-semibold text-teal-800 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-teal-600" />
                    Số dư khả dụng (Sẵn sàng chi tiêu/ký quỹ):
                  </span>
                  <p className="text-2xl font-black text-teal-900">
                    {selectedWallet.available.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                  <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-600" />
                    Tiền đang ký quỹ trong két (Escrow Held):
                  </span>
                  <p className="text-2xl font-black text-amber-900">
                    {selectedWallet.held.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </div>

              {/* Quick Modifier Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Cộng / Trừ nhanh vào số dư khả dụng (1-Chạm):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAddMoney(100000)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-transparent text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    +100.000đ
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAddMoney(500000)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-transparent text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    +500.000đ
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAddMoney(1000000)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-transparent text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    +1.000.000đ
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAddMoney(5000000)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 border border-transparent text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                    +5.000.000đ
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAddMoney(-500000)}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-transparent text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                    -500.000đ
                  </button>
                </div>
              </div>

              {/* Exact Value Direct Set Form */}
              <form onSubmit={handleApplyWalletChange} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-teal-600" />
                  Thiết lập con số chính xác tùy ý:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Số dư khả dụng mới (VNĐ):
                    </label>
                    <input
                      type="number"
                      value={customAvailable}
                      onChange={(e) => setCustomAvailable(e.target.value)}
                      min="0"
                      step="10000"
                      required
                      className="w-full text-sm font-bold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Tiền tạm giữ Escrow (VNĐ):
                    </label>
                    <input
                      type="number"
                      value={customHeld}
                      onChange={(e) => setCustomHeld(e.target.value)}
                      min="0"
                      step="10000"
                      required
                      className="w-full text-sm font-bold p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-teal-400" />
                  <span>Áp dụng Thay đổi Số dư Ngay Lập tức</span>
                </button>
              </form>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LISTING MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Danh sách bài đăng trên sàn ({allListings.length})</h3>
              <p className="text-xs text-slate-500 mt-0.5">Quản lý duyệt, ẩn bài đăng xấu hoặc xóa bài vi phạm nghiêm trọng.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-4">Tiêu đề bài đăng</th>
                  <th className="p-4">Loại tin</th>
                  <th className="p-4">Người đăng</th>
                  <th className="p-4 text-right">Chi phí</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allListings.map((l) => (
                  <tr key={l.id} className={`hover:bg-slate-50/50 ${l.isHidden ? 'bg-slate-50/80 opacity-60' : ''}`}>
                    <td className="p-4 font-semibold text-slate-900 max-w-xs truncate" title={l.title}>
                      {l.title}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        l.kind === 'service' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {l.kind === 'service' ? 'Dịch vụ' : 'Cần tìm'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-slate-800">{l.ownerName}</span>
                      {l.isOwnerDue && <span className="text-[10px] text-teal-600 block">Sinh viên DUE</span>}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-900">
                      {l.price.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="p-4 text-center">
                      {l.isHidden ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <EyeOff className="w-3 h-3" /> Đã ẩn
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Eye className="w-3 h-3" /> Hiển thị
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleHideListing(l.id, l.title)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          l.isHidden
                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {l.isHidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{l.isHidden ? 'Mở lại' : 'Ẩn bài'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteListing(l.id, l.title)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: USER MANAGEMENT & RBAC */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Quản trị thành viên & Phân quyền ({allUsers.length})</h3>
              <p className="text-xs text-slate-500 mt-0.5">Khóa tài khoản vi phạm hoặc chỉ định quyền Ban Quản trị hệ thống.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-4">Thành viên</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Khoa / Đơn vị</th>
                  <th className="p-4 text-center">Vai trò</th>
                  <th className="p-4 text-center">Trạng thái</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {allUsers.map((u) => (
                  <tr key={u.id} className={`hover:bg-slate-50/50 ${u.isLocked ? 'bg-rose-50/40' : ''}`}>
                    <td className="p-4 flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${u.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                        {u.avatarInitial}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 block">{u.name}</span>
                        {u.studentClass && <span className="text-[10px] text-teal-600 block">Lớp {u.studentClass}</span>}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">{u.email}</td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{u.major || 'Chưa cập nhật'}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' 
                          ? 'bg-slate-900 text-white' 
                          : (u.isDueVerified ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-100 text-slate-700')
                      }`}>
                        {u.role === 'admin' ? 'Admin' : (u.isDueVerified ? 'Sinh viên DUE' : 'Thành viên')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {u.isLocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          <Lock className="w-3 h-3" /> Đã khóa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Unlock className="w-3 h-3" /> Bình thường
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleToggleAdminRole(u.id, u.name)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          u.role === 'admin'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>{u.role === 'admin' ? 'Bỏ Admin' : 'Cấp Admin'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleLockUser(u.id, u.name)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                          u.isLocked
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {u.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        <span>{u.isLocked ? 'Mở khóa' : 'Khóa'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DISPUTE ARBITRATION */}
      {/* ========================================================================= */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-600" />
              Danh sách khiếu nại & Yêu cầu trọng tài hòa giải ({disputes.length})
            </h3>
            <span className="text-xs text-slate-500">Phán quyết dứt điểm theo Điều lệ Ký quỹ UNISTY</span>
          </div>

          {disputes.length > 0 ? (
            <div className="space-y-4">
              {disputes.map((d) => {
                const contract = mockStore.getContractById(d.contractId);
                const isResolved = !!d.resolution;

                return (
                  <div
                    key={d.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            #{d.contractId}
                          </span>
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isResolved
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {isResolved ? 'Đã hòa giải' : 'Đang chờ xử lý'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {contract?.titleSnapshot || 'Dự án đang tranh chấp'}
                        </h4>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block">Số tiền tạm giữ trong két:</span>
                        <span className="text-base font-extrabold text-amber-600">
                          {(contract?.priceSnapshot || 0).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[11px]">Bên thuê (Người mở khiếu nại):</span>
                        <span className="font-semibold text-slate-800">{contract?.requesterName}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-slate-400 block text-[11px]">Bên thực hiện (Sinh viên):</span>
                        <span className="font-semibold text-slate-800">{contract?.providerName}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                      <span className="font-semibold block flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Lý do khiếu nại:
                      </span>
                      <p className="text-[11px] text-amber-800 leading-relaxed">{d.reason}</p>
                    </div>

                    {isResolved ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <span className="font-semibold block flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Kết luận của Ban Quản trị: {d.resolution === 'refund_all' ? 'Hoàn trả 100% cho người thuê' : 'Giải phóng thù lao cho sinh viên'}
                        </span>
                        <p className="text-[11px] text-emerald-800">{d.resolutionReason}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button
                          onClick={() => handleResolve(d.id, 'refund_all')}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Hoàn 100% tiền tạm giữ cho Người thuê</span>
                        </button>
                        <button
                          onClick={() => handleResolve(d.id, 'release_all')}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Giải ngân thù lao cho Bạn sinh viên</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center">
              <p className="text-xs text-slate-500">
                Hiện tại không có tranh chấp nào cần Ban Quản trị can thiệp.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ESCROW MONEY AUDIT */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Số dư khả dụng toàn hệ thống</span>
              <p className="text-xl font-bold text-slate-900">{totalAvailable.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tiền đang tạm giữ trong Escrow</span>
              <p className="text-xl font-bold text-amber-600">{totalHeld.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tổng tiền lưu thông (Bảo toàn)</span>
              <p className="text-xl font-bold text-teal-700">{(totalAvailable + totalHeld).toLocaleString('vi-VN')}đ</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Sao kê số dư từng tài khoản</h3>
              <span className="text-xs text-slate-400">{allUsers.length} tài khoản</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Tên & Vai trò</th>
                    <th className="p-4">Email đăng ký</th>
                    <th className="p-4 text-right">Khả dụng</th>
                    <th className="p-4 text-right">Đang tạm giữ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {allUsers.map((u) => {
                    const w = mockStore.getWallet(u.id);
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="p-4 flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded-full ${u.avatarColor} text-white flex items-center justify-center font-bold text-[10px]`}>
                            {u.avatarInitial}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900">{u.name}</span>
                            <span className="text-[10px] text-slate-400 block">{u.role}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-slate-500">{u.email}</td>
                        <td className="p-4 text-right font-semibold text-slate-900">
                          {w.available.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="p-4 text-right font-semibold text-amber-600">
                          {w.held.toLocaleString('vi-VN')}đ
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
