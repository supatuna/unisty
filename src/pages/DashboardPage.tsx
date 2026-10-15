import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wallet, User as UserIcon, ExternalLink } from 'lucide-react';
import { mockStore } from '../data/mockStore';

export const DashboardPage: React.FC = () => {
  const currentUser = mockStore.getCurrentUser();
  const wallet = mockStore.getWallet(currentUser.id);
  const myContracts = mockStore.getContractsForUser(currentUser.id);
  const myListings = mockStore.getListings().filter(l => l.ownerId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Profile & Wallet Top Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Profile Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl ${currentUser.avatarColor} text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm`}>
                  {currentUser.avatarInitial}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                    {currentUser.isDueVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                        Sinh viên DUE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{currentUser.major || 'Thành viên mạng lưới UNISTY'}</p>
                </div>
              </div>

              {/* View Public Portfolio Button */}
              <Link
                to={`/profiles/${currentUser.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold border border-teal-200/70 transition shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5 text-teal-600" />
                <span>Xem Hồ sơ & Portfolio</span>
                <ExternalLink className="w-3 h-3 text-teal-600" />
              </Link>
            </div>

            {currentUser.bio && (
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {currentUser.bio}
              </p>
            )}
          </div>

          {/* Skills tags */}
          {currentUser.skills && currentUser.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-4 mt-4 border-t border-slate-100">
              {currentUser.skills.map((skill, sidx) => (
                <span key={sidx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
              <span className="flex items-center gap-1.5 font-medium">
                <Wallet className="w-4 h-4 text-teal-400" />
                Số dư tài khoản
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">Trải nghiệm</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400">Số dư khả dụng</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">
                {wallet.available.toLocaleString('vi-VN')}đ
              </p>
            </div>

            {wallet.held > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>Đang tạm giữ cho dự án:</span>
                <span className="font-semibold text-amber-300">{wallet.held.toLocaleString('vi-VN')}đ</span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
            Mỗi tài khoản được cấp 1.000.000đ để trải nghiệm việc hợp tác và quy trình thanh toán đảm bảo.
          </p>
        </div>

      </div>

      {/* Contracts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Dự án của bạn ({myContracts.length})
          </h2>
        </div>

        {myContracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myContracts.map(c => {
              const isReq = currentUser.id === c.requesterId;
              return (
                <Link
                  key={c.id}
                  to={`/work/${c.id}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-teal-500/50 shadow-sm transition space-y-3 block group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">#{c.id}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      c.state === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                      c.state === 'submitted' ? 'bg-indigo-50 text-indigo-700' :
                      c.state === 'in_progress' ? 'bg-teal-50 text-teal-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {c.state === 'completed' ? 'Đã hoàn thành' :
                       c.state === 'submitted' ? 'Đã gửi bài' :
                       c.state === 'in_progress' ? 'Đang thực hiện' : 'Chờ thanh toán'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition line-clamp-1">
                    {c.titleSnapshot}
                  </h3>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      {isReq ? `Người làm: ${c.providerName}` : `Người thuê: ${c.requesterName}`}
                    </span>
                    <span className="font-bold text-teal-700">
                      {c.priceSnapshot.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6">
            <p className="text-xs text-slate-500">Bạn chưa có dự án nào đang diễn ra.</p>
            <Link to="/marketplace" className="mt-2 inline-block text-xs font-semibold text-teal-700">
              Khám phá việc làm ngay
            </Link>
          </div>
        )}
      </div>

      {/* My Listings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Tin bạn đã đăng ({myListings.length})
          </h2>
          <Link to="/listings/new" className="text-xs font-semibold text-teal-700 hover:underline">
            + Đăng thêm tin
          </Link>
        </div>

        {myListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myListings.map(l => (
              <Link
                key={l.id}
                to={`/listings/${l.id}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-teal-500/50 shadow-sm transition space-y-2 block"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{new Date(l.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="font-bold text-teal-700">{l.price.toLocaleString('vi-VN')}đ</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{l.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{l.description}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 p-6">
            <p className="text-xs text-slate-500">Bạn chưa đăng bài nào trên sàn.</p>
          </div>
        )}
      </div>

    </div>
  );
};
