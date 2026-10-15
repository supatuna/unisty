import React, { useState } from 'react';
import { CheckCircle2, Star, ShieldCheck, X } from 'lucide-react';
import { Contract } from '../types';

interface ApprovalModalProps {
  contract: Contract;
  onClose: () => void;
  onConfirm: (stars: number, comment: string) => void;
  isProcessing: boolean;
}

const QUICK_TAGS = [
  'Bàn giao đúng hẹn ⏱️',
  'Sản phẩm chỉn chu, thẩm mỹ 🎨',
  'Giao tiếp lễ phép, nhiệt tình 🤝',
  'Hiểu đúng yêu cầu 💡',
  'Sẽ tiếp tục hợp tác ⭐',
];

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  contract,
  onClose,
  onConfirm,
  isProcessing,
}) => {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Bàn giao đúng hẹn ⏱️', 'Sản phẩm chỉn chu, thẩm mỹ 🎨']);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const fullComment = selectedTags.length > 0
      ? `${comment.trim() ? comment.trim() + ' • ' : ''}${selectedTags.join(', ')}`
      : comment.trim() || 'Rất hài lòng với sản phẩm và thái độ làm việc của bạn!';
    onConfirm(stars, fullComment);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Duyệt bài & Gửi thù lao</h3>
              <p className="text-[11px] text-slate-500">Nghiệm thu sản phẩm và giải phóng khoản tiền Escrow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleComplete} className="space-y-5 my-5">
          {/* Payment summary box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 block">Số tiền giải ngân cho sinh viên:</span>
              <span className="text-sm font-semibold text-slate-900 mt-0.5 block">{contract.providerName}</span>
            </div>
            <span className="text-lg font-extrabold text-teal-700">
              {contract.priceSnapshot.toLocaleString('vi-VN')}đ
            </span>
          </div>

          {/* Star selector */}
          <div className="text-center py-2 space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Bạn đánh giá chất lượng sản phẩm như thế nào?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStars(s)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${s <= stars ? 'fill-amber-400' : 'text-slate-200'}`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {stars === 5 ? '🌟 Rất xuất sắc & hài lòng' :
               stars === 4 ? '👍 Rất tốt, đáp ứng đúng yêu cầu' :
               stars === 3 ? '👌 Ổn, đạt yêu cầu cơ bản' :
               'Cần cải thiện thêm'}
            </p>
          </div>

          {/* Quick tags */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-600 font-medium">Nhận xét nhanh:</span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                      active
                        ? 'bg-teal-50 border-teal-300 text-teal-800 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment text area */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">
              Lời nhắn gửi đến bạn sinh viên (tùy chọn):
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ thêm cảm nhận của bạn để giúp bạn sinh viên xây dựng hồ sơ năng lực..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 transition resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-100 text-[11px] text-teal-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <span>
              Khoản tiền <strong>{contract.priceSnapshot.toLocaleString('vi-VN')}đ</strong> sẽ được chuyển ngay vào ví của bạn <strong>{contract.providerName}</strong>, đồng thời đánh giá của bạn sẽ hiển thị công khai trên Hồ sơ năng lực của bạn ấy.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Xem lại bài
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition flex items-center justify-center gap-1.5"
            >
              {isProcessing ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác nhận & Chuyển tiền</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
