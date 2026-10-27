import React, { useState } from 'react';
import { X, QrCode, ArrowDownLeft, CheckCircle2, Copy, Check, ShieldCheck } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { showToast } from './Toast';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PRESET_AMOUNTS = [100000, 200000, 500000, 1000000];

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const currentUser = mockStore.getCurrentUser();
  const [amount, setAmount] = useState<number>(200000);
  const [customAmount, setCustomAmount] = useState<string>('200000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  if (!isOpen) return null;

  const userCode = currentUser.email?.includes('@due.edu.vn')
    ? currentUser.email.split('@')[0].toUpperCase()
    : (currentUser.id ? currentUser.id.slice(0, 8).toUpperCase() : '50K32');
  const transferMemo = `UNISTY NAP ${userCode}`;

  // URL trỏ ra web UNISTY khi khách quét mã bằng camera điện thoại
  const webTargetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/dashboard?topup=success&amount=${amount}&ref=${transferMemo.replace(/\s+/g, '_')}`
    : `https://unisty.due.edu.vn/dashboard`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(webTargetUrl)}&color=0f172a`;

  const handleCopy = (text: string, type: 'memo' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'memo') {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
      showToast('Đã sao chép nội dung chuyển khoản!', 'success');
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
      showToast('Đã sao chép số tài khoản!', 'success');
    }
  };

  const handleSelectAmount = (val: number) => {
    setAmount(val);
    setCustomAmount(val.toString());
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(raw);
    const num = Number(raw) || 0;
    setAmount(num);
  };

  const handleConfirmTopUp = () => {
    if (amount < 10000) {
      showToast('Số tiền nạp tối thiểu là 10.000đ.', 'error');
      return;
    }
    if (amount > 50000000) {
      showToast('Số tiền nạp tối đa mỗi lần là 50.000.000đ.', 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = mockStore.topUpWallet(currentUser.id, amount, 'vietqr');
      setIsProcessing(false);
      if (res.success) {
        showToast(res.message, 'success');
        onSuccess();
        onClose();
      } else {
        showToast(res.message, 'error');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200/80 space-y-5 relative max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/70">
              <ArrowDownLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Nạp tiền vào ví UNISTY</h3>
              <p className="text-[11px] text-slate-400">Cổng chuyển khoản VietQR tự động 24/7</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Chọn số tiền muốn nạp:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map(val => (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectAmount(val)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition border ${
                  amount === val
                    ? 'border-teal-500 bg-teal-50 text-teal-800 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                +{val >= 1000000 ? `${val / 1000000}M` : `${val / 1000}k`}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <div className="relative">
              <input
                type="text"
                value={Number(customAmount || 0).toLocaleString('vi-VN')}
                onChange={handleCustomChange}
                placeholder="Nhập số tiền khác"
                className="w-full text-sm font-bold pl-3 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 text-slate-900"
              />
              <span className="absolute right-3 top-3 text-xs font-semibold text-slate-400">VNĐ</span>
            </div>
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 text-[11px] font-semibold">
            <QrCode className="w-3.5 h-3.5" />
            <span>Quét QR bằng điện thoại</span>
          </div>

          {/* Real Generated QR Image */}
          <div className="w-44 h-44 mx-auto bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
            <img 
              src={qrImageUrl} 
              alt="Mã QR Nạp tiền UNISTY"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Bank Transfer Details Table */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 text-left text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-500">
              <span>Ngân hàng thụ hưởng:</span>
              <span className="font-bold text-slate-800">MB Bank (Quân Đội)</span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span>Số tài khoản:</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono font-bold text-slate-800">8888 6688 9999</span>
                <button
                  type="button"
                  onClick={() => handleCopy('888866889999', 'account')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-teal-600 transition"
                  title="Sao chép STK"
                >
                  {copiedAccount ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span>Chủ tài khoản:</span>
              <span className="font-bold text-slate-800">UNISTY DUE - 50K32</span>
            </div>

            <div className="flex justify-between items-center text-slate-500">
              <span>Số tiền nạp:</span>
              <span className="font-extrabold text-teal-700 text-sm">{amount.toLocaleString('vi-VN')} VNĐ</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between items-center bg-teal-50/60 p-2.5 rounded-xl border border-teal-100/70">
              <div>
                <div className="text-[10px] text-teal-800 font-semibold uppercase tracking-wider">Nội dung chuyển khoản:</div>
                <div className="font-mono font-black text-teal-900 text-xs tracking-wider mt-0.5">{transferMemo}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(transferMemo, 'memo')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] transition shadow-xs"
              >
                {copiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMemo ? 'Đã sao chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 space-y-2">
          <button
            type="button"
            disabled={isProcessing || amount <= 0}
            onClick={handleConfirmTopUp}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isProcessing ? 'Đang cập nhật ví...' : `Xác nhận nạp +${amount.toLocaleString('vi-VN')}đ vào ví ngay`}</span>
          </button>

          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Hệ thống ví bảo mật chuẩn kinh tế số DUE</span>
          </p>
        </div>

      </div>
    </div>
  );
};
