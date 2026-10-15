import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-500 text-xs py-10 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
            <span className="text-teal-400">U</span>N
          </div>
          <div>
            <p className="font-semibold text-slate-800">UNISTY DUE Network</p>
            <p className="text-[11px] text-slate-400">Đại học Kinh tế – Đại học Đà Nẵng</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600">
          <Link to="/marketplace" className="hover:text-slate-900 transition">Sàn việc làm</Link>
          <Link to="/listings/new" className="hover:text-slate-900 transition">Đăng tin</Link>
          <Link to="/dashboard" className="hover:text-slate-900 transition">Dự án của tôi</Link>
          <Link to="/about" className="text-teal-700 hover:text-teal-800 font-semibold transition">
            Về đề tài (Nhóm 50K32.3)
          </Link>
          <Link to="/admin" className="hover:text-slate-900 transition">Ban Quản trị</Link>
        </div>

        <p className="text-[11px] text-slate-400 text-center sm:text-right">
          © 2026 UNISTY. Đề tài Kinh tế số Lớp 50K32.3 • DUE.
        </p>

      </div>
    </footer>
  );
};
