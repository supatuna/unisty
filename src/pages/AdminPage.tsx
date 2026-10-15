import React, { useState } from 'react';
import { Shield, RefreshCw, CheckCircle2, AlertTriangle, Scale, RotateCcw, ArrowRight } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { showToast } from '../components/Toast';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'disputes' | 'sandbox'>('sandbox');
  const [, setRefreshKey] = useState(0);

  const allUsers = mockStore.getAllUsers();
  const disputes = mockStore.getDisputes();

  // Calculate total circulating balance (Conservation of money principle)
  let totalAvailable = 0;
  let totalHeld = 0;
  allUsers.forEach((u) => {
    const w = mockStore.getWallet(u.id);
    totalAvailable += w.available;
    totalHeld += w.held;
  });

  const handleReset = () => {
    if (window.confirm('Khôi phục toàn bộ kho dữ liệu về trạng thái ban đầu?')) {
      mockStore.resetAll();
      showToast('Đã khôi phục toàn bộ dữ liệu mẫu ban đầu!', 'info');
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleResolve = (disputeId: string, resolution: 'refund_all' | 'release_all') => {
    const reason = resolution === 'refund_all'
      ? 'Ban Quản trị quyết định hoàn 100% tiền tạm giữ cho người thuê do sinh viên trễ hạn quá quy định.'
      : 'Ban Quản trị quyết định giải ngân thù lao cho sinh viên sau khi kiểm tra bằng chứng hoàn thành.';

    const res = mockStore.resolveDispute(disputeId, resolution, reason);
    if (res.success) {
      showToast(res.message, 'success');
      setRefreshKey((k) => k + 1);
    } else {
      showToast(res.message, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trung tâm Quản trị UNISTY</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi dòng tiền đảm bảo, hỗ trợ giải quyết tranh chấp và kiểm soát hệ thống.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới toàn bộ dữ liệu mẫu
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'sandbox'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kiểm toán dòng tiền Escrow
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'disputes'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Hỗ trợ giải quyết tranh chấp</span>
          {disputes.some((d) => !d.resolution) && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {activeTab === 'sandbox' ? (
        <div className="space-y-6">
          
          {/* Conservation of Money Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Số dư khả dụng của các tài khoản</span>
              <p className="text-xl font-bold text-slate-900">{totalAvailable.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tiền đang tạm giữ cho dự án (Escrow)</span>
              <p className="text-xl font-bold text-amber-600">{totalHeld.toLocaleString('vi-VN')}đ</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 font-medium">Tổng số tiền trong hệ thống</span>
              <p className="text-xl font-bold text-teal-700">{(totalAvailable + totalHeld).toLocaleString('vi-VN')}đ</p>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Danh sách tài khoản & Số dư Escrow</h3>
              <span className="text-xs text-slate-400">{allUsers.length} tài khoản</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Tên & Vai trò</th>
                    <th className="p-4">Email đăng ký</th>
                    <th className="p-4">Xác thực DUE</th>
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
                        <td className="p-4">
                          {u.isDueVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              @due.edu.vn
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Ngoài trường</span>
                          )}
                        </td>
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
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-teal-600" />
              Danh sách khiếu nại & Yêu cầu trọng tài hòa giải ({disputes.length})
            </h3>
            <span className="text-xs text-slate-500">Bảo vệ quyền lợi công bằng theo Điều lệ UNISTY</span>
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

                    {/* Parties info */}
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

                    {/* Reason */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 space-y-1">
                      <span className="font-semibold block flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Lý do khiếu nại:
                      </span>
                      <p className="text-[11px] text-amber-800 leading-relaxed">{d.reason}</p>
                    </div>

                    {/* Resolution details if already resolved */}
                    {isResolved ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <span className="font-semibold block flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Kết luận của Ban Quản trị: {d.resolution === 'refund_all' ? 'Hoàn trả 100% cho người thuê' : 'Giải phóng thù lao cho sinh viên'}
                        </span>
                        <p className="text-[11px] text-emerald-800">{d.resolutionReason}</p>
                      </div>
                    ) : (
                      /* Action Buttons for Admin */
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

    </div>
  );
};
