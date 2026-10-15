import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, 
  Send, ExternalLink, MessageSquare, Plus, Check, MoreVertical
} from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { EscrowPaymentModal } from '../components/EscrowPaymentModal';
import { ApprovalModal } from '../components/ApprovalModal';
import { DisputeModal } from '../components/DisputeModal';
import { showToast } from '../components/Toast';
import { UserAvatar } from '../components/UserAvatar';

export const WorkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [deliveryUrls, setDeliveryUrls] = useState<string[]>(['']);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [revisionReason, setRevisionReason] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const currentUser = mockStore.getCurrentUser();
  const userContracts = mockStore.getContractsForUser(currentUser.id);
  const targetId = id || (userContracts.length > 0 ? userContracts[0].id : 'con-100');

  const [contract, setContract] = useState(() => mockStore.getContractById(targetId));
  const [deliveries, setDeliveries] = useState(() => contract ? mockStore.getDeliveries(contract.id) : []);
  const [messages, setMessages] = useState(() => contract ? mockStore.getMessages(contract.id) : []);

  useEffect(() => {
    const updated = mockStore.getContractById(targetId);
    setContract(updated);
    if (updated) {
      setDeliveries(mockStore.getDeliveries(updated.id));
      setMessages(mockStore.getMessages(updated.id));
    }
  }, [targetId, id]);

  if (!contract) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center">
        <h2 className="text-lg font-bold text-slate-800">Không tìm thấy công việc này</h2>
        <Link to="/dashboard" className="mt-4 inline-block text-xs font-semibold text-teal-700">
          Về danh sách dự án của tôi
        </Link>
      </div>
    );
  }

  const isRequester = currentUser.id === contract.requesterId;
  const isProvider = currentUser.id === contract.providerId;

  // Stepper Calculation
  const getStepIndex = () => {
    switch (contract.state) {
      case 'pending_payment': return 0;
      case 'in_progress': return 1;
      case 'submitted': return 2;
      case 'completed': return 3;
      case 'disputed': return 2;
      default: return 0;
    }
  };

  const currentStep = getStepIndex();

  const handleAddUrlField = () => {
    if (deliveryUrls.length < 5) {
      setDeliveryUrls([...deliveryUrls, '']);
    }
  };

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...deliveryUrls];
    updated[index] = value;
    setDeliveryUrls(updated);
  };

  const handleSubmitDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    const validUrls = deliveryUrls.filter(u => u.trim().startsWith('http'));
    if (validUrls.length === 0) {
      showToast('Vui lòng nhập ít nhất 1 liên kết hợp lệ (bắt đầu bằng https://)', 'error');
      return;
    }
    const res = mockStore.submitDelivery(contract.id, validUrls, deliveryNotes);
    if (res.success) {
      showToast(res.message, 'success');
      const updated = mockStore.getContractById(contract.id);
      if (updated) setContract({ ...updated });
      setDeliveries(mockStore.getDeliveries(contract.id));
      setDeliveryNotes('');
      setDeliveryUrls(['']);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleRequestRevision = () => {
    if (!revisionReason.trim()) {
      showToast('Vui lòng nêu rõ các điểm bạn cần bạn sinh viên chỉnh sửa lại.', 'error');
      return;
    }
    const res = mockStore.requestRevision(contract.id, revisionReason);
    if (res.success) {
      showToast('Đã gửi yêu cầu chỉnh sửa đến bạn sinh viên.', 'info');
      setShowRevisionInput(false);
      setRevisionReason('');
      const updated = mockStore.getContractById(contract.id);
      if (updated) setContract({ ...updated });
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleConfirmApproval = (stars: number, comment: string) => {
    setIsApproving(true);
    const completeRes = mockStore.completeContract(contract.id);
    if (completeRes.success) {
      mockStore.addReview(contract.id, stars, comment);
      showToast(`Đã duyệt bài và giải phóng ${contract.priceSnapshot.toLocaleString('vi-VN')}đ thù lao cho bạn sinh viên!`, 'success');
      setShowApprovalModal(false);
      setIsApproving(false);
      const updated = mockStore.getContractById(contract.id);
      if (updated) setContract({ ...updated });
    } else {
      showToast(completeRes.message, 'error');
      setIsApproving(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    mockStore.sendMessage(contract.id, chatInput);
    setChatInput('');
    setMessages(mockStore.getMessages(contract.id));
  };

  const handleSendReview = (e: React.FormEvent) => {
    e.preventDefault();
    const res = mockStore.addReview(contract.id, ratingStars, ratingComment);
    if (res.success) {
      setHasRated(true);
      showToast(res.message, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleConfirmDispute = (reason: string) => {
    const res = mockStore.openDispute(contract.id, reason);
    if (res.success) {
      showToast('Đã gửi yêu cầu hòa giải đến Ban Quản trị UNISTY!', 'info');
      setShowDisputeModal(false);
      const updated = mockStore.getContractById(contract.id);
      if (updated) setContract({ ...updated });
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Back button & Action Menu */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Dự án của tôi</span>
        </Link>

        {/* Dispute / Help Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
            title="Thao tác khác"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActionMenu && (
            <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 text-xs z-20">
              <button
                onClick={() => {
                  setShowActionMenu(false);
                  setShowDisputeModal(true);
                }}
                className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-medium transition"
              >
                Cần UNISTY hỗ trợ việc này
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Observer / Multi-account helper banner */}
      {!isRequester && !isProvider && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="font-bold text-amber-900">
                Chế độ quan sát (Bạn đang đăng nhập: {currentUser.name})
              </p>
              <p className="text-[11px] text-amber-800/90 mt-0.5">
                Dự án này là thỏa thuận giữa <strong>{contract.requesterName}</strong> (Người thuê) và <strong>{contract.providerName}</strong> (Người làm). Chuyển tài khoản bên dưới để thực hiện các thao tác:
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                mockStore.setCurrentUserId(contract.requesterId);
                window.location.reload();
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 font-semibold text-[11px] text-amber-950 transition cursor-pointer"
            >
              Đổi sang {contract.requesterName}
            </button>
            <button
              onClick={() => {
                mockStore.setCurrentUserId(contract.providerId);
                window.location.reload();
              }}
              className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 font-semibold text-[11px] text-white transition cursor-pointer"
            >
              Đổi sang {contract.providerName}
            </button>
          </div>
        </div>
      )}

      {/* Main Work Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                #{contract.id}
              </span>
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                contract.state === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                contract.state === 'submitted' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                contract.state === 'in_progress' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                contract.state === 'disputed' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-slate-100 text-slate-700'
              }`}>
                {contract.state === 'completed' ? 'Đã hoàn thành' :
                 contract.state === 'submitted' ? 'Đã gửi bài • Chờ bạn duyệt' :
                 contract.state === 'in_progress' ? 'Đang thực hiện' :
                 contract.state === 'disputed' ? 'Đang hỗ trợ hòa giải' :
                 'Chờ thanh toán'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {contract.titleSnapshot}
            </h1>
          </div>

          {/* Price Snapshot */}
          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-slate-400 block font-normal">Tổng thù lao</span>
            <span className="text-xl sm:text-2xl font-extrabold text-teal-700">
              {contract.priceSnapshot.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* 4-Step Progress Stepper (Gợi ý 1: Đã thanh toán ➔ Đang thực hiện ➔ Bàn giao ➔ Duyệt & Hoàn tất) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {[
            { 
              label: contract.state === 'pending_payment' ? 'Chờ thanh toán' : 'Đã thanh toán', 
              done: currentStep >= 1 
            },
            { label: 'Đang thực hiện', done: currentStep >= 1 },
            { label: 'Bàn giao', done: currentStep >= 2 },
            { label: 'Duyệt & Hoàn tất', done: currentStep >= 3 },
          ].map((step, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-xl border transition flex items-center gap-2.5 ${
                step.done 
                  ? 'border-teal-500/60 bg-teal-50/50 text-teal-900' 
                  : 'border-slate-200 bg-slate-50 text-slate-400'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step.done ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {step.done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span className="text-xs font-semibold leading-tight">{step.label}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Grid Layout: Main Activity & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Scope Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Nội dung công việc</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {contract.scopeSnapshot}
            </p>
          </div>

          {/* Deliveries Section (Submissions) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              Sản phẩm đã gửi
            </h3>

            {deliveries.length > 0 ? (
              <div className="space-y-3">
                {deliveries.map(del => (
                  <div key={del.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Đã gửi lúc {new Date(del.createdAt).toLocaleTimeString('vi-VN')} - {new Date(del.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {del.notes && (
                      <p className="text-xs text-slate-700 italic">"{del.notes}"</p>
                    )}
                    <div className="space-y-1.5 pt-1">
                      {del.urls.map((url, uidx) => (
                        <a
                          key={uidx}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-medium underline break-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span>{url}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3">Chưa có liên kết bàn giao nào.</p>
            )}

            {/* Provider Submit Form */}
            {isProvider && contract.state === 'in_progress' && (
              <form onSubmit={handleSubmitDelivery} className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="font-semibold text-xs text-slate-800">Gửi liên kết sản phẩm của bạn:</h4>
                {deliveryUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      placeholder="Dán link Google Drive, Canva, Figma... (https://)"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                ))}

                {deliveryUrls.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddUrlField}
                    className="text-xs text-teal-700 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    Thêm liên kết khác
                  </button>
                )}

                <textarea
                  rows={2}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Ghi chú thêm cho người thuê (không bắt buộc)..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition"
                >
                  Gửi sản phẩm bàn giao
                </button>
              </form>
            )}
          </div>

          {/* Asynchronous Discussion Thread */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                Trò chuyện trực tiếp
              </h3>
              <span className="text-[11px] text-slate-400">Trao đổi nội bộ giữa hai bên</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {messages.map(msg => (
                <div key={msg.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{msg.senderName}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{msg.content}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhắn tin cho đối tác..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Action Column (1 col) */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
            
            <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
              Trạng thái & Thao tác
            </h3>

            {/* Case: Pending Payment */}
            {contract.state === 'pending_payment' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hai bên đã chốt thỏa thuận. Người thuê cần thanh toán để bạn sinh viên bắt đầu tiến hành công việc.
                </p>
                {isRequester ? (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition"
                  >
                    Xác nhận thanh toán
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 text-center text-xs text-slate-500">
                    Đang chờ người thuê hoàn tất thanh toán...
                  </div>
                )}
              </div>
            )}

            {/* Case: In Progress */}
            {contract.state === 'in_progress' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-teal-50 text-teal-800 text-xs font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                  Khoản tiền đã được UNISTY đảm bảo an toàn.
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {isProvider 
                    ? 'Bạn đang trong giai đoạn thực hiện. Sau khi hoàn thành, hãy nộp liên kết sản phẩm ở bảng bên trái.'
                    : 'Bạn sinh viên đang tiến hành công việc theo đúng yêu cầu đã chốt.'}
                </p>
              </div>
            )}

            {/* Case: Submitted (Ready for review) */}
            {contract.state === 'submitted' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sinh viên đã gửi sản phẩm hoàn thiện. Bạn vui lòng xem qua các liên kết và bấm duyệt bài hoặc yêu cầu sửa đổi.
                </p>

                {isRequester && (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => setShowApprovalModal(true)}
                      className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Duyệt bài & Gửi thù lao
                    </button>

                    {!showRevisionInput ? (
                      <button
                        onClick={() => setShowRevisionInput(true)}
                        className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition"
                      >
                        Yêu cầu chỉnh sửa thêm
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <textarea
                          rows={2}
                          value={revisionReason}
                          onChange={(e) => setRevisionReason(e.target.value)}
                          placeholder="Mô tả cụ thể các điểm cần bạn sinh viên sửa..."
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowRevisionInput(false)}
                            className="flex-1 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleRequestRevision}
                            className="flex-1 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                          >
                            Gửi yêu cầu
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Case: Completed */}
            {contract.state === 'completed' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Công việc đã hoàn tất. Thù lao đã được gửi đến bạn sinh viên!
                </div>

                {/* Rating Form */}
                {isRequester && !hasRated && (
                  <form onSubmit={handleSendReview} className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="text-xs font-semibold text-slate-800 block">
                      Đánh giá bạn sinh viên:
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRatingStars(star)}
                          className={`text-lg ${star <= ratingStars ? 'text-amber-400' : 'text-slate-200'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={2}
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      placeholder="Để lại lời khen hoặc góp ý xây dựng..."
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Case: Disputed */}
            {contract.state === 'disputed' && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Đang trong quá trình hỗ trợ
                </p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Ban Quản trị UNISTY đang xem xét trao đổi và sản phẩm nộp để đưa ra giải pháp thỏa đáng nhất cho cả hai bên.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <EscrowPaymentModal
          contract={contract}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            const updated = mockStore.getContractById(contract.id);
            if (updated) setContract({ ...updated });
          }}
        />
      )}

      {/* Approval & Rating Modal */}
      {showApprovalModal && (
        <ApprovalModal
          contract={contract}
          isProcessing={isApproving}
          onClose={() => setShowApprovalModal(false)}
          onConfirm={handleConfirmApproval}
        />
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <DisputeModal
          contract={contract}
          onClose={() => setShowDisputeModal(false)}
          onSubmit={handleConfirmDispute}
        />
      )}

    </div>
  );
};
