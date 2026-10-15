import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Inbox } from 'lucide-react';
import { mockStore } from '../data/mockStore';
import { ListingCard } from '../components/ListingCard';
import { ListingKind } from '../types';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'Tất cả lĩnh vực' },
  { id: 'design', label: 'Thiết kế & Slide' },
  { id: 'office', label: 'Tin học & SPSS' },
  { id: 'video', label: 'Video CapCut' },
  { id: 'writing', label: 'Dịch thuật & Nội dung' },
];

export const MarketplacePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentType = (searchParams.get('type') as ListingKind) || 'service';
  const currentCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [priceRange, setPriceRange] = useState<'all' | 'under200' | '200to500' | 'over500'>('all');

  const allListings = mockStore.getListings();

  // Filter listings
  const filteredListings = useMemo(() => {
    return allListings.filter(item => {
      // Kind
      if (item.kind !== currentType) return false;

      // Category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchOwner = item.ownerName.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchOwner) return false;
      }

      // Price range
      if (priceRange === 'under200' && item.price > 200000) return false;
      if (priceRange === '200to500' && (item.price <= 200000 || item.price > 500000)) return false;
      if (priceRange === 'over500' && item.price <= 500000) return false;

      return true;
    });
  }, [allListings, currentType, selectedCategory, searchTerm, priceRange]);

  const handleTypeChange = (type: ListingKind) => {
    setSearchParams(prev => {
      prev.set('type', type);
      return prev;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sàn việc làm & Kỹ năng</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kết nối trực tiếp nhu cầu công việc với sinh viên Đại học Kinh tế (DUE).
          </p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 shrink-0">
          <button
            onClick={() => handleTypeChange('service')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              currentType === 'service'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dịch vụ sinh viên ({allListings.filter(l => l.kind === 'service').length})
          </button>
          <button
            onClick={() => handleTypeChange('need')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              currentType === 'need'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Việc đang tuyển ({allListings.filter(l => l.kind === 'need').length})
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo kỹ năng, tên việc hoặc bạn sinh viên..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:border-teal-500 shadow-sm"
            />
          </div>

          {/* Price Quick Filter */}
          <div className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setPriceRange('all')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border shrink-0 transition ${
                priceRange === 'all'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Mọi mức giá
            </button>
            <button
              onClick={() => setPriceRange('under200')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border shrink-0 transition ${
                priceRange === 'under200'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Dưới 200k
            </button>
            <button
              onClick={() => setPriceRange('200to500')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border shrink-0 transition ${
                priceRange === '200to500'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              200k - 500k
            </button>
            <button
              onClick={() => setPriceRange('over500')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border shrink-0 transition ${
                priceRange === 'over500'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Trên 500k
            </button>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Chưa có bài đăng phù hợp</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy thử tìm bằng từ khóa khác hoặc bỏ bớt các bộ lọc để xem nhiều kết quả hơn nhé.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setPriceRange('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

    </div>
  );
};
