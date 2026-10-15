import React, { useState } from 'react';
import { 
  X, CheckCircle2, Plus, Trash2, Award, GraduationCap, 
  ExternalLink, Sparkles, ShieldCheck, Tag, FileText 
} from 'lucide-react';
import { User, Achievement, PortfolioItem } from '../types';
import { mockStore } from '../data/mockStore';
import { showToast } from './Toast';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSaved: () => void;
  initialTab?: 'basic' | 'skills' | 'achievements' | 'portfolio';
}

const AVATAR_COLORS = [
  'bg-teal-600',
  'bg-indigo-600',
  'bg-rose-500',
  'bg-amber-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-sky-600',
  'bg-slate-900',
];

const SUGGESTED_SKILLS = [
  'Thiết kế Canva',
  'PowerPoint chuyên sâu',
  'Phân tích SPSS',
  'Dựng video CapCut',
  'IELTS 7.5',
  'Dịch thuật Anh - Việt',
  'Content Marketing',
  'Excel VBA & Dashboard',
  'MOS Master',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  user,
  onClose,
  onSaved,
  initialTab = 'basic',
}) => {
  const [name, setName] = useState(user.name);
  const [studentClass, setStudentClass] = useState(user.studentClass || '50K32.3');
  const [major, setMajor] = useState(user.major || 'Khoa Kinh doanh Quốc tế — ĐH Kinh tế (DUE)');
  const [bio, setBio] = useState(user.bio || '');
  const [avatarColor, setAvatarColor] = useState(user.avatarColor || 'bg-teal-600');
  const [avatarInitial, setAvatarInitial] = useState(user.avatarInitial || user.name.charAt(0).toUpperCase());

  // Skills
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>(user.achievements || []);
  const [newAchTitle, setNewAchTitle] = useState('');
  const [newAchOrg, setNewAchOrg] = useState('ĐH Kinh tế – ĐH Đà Nẵng');
  const [newAchYear, setNewAchYear] = useState('2025');
  const [newAchType, setNewAchType] = useState<'award' | 'scholarship' | 'certificate'>('award');
  const [showAddAch, setShowAddAch] = useState(false);

  // Portfolio items
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(user.portfolioItems || []);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortCategory, setNewPortCategory] = useState('Thiết kế Slide');
  const [newPortDesc, setNewPortDesc] = useState('');
  const [newPortUrl, setNewPortUrl] = useState('');
  const [newPortDate, setNewPortDate] = useState('Tháng 10/2026');
  const [showAddPort, setShowAddPort] = useState(false);

  // Tabs inside modal
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'achievements' | 'portfolio'>(initialTab);

  // Handle skill addition
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Handle achievement addition
  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchTitle.trim()) return;

    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      title: newAchTitle.trim(),
      organization: newAchOrg.trim(),
      year: newAchYear.trim(),
      type: newAchType,
    };

    setAchievements([...achievements, newAch]);
    setNewAchTitle('');
    setShowAddAch(false);
  };

  const handleRemoveAchievement = (id: string) => {
    setAchievements(achievements.filter((a) => a.id !== id));
  };

  // Handle portfolio item addition
  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortTitle.trim()) return;

    const newPort: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newPortTitle.trim(),
      category: newPortCategory,
      description: newPortDesc.trim(),
      linkUrl: newPortUrl.trim() || 'https://drive.google.com/sample',
      date: newPortDate.trim(),
    };

    setPortfolioItems([...portfolioItems, newPort]);
    setNewPortTitle('');
    setNewPortDesc('');
    setNewPortUrl('');
    setShowAddPort(false);
  };

  const handleRemovePortfolioItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter((p) => p.id !== id));
  };

  // Submit all edits
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = mockStore.updateUser(user.id, {
      name: name.trim(),
      studentClass: studentClass.trim(),
      major: major.trim(),
      bio: bio.trim(),
      avatarColor,
      avatarInitial: avatarInitial.trim() || name.charAt(0).toUpperCase(),
      skills,
      achievements,
      portfolioItems,
    });

    if (updated) {
      showToast('Đã lưu các thay đổi hồ sơ năng lực thành công!', 'success');
      onSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Chỉnh sửa Hồ sơ Năng lực (Portfolio)</h3>
              <p className="text-[11px] text-slate-500">Cập nhật thông tin định danh, kỹ năng, NCKH & sản phẩm mẫu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 border-b border-slate-200/80 my-3 shrink-0 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-2 rounded-xl transition ${
              activeTab === 'basic'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            1. Định danh & Avatar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-2 rounded-xl transition ${
              activeTab === 'skills'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            2. Kỹ năng ({skills.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('achievements')}
            className={`px-3 py-2 rounded-xl transition ${
              activeTab === 'achievements'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            3. NCKH & Thành tích ({achievements.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-2 rounded-xl transition ${
              activeTab === 'portfolio'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            4. Minh chứng mẫu ({portfolioItems.length})
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="overflow-y-auto pr-1 flex-1 space-y-4 my-2 text-xs">
          
          {/* TAB 1: BASIC INFO & AVATAR */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* Avatar customize */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl ${avatarColor} text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0`}>
                  {avatarInitial || 'U'}
                </div>

                <div className="space-y-2 text-left flex-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Chọn màu đại diện Avatar:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setAvatarColor(c)}
                          className={`w-6 h-6 rounded-full ${c} ring-2 transition ${
                            avatarColor === c ? 'ring-slate-900 ring-offset-2' : 'ring-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <label className="text-[11px] font-semibold text-slate-700">Ký tự viết tắt:</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={avatarInitial}
                      onChange={(e) => setAvatarInitial(e.target.value.toUpperCase())}
                      className="w-12 text-center p-1 rounded-lg border border-slate-200 text-xs font-bold uppercase focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Họ và tên:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Lớp sinh hoạt tại DUE:</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="Ví dụ: 50K32.3"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Khoa / Viện / Chuyên ngành:</label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  placeholder="Ví dụ: Khoa Kinh doanh Quốc tế — ĐH Kinh tế (DUE)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Giới thiệu bản thân (Bio):</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Chia sẻ ngắn về định hướng phát triển, kinh nghiệm và phong cách làm việc..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Kỹ năng hiện tại trên Portfolio của bạn:
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 min-h-[50px]">
                  {skills.length > 0 ? (
                    skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-teal-200 text-teal-800 text-xs font-semibold shadow-2xs"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs italic">Chưa có kỹ năng nào. Hãy thêm ở bên dưới.</span>
                  )}
                </div>
              </div>

              {/* Add custom skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="Nhập kỹ năng mới (ví dụ: Google Analytics, Figma...)"
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(newSkillInput);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(newSkillInput)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
                >
                  Thêm
                </button>
              </div>

              {/* Suggestions */}
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">Gợi ý kỹ năng phổ biến tại DUE:</span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_SKILLS.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => handleAddSkill(sk)}
                      disabled={skills.includes(sk)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition ${
                        skills.includes(sk)
                          ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-teal-500 text-slate-700 hover:text-teal-700'
                      }`}
                    >
                      + {sk}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACHIEVEMENTS (NCKH, Học bổng, Chứng chỉ) */}
          {activeTab === 'achievements' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Danh sách thành tích học thuật & giải thưởng ({achievements.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddAch(!showAddAch)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddAch ? 'Đóng form' : 'Thêm thành tích mới'}
                </button>
              </div>

              {/* Add form */}
              {showAddAch && (
                <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Tên thành tựu / Giải thưởng:</label>
                      <input
                        type="text"
                        value={newAchTitle}
                        onChange={(e) => setNewAchTitle(e.target.value)}
                        placeholder="Ví dụ: Giải Nhì Sinh viên NCKH cấp Trường"
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Đơn vị trao tặng / Tổ chức:</label>
                      <input
                        type="text"
                        value={newAchOrg}
                        onChange={(e) => setNewAchOrg(e.target.value)}
                        placeholder="Ví dụ: Đại học Kinh tế – ĐH Đà Nẵng"
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Năm / Thời gian:</label>
                      <input
                        type="text"
                        value={newAchYear}
                        onChange={(e) => setNewAchYear(e.target.value)}
                        placeholder="2025"
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Phân loại:</label>
                      <select
                        value={newAchType}
                        onChange={(e) => setNewAchType(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="award">Giải thưởng / Nghiên cứu</option>
                        <option value="scholarship">Học bổng khuyến khích</option>
                        <option value="certificate">Chứng chỉ quốc tế (IELTS/MOS)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
                  >
                    Xác nhận thêm vào hồ sơ
                  </button>
                </div>
              )}

              {/* Existing items list */}
              <div className="space-y-2">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <Award className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900">{a.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {a.organization} • {a.year}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(a.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO ITEMS / MINH CHỨNG */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Dự án mẫu & Minh chứng thực tế ({portfolioItems.length})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddPort(!showAddPort)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 hover:text-teal-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAddPort ? 'Đóng form' : 'Thêm dự án mẫu'}
                </button>
              </div>

              {/* Add form */}
              {showAddPort && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Tiêu đề dự án mẫu:</label>
                      <input
                        type="text"
                        value={newPortTitle}
                        onChange={(e) => setNewPortTitle(e.target.value)}
                        placeholder="Ví dụ: Bộ Slide Pitch Deck Gọi vốn The Lab Cafe"
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Lĩnh vực:</label>
                      <input
                        type="text"
                        value={newPortCategory}
                        onChange={(e) => setNewPortCategory(e.target.value)}
                        placeholder="Ví dụ: Thiết kế Slide, SPSS, Video..."
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Mô tả ngắn về sản phẩm:</label>
                    <textarea
                      rows={2}
                      value={newPortDesc}
                      onChange={(e) => setNewPortDesc(e.target.value)}
                      placeholder="Nêu quy mô, công cụ sử dụng và kết quả đạt được..."
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Đường dẫn liên kết (Link xem thử):</label>
                      <input
                        type="text"
                        value={newPortUrl}
                        onChange={(e) => setNewPortUrl(e.target.value)}
                        placeholder="https://canva.com/... hoặc Drive..."
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-700 block mb-0.5">Thời gian thực hiện:</label>
                      <input
                        type="text"
                        value={newPortDate}
                        onChange={(e) => setNewPortDate(e.target.value)}
                        placeholder="Tháng 10/2026"
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddPortfolioItem}
                    className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
                  >
                    Xác nhận thêm dự án vào Portfolio
                  </button>
                </div>
              )}

              {/* Existing items list */}
              <div className="space-y-2">
                {portfolioItems.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-teal-50 text-teal-700 border border-teal-100">
                          {p.category}
                        </span>
                        <p className="font-semibold text-slate-900">{p.title}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePortfolioItem(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Deck */}
          <div className="pt-4 border-t border-slate-100 flex gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu hồ sơ năng lực</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
