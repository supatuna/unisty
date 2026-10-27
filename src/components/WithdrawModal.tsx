import React, { useState } from 'react';
import { X, ArrowUpRight, Building2, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { showToast } from './Toast';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const POPULAR_BANKS = [
  'Vietcombank (VCB)',
  'MB Bank (Quân Đội)',
  'Techcombank (TCB)',
  'ACB (Á Châu)',
  'VPBank (Việt Nam Thịnh Vượng)',
  'TPBank (Tiên Phong)',
  'BIDV',
  'VietinBank',
  'Agribank',
];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const currentUser = mockStore.getCurrentUser();
  const wallet = mockStore.getWallet(currentUser.id);

  const [bankName, setBankName] = useState(POPULAR_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('1029384756');
  const [accountHolder, setAccountHolder] = useState(currentUser.name.toUpperCase());
  const [amount, setAmount] = useState<number>(200000);
  const [customAmount, setCustomAmount] = useState<string>('200000');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

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

  const handleWithdrawAll = () => {
    setAmount(wallet.available);
    setCustomAmount(wallet.available.toString());
  };

  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber.trim()) {
      showToast('Vui lòng nhập số tài khoản ngân hàng.', 'error');
      return;
    }
    if (!accountHolder.trim()) {
      showToast('Vui lòng nhập tên chủ tài khoản.', 'error');
      return;
    }
    if (amount <= 0) {
      showToast('Số tiền rút phải lớn hơn 0đ.', 'error');
      return;
    }
    if (amount > wallet.available) {
      showToast(`Số dư khả dụng không đủ. Bạn chỉ có ${wallet.available.toLocaleString('vi-VN')}đ.`, 'error');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const res = mockStore.withdrawWallet(currentUser.id, amount, {
        bankName,
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim().toUpperCase(),
      });
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
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/70">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Rút tiền về tài khoản ngân hàng</h3>
              <p className="text-[11px] text-slate-400">Giải ngân thù lao sinh viên & đối tác</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Available Balance Card */}
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Số dư khả dụng hiện có</span>
            <span className="text-xl font-extrabold text-teal-400">
              {wallet.available.toLocaleString('vi-VN')}đ
            </span>
          </div>
          <button
            type="button"
            onClick={handleWithdrawAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition"
          >
            Rút tất cả
          </button>
        </div>

        <form onSubmit={handleConfirmWithdraw} className="space-y-4">
          
          {/* Bank Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Ngân hàng thụ hưởng:
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 bg-white"
              >
                {POPULAR_BANKS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Number */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Số tài khoản ngân hàng:
            </label>
            <input
              type="text"
              required
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Ví dụ: 1029384756"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 font-mono"
            />
          </div>

          {/* Account Holder */}
          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Tên chủ tài khoản (Viết hoa không dấu):
            </label>
            <input
              type="text"
              required
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value.toUpperCase())}
              placeholder="Ví dụ: NGUYEN VAN TUAN"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 uppercase font-semibold text-slate-800"
            />
          </div>

          {/* Amount to Withdraw */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-700 block">
              Số tiền muốn rút (VNĐ):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[100000, 200000, 500000].map(val => (
                <button
                  key={val}
                  type="button"
                  disabled={val > wallet.available}
                  onClick={() => handleSelectAmount(val)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold transition border disabled:opacity-40 ${
                    amount === val
                      ? 'border-teal-500 bg-teal-50 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {val.toLocaleString('vi-VN')}đ
                </button>
              ))}
            </div>

            <div className="relative pt-1">
              <input
                type="text"
                required
                value={Number(customAmount || 0).toLocaleString('vi-VN')}
                onChange={handleCustomChange}
                placeholder="Nhập số tiền muốn rút"
                className="w-full text-sm font-bold pl-3 pr-12 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 text-slate-900"
              />
              <span className="absolute right-3 top-3.5 text-xs font-semibold text-slate-400">VNĐ</span>
            </div>
          </div>

          {/* Academic Policy Alert */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Chính sách kiểm toán giải ngân (Disbursement)</span>
            </p>
            <p>
              Lệnh rút sẽ được hệ thống chi hộ qua chuẩn Open Banking trong vòng 30 giây mà không thu phí sàn (0% hoa hồng).
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing || amount <= 0 || amount > wallet.available}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>{isProcessing ? 'Đang gửi lệnh rút...' : `Rút ${amount.toLocaleString('vi-VN')}đ về tài khoản ngân hàng`}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
