import React, { useState } from 'react';
import { ShieldCheck, QrCode, Wallet, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Contract } from '../types';
import { mockStore } from '../data/mockStore';

interface EscrowPaymentModalProps {
  contract: Contract;
  onClose: () => void;
  onSuccess: () => void;
}

export const EscrowPaymentModal: React.FC<EscrowPaymentModalProps> = ({
  contract,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<'wallet' | 'vietqr'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentUser = mockStore.getCurrentUser();
  const wallet = mockStore.getWallet(currentUser.id);
  const hasEnoughBalance = wallet.available >= contract.priceSnapshot;

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = mockStore.fundContract(contract.id, method);
      setIsProcessing(false);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.message);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Thanh toán đảm bảo</h3>
              <p className="text-[11px] text-slate-500">Bảo vệ giao dịch bởi UNISTY</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snapshot Summary */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <p className="text-xs text-slate-500 font-medium">Chi tiết công việc:</p>
          <p className="text-xs font-bold text-slate-800 mt-0.5 line-clamp-1">{contract.titleSnapshot}</p>
          <div className="mt-2.5 flex items-center justify-between pt-2.5 border-t border-slate-200/60 text-xs">
            <span className="text-slate-600">Số tiền thanh toán:</span>
            <span className="text-sm sm:text-base font-extrabold text-teal-700">
              {contract.priceSnapshot.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setMethod('wallet')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
              method === 'wallet'
                ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-sm'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Số dư tài khoản
          </button>

          <button
            onClick={() => setMethod('vietqr')}
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition ${
              method === 'vietqr'
                ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-sm'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Chuyển khoản VietQR
          </button>
        </div>

        {/* Method Content */}
        {method === 'wallet' ? (
          <div className="space-y-3 mb-5">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <span className="text-slate-500">Số dư khả dụng của bạn:</span>
              <span className={`font-semibold ${hasEnoughBalance ? 'text-slate-900' : 'text-rose-600'}`}>
                {wallet.available.toLocaleString('vi-VN')}đ
              </span>
            </div>

            {!hasEnoughBalance && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                Số dư hiện tại không đủ. Bạn có thể chọn chuyển khoản VietQR hoặc nạp thêm qua Công cụ Trình diễn.
              </p>
            )}
          </div>
        ) : (
          <div className="text-center p-3 mb-5 bg-slate-50 rounded-2xl border border-slate-200/80">
            {/* SVG Mock QR Code */}
            <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative">
              <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] text-center p-2 font-mono">
                [ MÃ VIETQR SANDBOX ]
                <br />
                UNISTY-ESCROW
              </div>
              <span className="absolute bottom-1 text-[9px] text-slate-400 font-sans">Mô phỏng thanh toán</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Quét bằng ứng dụng ngân hàng bất kỳ để chuyển tiền tạm giữ vào tài khoản bảo đảm.
            </p>
          </div>
        )}

        {/* Safety Note */}
        <p className="text-[11px] text-slate-600 bg-teal-50/60 p-3 rounded-xl border border-teal-100/70 leading-relaxed mb-4">
          🛡️ <strong>An tâm tuyệt đối:</strong> UNISTY sẽ tạm giữ số tiền này. Bạn sinh viên chỉ nhận được thù lao sau khi bạn đã xem sản phẩm và bấm duyệt bài hài lòng.
        </p>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium mb-3">{errorMessage}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Để sau
          </button>
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing || (method === 'wallet' && !hasEnoughBalance)}
            className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
          >
            {isProcessing ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận thanh toán</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
