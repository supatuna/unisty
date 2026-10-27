import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { ListingKind, ListingCategory } from '../types';
import { showToast } from '../components/Toast';

export const NewListingPage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = mockStore.isLoggedIn();
  const currentUser = mockStore.getCurrentUser();

  const [kind, setKind] = useState<ListingKind>(currentUser.isDueVerified ? 'service' : 'need');
  const [category, setCategory] = useState<ListingCategory>('design');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(200000);
  const [deliveryDays, setDeliveryDays] = useState(2);
  const [dueAt, setDueAt] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center">
          <ArrowLeft className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Yêu cầu đăng nhập</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Vui lòng đăng nhập bằng tài khoản sinh viên DUE hoặc đối tác trước khi đăng tin lên sàn.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm transition"
          >
            Đăng nhập ngay
          </Link>
          <Link
            to="/marketplace"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            Quay lại sàn
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price < 1 || price > 1000000) {
      showToast('Chi phí phải từ 1đ đến 1.000.000đ.', 'error');
      return;
    }

    mockStore.createListing({
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerAvatar: currentUser.avatarInitial,
      ownerAvatarColor: currentUser.avatarColor,
      ownerAvatarUrl: currentUser.avatarUrl,
      isOwnerDue: currentUser.isDueVerified,
      kind,
      category,
      title,
      description,
      price: Number(price),
      deliveryDays: kind === 'service' ? Number(deliveryDays) : undefined,
      dueAt: kind === 'need' ? dueAt : undefined,
    });

    showToast('Đã đăng tin mới thành công lên sàn UNISTY!', 'success');
    setTimeout(() => navigate('/marketplace'), 400);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Back button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Đăng tin mới
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng gói dịch vụ kỹ năng của bạn hoặc tìm kiếm bạn sinh viên hỗ trợ dự án.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Post Type Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Bạn muốn đăng:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setKind('service')}
                disabled={!currentUser.isDueVerified}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  kind === 'service'
                    ? 'border-teal-500 bg-teal-50/60 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50 opacity-60'
                }`}
              >
                <span className="text-xs font-bold text-slate-900 block">Dịch vụ của bạn</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Dành cho sinh viên DUE cung cấp kỹ năng
                </span>
              </button>

              <button
                type="button"
                onClick={() => setKind('need')}
                className={`p-3.5 rounded-2xl border text-left transition ${
                  kind === 'need'
                    ? 'border-teal-500 bg-teal-50/60 shadow-sm'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold text-slate-900 block">Cần tìm người làm</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Đăng việc để sinh viên ứng tuyển
                </span>
              </button>
            </div>
            {!currentUser.isDueVerified && (
              <p className="text-[11px] text-amber-600 mt-1.5">
                * Chỉ tài khoản sinh viên có email trường @due.edu.vn mới có thể đăng dịch vụ.
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Lĩnh vực công việc:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ListingCategory)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            >
              <option value="design">Thiết kế Slide Canva & PPT</option>
              <option value="office">Tin học văn phòng, SPSS & Dữ liệu</option>
              <option value="video">Dựng video ngắn TikTok / CapCut</option>
              <option value="writing">Dịch thuật & Biên soạn nội dung</option>
              <option value="tutor">Gia sư & Hướng dẫn học tập</option>
              <option value="other">Lĩnh vực khác</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Tiêu đề bài đăng:
            </label>
            <input
              type="text"
              required
              minLength={10}
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Thiết kế slide thuyết trình Canva chuẩn học thuật cho bài tập lớn"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Mô tả chi tiết:
            </label>
            <textarea
              rows={4}
              required
              minLength={30}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nêu cụ thể yêu cầu, định dạng sản phẩm, cam kết hoặc các hỗ trợ đi kèm..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Price & Delivery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Mức thù lao dự kiến (VNĐ):
              </label>
              <input
                type="number"
                required
                min={1}
                max={1000000}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Tối đa 1.000.000đ</span>
            </div>

            {kind === 'service' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Thời gian hoàn thành (ngày):
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={30}
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Hạn chót cần bài:
                </label>
                <input
                  type="date"
                  required
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link
              to="/marketplace"
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition"
            >
              Đăng tin ngay
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
