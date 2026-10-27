import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Briefcase, User } from 'lucide-react';
import { mockStore } from '../data/mockStore';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const isLoggedIn = mockStore.isLoggedIn();
  const currentUser = mockStore.getCurrentUser();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { label: 'Trang chủ', path: '/', icon: Home },
    { label: 'Sàn việc', path: '/marketplace', icon: Compass },
    { label: 'Dự án', path: isLoggedIn ? '/dashboard' : '/login', icon: Briefcase },
    { label: isLoggedIn ? 'Hồ sơ' : 'Đăng nhập', path: isLoggedIn ? `/profiles/${currentUser.id}` : '/login', icon: User },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 md:hidden py-1 px-2 shadow-lg">
      <div className="grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1.5 transition-colors ${
                active ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
