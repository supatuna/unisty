import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, Award, GraduationCap, CheckCircle2, 
  ExternalLink, Star, Briefcase, Clock, ArrowLeft, PlusCircle,
  Edit3, Sparkles, Plus, Settings
} from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { ListingCard } from '../components/ListingCard';
import { EditProfileModal } from '../components/EditProfileModal';

export const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState(() => mockStore.getCurrentUser());
  const targetId = id || currentUser.id;
  const [user, setUser] = useState(() => mockStore.getUserById(targetId));
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState<'basic' | 'skills' | 'achievements' | 'portfolio'>('basic');

  useEffect(() => {
    setUser(mockStore.getUserById(targetId));
    setCurrentUser(mockStore.getCurrentUser());
  }, [targetId]);

  const allListings = mockStore.getListings();
  const userListings = allListings.filter(l => l.ownerId === (user?.id || ''));
  const isOwner = currentUser?.id === user?.id;

  const openEditModal = (tab: 'basic' | 'skills' | 'achievements' | 'portfolio' = 'basic') => {
    setEditTab(tab);
    setShowEditModal(true);
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800">Không tìm thấy hồ sơ này</h2>
        <Link to="/marketplace" className="mt-4 inline-block text-xs font-semibold text-teal-700">
          Quay lại sàn việc làm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Back button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </Link>

      {/* 1. HERO IDENTITY CARD (Phong cách LinkedIn) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm relative overflow-hidden">
        
        {/* Subtle decorative background banner */}
        <div className="h-28 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 relative">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14 pb-2">
          
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl ${user.avatarColor} text-white flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-md ring-4 ring-white shrink-0`}>
              {user.avatarInitial}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                {user.isDueVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    Sinh viên DUE đã xác thực
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600">
                {user.major} {user.studentClass ? `• Lớp ${user.studentClass}` : ''}
              </p>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {isOwner && (
              <button
                onClick={() => openEditModal('basic')}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition hover:shadow shrink-0 cursor-pointer"
                id="btn-edit-profile"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            )}

            {user.role === 'due' && (
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition shrink-0"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Xem dịch vụ của bạn này</span>
              </a>
            )}
          </div>
        </div>

        {/* Bio summary */}
        {user.bio && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-5 pt-5 border-t border-slate-100 whitespace-pre-line font-normal">
            {user.bio}
          </p>
        )}

        {/* Trust Metrics Bar (Social Proof & Proof of Work) */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-base sm:text-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{user.averageRating || 5.0}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Đánh giá ({user.reviewsCount || 0} lượt)
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-base sm:text-lg font-extrabold text-teal-700">
              {user.completedProjectsCount || 0}+
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Dự án hoàn thành</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <p className="text-base sm:text-lg font-extrabold text-slate-900">100%</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Bàn giao đúng hạn</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. PORTFOLIO SHOWCASE (Minh chứng năng lực - Proof of Work) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <h2 className="font-bold text-base text-slate-900">Sản phẩm mẫu thực tế (Portfolio)</h2>
              </div>
              <div className="flex items-center gap-2">
                {isOwner && (
                  <button
                    onClick={() => openEditModal('portfolio')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 px-2.5 py-1 rounded-lg border border-teal-200/80 transition"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Thêm minh chứng</span>
                  </button>
                )}
                <span className="text-xs text-slate-400 hidden sm:inline">Minh chứng năng lực</span>
              </div>
            </div>

            {user.portfolioItems && user.portfolioItems.length > 0 ? (
              <div className="space-y-4">
                {user.portfolioItems.map(item => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 transition space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                        {item.category}
                      </span>
                      <span className="text-slate-400 text-[11px]">{item.date}</span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                    <div className="pt-2">
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Xem trực tiếp sản phẩm mẫu</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <p className="text-xs text-slate-500 mb-2">Chưa có sản phẩm mẫu nào trong hồ sơ.</p>
                {isOwner && (
                  <button
                    onClick={() => openEditModal('portfolio')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm sản phẩm mẫu đầu tiên</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. ACTIVE SERVICES (Dịch vụ đang nhận) */}
          <div id="services" className="space-y-4">
            <h2 className="font-bold text-base text-slate-900">Dịch vụ đang cung cấp ({userListings.length})</h2>
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 bg-white p-6 rounded-2xl border border-slate-200">
                Hiện tại bạn sinh viên chưa đăng bài dịch vụ mới.
              </p>
            )}
          </div>

          {/* 4. VERIFIED CLIENT REVIEWS (Đánh giá xác thực) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">Đánh giá từ người thuê</h2>
              <span className="text-xs text-slate-400">Đã qua nghiệm thu</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                      A
                    </div>
                    <span className="font-bold text-xs text-slate-800">Anh Tuấn (The Lab Cafe)</span>
                  </div>
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "Làm việc rất đúng hạn và có trách nhiệm! Chất lượng sản phẩm vượt ngoài mong đợi của quán. Sẽ tiếp tục hợp tác lâu dài."
                </p>
                <span className="text-[10px] text-slate-400 block">Dự án thiết kế • Tháng 10/2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 col) - Achievements & Skills */}
        <div className="space-y-6">
          
          {/* ACADEMIC ACHIEVEMENTS (Thành tựu học tập & NCKH - Điểm nhấn LinkedIn) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">Thành tựu học thuật & NCKH</h3>
              </div>
              {isOwner && (
                <button
                  onClick={() => openEditModal('achievements')}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/70 px-2 py-0.5 rounded-md transition"
                >
                  + Thêm
                </button>
              )}
            </div>

            {user.achievements && user.achievements.length > 0 ? (
              <div className="space-y-3">
                {user.achievements.map(ach => (
                  <div key={ach.id} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 leading-snug">{ach.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ach.organization} • {ach.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 text-xs">
                <p>Chưa có thành tích hoặc chứng chỉ bổ sung.</p>
                {isOwner && (
                  <button
                    onClick={() => openEditModal('achievements')}
                    className="mt-2 text-xs font-medium text-teal-700 underline"
                  >
                    Thêm giải thưởng / chứng chỉ
                  </button>
                )}
              </div>
            )}
          </div>

          {/* SKILLS MATRIX (Kỹ năng thực tế) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                Kỹ năng thực chiến
              </h3>
              {isOwner && (
                <button
                  onClick={() => openEditModal('skills')}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/70 px-2 py-0.5 rounded-md transition"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-500 py-1">Chưa cập nhật kỹ năng.</p>
              )}
            </div>
          </div>

          {/* UNISTY VERIFICATION BADGE */}
          <div className="bg-teal-50/70 rounded-3xl p-5 border border-teal-200/70 space-y-2 text-xs text-teal-900">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Bảo chứng bởi UNISTY</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Tài khoản này đã được xác thực quyền kiểm soát email chính thức của Đại học Kinh tế – ĐH Đà Nẵng (@due.edu.vn).
            </p>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal */}
      {showEditModal && user && (
        <EditProfileModal
          user={user}
          initialTab={editTab}
          onClose={() => setShowEditModal(false)}
          onSaved={() => {
            const updated = mockStore.getUserById(targetId);
            if (updated) setUser({ ...updated });
            setCurrentUser(mockStore.getCurrentUser());
          }}
        />
      )}

    </div>
  );
};

