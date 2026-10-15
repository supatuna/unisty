import React, { useState } from 'react';
import { Shield, RefreshCw, CheckCircle2 } from 'lucide-react';
import { mockStore } from '../data/mockStore';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'disputes' | 'sandbox'>('sandbox');
  const allUsers = mockStore.getAllUsers();

  // Calculate total circulating balance (Conservation of money principle)
  let totalAvailable = 0;
  let totalHeld = 0;
  allUsers.forEach(u => {
    const w = mockStore.getWallet(u.id);
    totalAvailable += w.available;
    totalHeld += w.held;
  });

  const handleReset = () => {
    if (window.confirm('Khôi phục toàn bộ kho dữ liệu về trạng thái ban đầu?')) {
      mockStore.resetAll();
      window.location.reload();
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
          Kiểm toán dòng tiền
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 px-3 text-xs font-semibold border-b-2 transition ${
            activeTab === 'disputes'
              ? 'border-teal-600 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Hỗ trợ giải quyết tranh chấp
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
              <span className="text-xs text-slate-500 font-medium">Tiền đang tạm giữ cho dự án</span>
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
              <h3 className="font-bold text-sm text-slate-900">Danh sách tài khoản thử nghiệm</h3>
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
                  {allUsers.map(u => {
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
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm text-center">
          <p className="text-xs text-slate-500">
            Hiện tại không có tranh chấp nào cần Ban Quản trị can thiệp.
          </p>
        </div>
      )}

    </div>
  );
};
