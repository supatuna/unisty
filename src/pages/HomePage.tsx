import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Sparkles, ChevronRight, LogIn, Compass } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { ListingCard } from '../components/ListingCard';

const QUICK_TAGS = [
  { label: 'Slide Canva & PPT', category: 'design' },
  { label: 'Chạy số liệu SPSS', category: 'office' },
  { label: 'Dựng video CapCut', category: 'video' },
  { label: 'Dịch thuật kinh tế', category: 'writing' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const allListings = mockStore.getListings();

  const services = allListings.filter(l => l.kind === 'service').slice(0, 4);
  const needs = allListings.filter(l => l.kind === 'need').slice(0, 2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/marketplace?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Mạng lưới Tài năng Sinh viên Đại học Kinh tế – ĐH Đà Nẵng</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Đồng hành cùng sinh viên <span className="text-teal-700">DUE</span> trong mọi công việc
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Từ thiết kế slide, chạy số liệu SPSS, dựng video ngắn đến dịch thuật chuyên ngành. Mọi giao dịch đều được <strong>bảo đảm an toàn</strong> — chỉ gửi thù lao khi bạn thực sự hài lòng.
          </p>

          {/* Search Form */}
          <form 
            onSubmit={handleSearch}
            className="mt-8 max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition flex items-center gap-2"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bạn cần hỗ trợ việc gì? (Ví dụ: slide Canva, SPSS, video CapCut...)"
              className="w-full text-sm py-2 px-1 focus:outline-none text-slate-800 placeholder:text-slate-400 bg-transparent"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition shrink-0"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Gợi ý nhanh:</span>
            {QUICK_TAGS.map((tag, idx) => (
              <Link
                key={idx}
                to={`/marketplace?category=${tag.category}`}
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/80 hover:border-teal-500/50 hover:text-teal-700 transition"
              >
                {tag.label}
              </Link>
            ))}
          </div>

          {/* Unauthenticated Welcome CTA */}
          {!mockStore.isLoggedIn() && (
            <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập để bắt đầu</span>
              </Link>
              <Link
                to="/marketplace"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200/90 shadow-sm transition flex items-center gap-2"
              >
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                <span>Tham quan sàn trước</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* THREE SIMPLE STEPS (HOW IT WORKS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              An tâm giao việc chỉ với 3 bước đơn giản
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Quy trình rõ ràng, minh bạch giúp bạn và sinh viên làm việc cùng nhau một cách thoải mái nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Chọn bạn phù hợp</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Khám phá dịch vụ của các bạn sinh viên DUE hoặc đăng nhu cầu để các bạn chủ động gửi đề xuất.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Thanh toán đảm bảo</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                UNISTY sẽ tạm giữ số tiền này. Người làm chỉ nhận được thù lao sau khi bạn đã kiểm tra và duyệt bài.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Nhận bài & Duyệt chi</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Xem sản phẩm hoàn thiện. Bấm duyệt để gửi thù lao đến bạn sinh viên hoặc yêu cầu chỉnh sửa thêm nếu cần.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES BY DUE STUDENTS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Dịch vụ nổi bật từ Sinh viên DUE
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tài khoản đã xác thực email trường @due.edu.vn, chuyên môn vững vàng và chi phí sinh viên.
            </p>
          </div>
          <Link
            to="/marketplace?type=service"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* OPEN NEEDS (PEOPLE LOOKING FOR HELP) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Việc đang tìm người làm
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cơ hội công việc từ người thuê ngoài trường và các cửa hàng, doanh nghiệp tại Đà Nẵng.
            </p>
          </div>
          <Link
            to="/marketplace?type=need"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 group"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {needs.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-lg">
          <div className="max-w-xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bạn là sinh viên DUE muốn tìm kiếm dự án?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              Tạo hồ sơ năng lực ngay hôm nay để nhận các cơ hội hợp tác thực tế về thiết kế, chạy số liệu hoặc sản xuất video.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/listings/new"
                className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-md transition"
              >
                Đăng dịch vụ của bạn
              </Link>
              <Link
                to="/marketplace"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition"
              >
                Khám phá cơ hội việc làm
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
