import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Clock, Calendar, AlertCircle, ExternalLink, CheckCircle2, UserCheck, LogIn } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { showToast } from '../components/Toast';
import { UserAvatar } from '../components/UserAvatar';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isLoggedIn = mockStore.isLoggedIn();
  const [proposalScope, setProposalScope] = useState('');
  const [proposalPrice, setProposalPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const listing = mockStore.getListingById(id || '');
  const currentUser = mockStore.getCurrentUser();
  const proposals = mockStore.getProposalsForListing(id || '');

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800">Không tìm thấy bài đăng này</h2>
        <p className="text-xs text-slate-500 mt-1">Bài đăng có thể đã hết hạn hoặc được gỡ xuống.</p>
        <Link to="/marketplace" className="mt-4 inline-block text-xs font-semibold text-teal-700">
          Quay lại sàn việc làm
        </Link>
      </div>
    );
  }

  const isOwner = currentUser.id === listing.ownerId;
  const isService = listing.kind === 'service';

  // Người thuê bấm chấp nhận 1 bạn sinh viên ứng tuyển
  const handleAcceptProposal = (proposalId: string) => {
    const res = mockStore.acceptProposal(proposalId);
    if (res.success) {
      showToast(res.message, 'success');
      setTimeout(() => navigate(`/work/${res.contractId}`), 400);
    } else {
      showToast(res.message, 'error');
    }
  };

  // Người dùng gửi đề xuất / đặt hàng
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isService) {
      // Đặt làm dịch vụ: Tạo hợp đồng thực tế giữa currentUser (người đặt) và listing.ownerId (sinh viên cung cấp)
      const res = mockStore.createContractFromService(listing.id, currentUser.id, proposalScope);
      setIsSubmitting(false);
      if (res.success) {
        showToast(res.message, 'success');
        setShowProposalForm(false);
        setTimeout(() => navigate(`/work/${res.contractId}`), 400);
      } else {
        showToast(res.message, 'error');
      }
    } else {
      // Sinh viên DUE nộp đề xuất cho bài Nhu cầu
      const priceToSubmit = proposalPrice > 0 ? proposalPrice : listing.price;
      const res = mockStore.submitProposal(listing.id, proposalScope, priceToSubmit);
      setIsSubmitting(false);
      if (res.success) {
        showToast(res.message, 'success');
        setShowProposalForm(false);
        setTimeout(() => window.location.reload(), 400);
      } else {
        showToast(res.message, 'error');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Back button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại danh sách</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            
            {/* Kind & Status */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {isService ? 'Dịch vụ sinh viên' : 'Cần tìm người làm'}
              </span>
              <span className="text-xs text-slate-400">
                Đăng ngày {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {listing.title}
            </h1>

            {/* Author info with link to Portfolio */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <Link to={`/profiles/${listing.ownerId}`} className="shrink-0 group">
                  <UserAvatar
                    name={listing.ownerName}
                    avatarUrl={listing.ownerAvatarUrl}
                    avatarInitial={listing.ownerAvatar}
                    avatarColor={listing.ownerAvatarColor}
                    size="md"
                    shape="circle"
                    className="shadow-sm group-hover:scale-105 transition"
                  />
                </Link>
                <div>
                  <div className="flex items-center gap-2">
                    <Link to={`/profiles/${listing.ownerId}`} className="font-semibold text-sm text-slate-900 hover:text-teal-700 transition">
                      {listing.ownerName}
                    </Link>
                    {listing.isOwnerDue && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/70">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        Sinh viên DUE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Thành viên mạng lưới UNISTY</p>
                </div>
              </div>

              {/* View Profile CTA */}
              <Link
                to={`/profiles/${listing.ownerId}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50/60 hover:bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-100 transition shrink-0"
              >
                <span>Xem hồ sơ & Portfolio</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="font-bold text-sm text-slate-900">Chi tiết công việc & Cam kết</h2>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-normal">
              {listing.description}
            </div>
          </div>

          {/* DANH SÁCH SINH VIÊN ỨNG TUYỂN (PROPOSALS) - Đúng theo Báo cáo nhóm */}
          {!isService && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-teal-600" />
                  <h2 className="font-bold text-sm text-slate-900">
                    Sinh viên đã gửi đề xuất ứng tuyển ({proposals.length})
                  </h2>
                </div>
                <span className="text-xs text-slate-400">Chọn bạn phù hợp nhất</span>
              </div>

              {proposals.length > 0 ? (
                <div className="space-y-3">
                  {proposals.map(prop => (
                    <div key={prop.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <Link to={`/profiles/${prop.senderId}`} className="shrink-0">
                            <UserAvatar
                              name={prop.senderName}
                              avatarInitial={prop.senderAvatar}
                              avatarColor={prop.senderAvatarColor}
                              size="sm"
                              shape="circle"
                            />
                          </Link>
                          <div>
                            <div className="flex items-center gap-2">
                              <Link to={`/profiles/${prop.senderId}`} className="font-bold text-xs text-slate-900 hover:text-teal-700">
                                {prop.senderName}
                              </Link>
                              {prop.isSenderDue && (
                                <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.2 rounded font-medium">
                                  Sinh viên DUE
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400">
                              Đề xuất mức thù lao: <strong className="text-teal-700">{prop.price.toLocaleString('vi-VN')}đ</strong>
                            </span>
                          </div>
                        </div>

                        {/* View Portfolio Link */}
                        <Link
                          to={`/profiles/${prop.senderId}`}
                          className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 self-start sm:self-auto"
                        >
                          <span>Xem Portfolio của bạn</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                        "{prop.scope}"
                      </p>

                      {/* Owner Action to Accept this Proposal */}
                      {isOwner && prop.status === 'pending' && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => handleAcceptProposal(prop.id)}
                            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Chọn bạn này & Bắt đầu công việc</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-3">
                  Chưa có bạn sinh viên nào gửi đề xuất cho bài này. Hãy kiên nhẫn chờ nhé!
                </p>
              )}
            </div>
          )}

          {/* Security guarantee */}
          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/70 flex items-start gap-3 text-xs text-teal-900 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Bảo vệ người thuê tuyệt đối</p>
              <p className="text-slate-600 mt-0.5">
                Bạn chỉ thanh toán cho kết quả xứng đáng. Toàn bộ tiền thù lao được UNISTY bảo vệ an toàn và chỉ chuyển đi sau khi bạn đã kiểm tra và duyệt bài hoàn tất.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Action Deck (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
            
            {/* Price Box */}
            <div>
              <span className="text-xs text-slate-500 font-medium">Mức thù lao</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-900">
                  {listing.price.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs font-semibold text-teal-700">VNĐ</span>
              </div>
            </div>

            {/* Parameters */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Thời gian hoàn thành:
                </span>
                <span className="font-semibold text-slate-800">
                  {isService ? `${listing.deliveryDays} ngày` : 'Theo thỏa thuận'}
                </span>
              </div>

              {listing.dueAt && (
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Hạn chót cần bài:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {new Date(listing.dueAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>

            {/* Action CTA */}
            {!isLoggedIn ? (
              <div className="space-y-2.5">
                <Link
                  to="/login"
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập để {isService ? 'đặt dịch vụ này' : 'ứng tuyển nhận việc'}</span>
                </Link>
                <p className="text-[11px] text-slate-500 text-center">
                  Bạn cần đăng nhập để giao dịch và ký quỹ an toàn.
                </p>
              </div>
            ) : isOwner ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-700 font-medium">
                Đây là bài đăng của bạn. Hãy kiểm tra các đề xuất ứng tuyển ở bảng bên trái.
              </div>
            ) : isService ? (
              <button
                onClick={() => setShowProposalForm(true)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition"
              >
                Đặt làm dịch vụ này
              </button>
            ) : currentUser.isDueVerified ? (
              <button
                onClick={() => {
                  setProposalPrice(listing.price);
                  setShowProposalForm(true);
                }}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition"
              >
                Gửi đề xuất ứng tuyển (DUE)
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Chỉ dành cho sinh viên DUE
                </p>
                <p className="text-[11px] text-slate-500">
                  Chỉ tài khoản sinh viên có email trường @due.edu.vn đã xác nhận mới có thể ứng tuyển nhận việc.
                </p>
              </div>
            )}

            {/* Modal / Quick Form */}
            {showProposalForm && (
              <form onSubmit={handleCreateOrder} className="pt-4 border-t border-slate-100 space-y-3">
                <label className="text-xs font-semibold text-slate-800 block">
                  {isService ? 'Mô tả yêu cầu cụ thể của bạn:' : 'Lời ngỏ & Kinh nghiệm của bạn:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={proposalScope}
                  onChange={(e) => setProposalScope(e.target.value)}
                  placeholder={isService ? 'Mô tả mong muốn, tài liệu đính kèm hoặc thời hạn...' : 'Giới thiệu kỹ năng của bạn, thời gian có thể hoàn thành...'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500"
                />

                {!isService && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Mức thù lao bạn đề xuất (VNĐ):
                    </label>
                    <input
                      type="number"
                      value={proposalPrice}
                      onChange={(e) => setProposalPrice(Number(e.target.value))}
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Xác nhận gửi'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
