import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, PlusCircle, Briefcase, Compass, Wallet as WalletIcon, User, ChevronDown, Shield, LogIn } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentUser = mockStore.getCurrentUser();
  const wallet = mockStore.getWallet(currentUser.id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo & Slogan */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-teal-400">U</span>N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">UNISTY</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  DUE Network
                </span>
              </div>
            </div>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/marketplace"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/marketplace') 
                  ? 'bg-slate-100 text-teal-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              Sàn việc làm
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard') 
                  ? 'bg-slate-100 text-teal-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Dự án của tôi
            </Link>

            <Link
              to="/safety"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/safety') 
                  ? 'bg-slate-100 text-teal-700 font-semibold' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              Tiêu chuẩn an toàn
            </Link>
          </nav>
        </div>

        {/* Right Action Deck */}
        <div className="flex items-center gap-3">
          {/* Post button */}
          <Link
            to="/listings/new"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition-all hover:shadow"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Đăng tin mới
          </Link>

          {/* Wallet summary */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs text-slate-700 transition"
            title="Số dư tài khoản"
          >
            <WalletIcon className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-semibold text-slate-900">
              {wallet.available.toLocaleString('vi-VN')}đ
            </span>
          </Link>

          {/* User profile dropdown & direct link to Portfolio */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-1 p-1 rounded-xl hover:bg-slate-100 transition group focus:outline-none"
              title="Tài khoản & Portfolio"
            >
              <div className={`w-8 h-8 rounded-full ${currentUser.avatarColor} text-white flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-teal-500/40 transition shrink-0`}>
                {currentUser.avatarInitial}
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition" />
                </p>
                <p className="text-[11px] text-teal-600 font-medium">
                  {currentUser.isDueVerified ? 'Sinh viên DUE' : 'Người thuê'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to={`/profiles/${currentUser.id}`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-teal-50/70 hover:text-teal-900 font-semibold transition"
                  >
                    <User className="w-4 h-4 text-teal-600" />
                    <span>Hồ sơ & Portfolio của tôi</span>
                  </Link>

                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    <span>Dự án & Quản lý ví</span>
                  </Link>

                  <Link
                    to="/safety"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Shield className="w-4 h-4 text-slate-500" />
                    <span>Quy chế an toàn DUE</span>
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-teal-700 hover:bg-teal-50 font-medium transition border-t border-slate-100 mt-1"
                  >
                    <LogIn className="w-4 h-4 text-teal-600" />
                    <span>Đổi tài khoản / Đăng nhập SSO</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Auth SSO Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </header>
  );
};
