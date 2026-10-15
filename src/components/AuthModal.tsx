import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, GraduationCap, Building2, Shield, X, ArrowRight, Sparkles, ExternalLink, Users } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { UserAvatar } from './UserAvatar';
import { showToast } from './Toast';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'switch' | 'create'>('switch');
  const [customName, setCustomName] = useState('');
  const [customClass, setCustomClass] = useState('50K32.3');
  const [customRole, setCustomRole] = useState<'due' | 'guest'>('due');
  const [isCreating, setIsCreating] = useState(false);

  const allUsers = mockStore.getAllUsers();
  const currentUserId = mockStore.getCurrentUser().id;

  const handleSelectUser = (userId: string) => {
    const selected = allUsers.find(u => u.id === userId);
    mockStore.setCurrentUserId(userId);
    showToast(`Đã chuyển sang tài khoản: ${selected?.name || userId}`, 'success');
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
    showToast(`Tạo thành công tài khoản: ${newUser.name}`, 'success');
    if (onSuccess) onSuccess();
    onClose();
    window.location.reload();
  };

  const handleGoToLoginPage = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
      {/* Click outside backdrop container */}
      <div 
        className="relative my-auto bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Fixed top */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <span className="text-teal-400">U</span>N
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Đăng nhập UNISTY
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  DUE SSO
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Hệ thống tài khoản sinh viên ĐH Kinh tế – ĐH Đà Nẵng</p>
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl mt-3 shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('switch')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'switch'
                ? 'bg-white text-teal-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Chọn nhanh (1-Click)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
              activeTab === 'create'
                ? 'bg-white text-teal-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Tạo tài khoản mới</span>
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div className="overflow-y-auto pr-1 py-3 flex-1">
          {activeTab === 'switch' && (
            <div className="space-y-2">
              <p className="text-[11px] text-slate-500 mb-2">
                Chọn ngay một tài khoản có sẵn để trải nghiệm các vai trò (Người làm, Người thuê, Admin):
              </p>

              <div className="space-y-2">
                {allUsers.map((u) => {
                  const isSelected = u.id === currentUserId;
                  return (
                    <button
                      key={u.id}
                      onClick={() => handleSelectUser(u.id)}
                      className={`w-full p-2.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 shadow-xs'
                          : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
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
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {u.major || (u.role === 'due' ? 'Sinh viên DUE' : 'Đối tác ngoài trường')}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-xs font-semibold">
                        {isSelected ? (
                          <span className="text-teal-700 bg-white px-2.5 py-1 rounded-lg border border-teal-200 text-[11px]">
                            Đang dùng
                          </span>
                        ) : (
                          <span className="text-slate-400 group-hover:text-slate-600 flex items-center text-[11px] px-2 py-1 rounded-lg bg-slate-100">
                            Chọn <ArrowRight className="w-3 h-3 ml-0.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <form onSubmit={handleCreateCustomUser} className="space-y-3 pt-1">
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

              <button
                type="submit"
                disabled={!customName.trim() || isCreating}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Tạo & Đăng nhập ngay</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Link to Full Page Login */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <button
            onClick={handleGoToLoginPage}
            className="text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 hover:underline"
          >
            <span>Mở trang đăng nhập toàn màn hình (/login)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
