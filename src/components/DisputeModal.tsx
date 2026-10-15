import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { Contract } from '../types';

interface DisputeModalProps {
  contract: Contract;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const COMMON_REASONS = [
  'Bàn giao chậm trễ quá 48h so với hạn cam kết',
  'Sản phẩm không đúng với mô tả và yêu cầu ban đầu',
  'Người làm việc không phản hồi tin nhắn quá 24h',
  'Yêu cầu chỉnh sửa nhiều lần nhưng không cải thiện',
  'Vấn đề khác',
];

export const DisputeModal: React.FC<DisputeModalProps> = ({
  contract,
  onClose,
  onSubmit,
}) => {
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [detailText, setDetailText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = selectedReason === 'Vấn đề khác'
      ? detailText.trim()
      : `${selectedReason}${detailText.trim() ? ': ' + detailText.trim() : ''}`;

    if (!finalReason) {
      alert('Vui lòng nêu rõ lý do bạn cần hỗ trợ.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(finalReason);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hỗ trợ giải quyết bất đồng</h3>
              <p className="text-[11px] text-slate-500">Ban Quản trị UNISTY sẽ làm trọng tài hòa giải công bằng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 my-5">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Khoản tiền {contract.priceSnapshot.toLocaleString('vi-VN')}đ đang được khóa an toàn trong Escrow
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Khi mở yêu cầu hỗ trợ, trạng thái hợp đồng sẽ chuyển thành &quot;Đang hòa giải&quot;. Ban Quản trị sẽ đối chiếu nội dung thỏa thuận và lịch sử tin nhắn để đưa ra quyết định hoàn tiền hoặc giải ngân.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800 block">
              Vấn đề bạn đang gặp phải:
            </label>
            <div className="space-y-1.5">
              {COMMON_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedReason === r
                      ? 'border-amber-400 bg-amber-50/50 text-slate-900 font-medium'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="dispute_reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-800 block">
              Mô tả chi tiết bằng chứng / bối cảnh:
            </label>
            <textarea
              value={detailText}
              onChange={(e) => setDetailText(e.target.value)}
              placeholder="Nêu rõ mốc thời gian, nội dung hai bên đã trao đổi hoặc đính kèm link minh chứng..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 transition resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu hòa giải'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
