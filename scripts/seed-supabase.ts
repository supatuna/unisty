import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://doippfnviszrasfxieep.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvaXBwZm52aXN6cmFzZnhpZWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0ODIwODgsImV4cCI6MjEwODA1ODA4OH0.jqTvRWllDMqIBfIiPCGcpxlYAYlh9X8lsodUO_JxcPs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface SeedUser {
  email: string;
  pass: string;
  name: string;
  role: 'due' | 'guest';
  studentClass?: string;
  major: string;
  bio: string;
  skills: string[];
  avatarColor: string;
}

const SEED_USERS: SeedUser[] = [
  {
    email: 'admin@unisty.due.edu.vn',
    pass: 'Admin@123456',
    name: 'Ban Quản trị UNISTY (DUE)',
    role: 'guest',
    major: 'Hệ thống Quản trị & Giám sát Sàn Giao dịch',
    bio: 'Tài khoản điều hành tối cao của sàn UNISTY. Kiểm toán giao dịch ký quỹ Escrow, trọng tài phân xử tranh chấp và kiểm duyệt tin đăng sinh viên.',
    skills: ['Quản trị hệ thống', 'Kiểm toán Escrow', 'Trọng tài tranh chấp'],
    avatarColor: 'bg-slate-900',
  },
  {
    email: '221121514101@due.edu.vn',
    pass: 'Due@123456',
    name: 'Thảo Nguyễn',
    role: 'due',
    studentClass: '50K32.3',
    major: 'Khoa Kinh doanh Quốc tế — ĐH Kinh tế (DUE)',
    bio: 'Sinh viên năm 3 khoa Kinh doanh Quốc tế. Đạt giải Nhì NCKH cấp Trường 2025. Chuyên thiết kế slide học thuật, pitch deck gọi vốn và ấn phẩm truyền thông nhận diện thương hiệu.',
    skills: ['Thiết kế Canva', 'PowerPoint chuyên sâu', 'Pitch Deck', 'IELTS 7.5', 'Nhận diện thương hiệu'],
    avatarColor: 'bg-teal-600',
  },
  {
    email: '221121514102@due.edu.vn',
    pass: 'Due@123456',
    name: 'Nam Trần',
    role: 'due',
    studentClass: '49K12.1',
    major: 'Khoa Thống kê - Tin học — ĐH Kinh tế (DUE)',
    bio: 'Sinh viên năm 4 khoa Thống kê - Tin học. Có kinh nghiệm hỗ trợ hơn 30 đề tài luận văn tốt nghiệp và nghiên cứu khoa học xử lý dữ liệu định lượng bằng SPSS và SmartPLS.',
    skills: ['Xử lý số liệu', 'SPSS', 'Cronbach Alpha', 'Hồi quy EFA/CFA', 'Excel Dashboard'],
    avatarColor: 'bg-indigo-600',
  },
  {
    email: '221121514103@due.edu.vn',
    pass: 'Due@123456',
    name: 'Hà Linh',
    role: 'due',
    studentClass: '50K32.3',
    major: 'Khoa Marketing — ĐH Kinh tế (DUE)',
    bio: 'Sinh viên năm 3 khoa Marketing. Sở hữu kênh TikTok sinh viên hơn 40k followers. Chuyên biên tập video ngắn bắt trend, lồng tiếng Voice AI và viết kịch bản quảng bá ẩm thực/du lịch.',
    skills: ['Dựng CapCut', 'Video TikTok/Reels', 'Voice AI', 'Phụ đề động', 'Content Marketing'],
    avatarColor: 'bg-rose-600',
  },
  {
    email: '221121514104@due.edu.vn',
    pass: 'Due@123456',
    name: 'Quốc Bảo',
    role: 'due',
    studentClass: '50K32.3',
    major: 'Khoa Thương mại điện tử — ĐH Kinh tế (DUE)',
    bio: 'Chứng chỉ IELTS Academic 7.5. Từng đạt giải Khuyến khích Olympic Tiếng Anh sinh viên toàn quốc. Nhận dịch thuật tài liệu kinh tế, tóm tắt bài báo quốc tế (Scopus/ISI) và viết bài chuẩn SEO.',
    skills: ['Dịch thuật Anh - Việt', 'IELTS 7.5', 'Viết bài SEO', 'Tóm tắt bài báo NCKH'],
    avatarColor: 'bg-cyan-600',
  },
  {
    email: 'tuan.cafe@gmail.com',
    pass: 'Client@123456',
    name: 'Anh Tuấn (The Lab Cafe)',
    role: 'guest',
    major: 'Chủ chuỗi The Lab Cafe Đà Nẵng',
    bio: 'Quản lý vận hành chuỗi The Lab Cafe tại khu vực Ngũ Hành Sơn & Hải Châu. Thường xuyên đồng hành và tuyển dụng các bạn sinh viên DUE thực chiến trong các chiến dịch ra mắt đồ uống mới.',
    skills: ['Quản lý F&B', 'Khách hàng tuyển dụng'],
    avatarColor: 'bg-amber-600',
  },
  {
    email: 'mai.homestay@gmail.com',
    pass: 'Client@123456',
    name: 'Chị Mai (An Nhiên Homestay)',
    role: 'guest',
    major: 'Founder An Nhiên Retreat & Homestay Hội An',
    bio: 'Chủ cơ sở lưu trú du lịch An Nhiên Homestay tại Cẩm Châu, Hội An. Mong muốn kết nối và trao cơ hội làm việc freelance cho các bạn trẻ tài năng Đà Nẵng - Quảng Nam.',
    skills: ['Du lịch & Khách sạn', 'Khách hàng tuyển dụng'],
    avatarColor: 'bg-emerald-600',
  },
];

async function seed() {
  console.log('🚀 Bắt đầu tạo tài khoản thực tế trên Supabase...');
  const userMap: Record<string, string> = {}; // email -> id

  for (const u of SEED_USERS) {
    // 1. Thử login nếu đã có
    let userId = '';
    const { data: loginData } = await supabase.auth.signInWithPassword({
      email: u.email,
      password: u.pass,
    });

    if (loginData?.user) {
      userId = loginData.user.id;
      console.log(`✓ Đã đăng nhập tài khoản: ${u.email} (${userId})`);
    } else {
      // 2. Chưa có thì signUp
      const isDue = u.role === 'due';
      const { data: signUpData, error: signErr } = await supabase.auth.signUp({
        email: u.email,
        password: u.pass,
        options: {
          data: {
            name: u.name,
            major: u.major,
            studentClass: u.studentClass || '',
            isDue,
            skills: u.skills,
          }
        }
      });

      if (signErr) {
        console.error(`✗ Lỗi đăng ký ${u.email}:`, signErr.message);
        continue;
      }
      userId = signUpData.user!.id;
      console.log(`✓ Tạo mới thành công: ${u.email} (${userId})`);
    }

    userMap[u.email] = userId;

    // 3. Cập nhật Profile chi tiết trong bảng public.profiles
    const { error: profErr } = await supabase
      .from('profiles')
      .update({
        display_name: u.name,
        major: u.major,
        bio: u.bio,
        skills: u.skills,
        avatar_color: u.avatarColor,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (profErr) {
      console.warn(`Lưu profile ${u.email} cảnh báo:`, profErr.message);
    }
  }

  console.log('\n🚀 Bắt đầu đăng bài thực tế từ các tài khoản lên Supabase...');

  // Danh sách bài đăng thực tế
  const LISTINGS_DATA = [
    {
      ownerEmail: '221121514101@due.edu.vn',
      ownerName: 'Thảo Nguyễn',
      ownerAvatar: 'T',
      ownerAvatarColor: 'bg-teal-600',
      isDue: true,
      kind: 'service' as const,
      category: 'design' as const,
      title: 'Thiết kế Slide Canva & PowerPoint chuyên nghiệp bảo vệ NCKH / Khóa luận tốt nghiệp',
      description: 'Nhận thiết kế trọn gói slide thuyết trình chuẩn nhận diện học thuật. Chuyển đổi bảng biểu thô và số liệu phức tạp thành infograph trực quan, ấn tượng. Hỗ trợ chỉnh sửa không giới hạn đến ngày bảo vệ chính thức của hội đồng.',
      price: 150000,
      deliveryDays: 2,
    },
    {
      ownerEmail: '221121514101@due.edu.vn',
      ownerName: 'Thảo Nguyễn',
      ownerAvatar: 'T',
      ownerAvatarColor: 'bg-teal-600',
      isDue: true,
      kind: 'service' as const,
      category: 'design' as const,
      title: 'Thiết kế trọn bộ nhận diện Menu, Standee & Poster sự kiện cho quán F&B',
      description: 'Thiết kế bộ nhận diện thương hiệu cho quán cafe, trà sữa: Menu để bàn, standee đứng chào khách, voucher khuyến mãi khai trương. Giao file in ấn độ phân giải cao và link Canva gốc.',
      price: 250000,
      deliveryDays: 3,
    },
    {
      ownerEmail: '221121514102@due.edu.vn',
      ownerName: 'Nam Trần',
      ownerAvatar: 'N',
      ownerAvatarColor: 'bg-indigo-600',
      isDue: true,
      kind: 'service' as const,
      category: 'office' as const,
      title: 'Làm sạch số liệu Google Forms, chạy kiểm định SPSS, Cronbach Alpha & Hồi quy EFA',
      description: 'Hỗ trợ xử lý bộ dữ liệu định lượng: mã hóa biến, loại bỏ mẫu spam, kiểm định độ tin cậy thang đo Cronbach Alpha, phân tích nhân tố khám phá EFA và chạy mô hình hồi quy đa biến. Trả kèm file output SPSS và giải thích ý nghĩa thống kê chuẩn APA.',
      price: 350000,
      deliveryDays: 2,
    },
    {
      ownerEmail: '221121514103@due.edu.vn',
      ownerName: 'Hà Linh',
      ownerAvatar: 'H',
      ownerAvatarColor: 'bg-rose-600',
      isDue: true,
      kind: 'service' as const,
      category: 'video' as const,
      title: 'Dựng video ngắn TikTok / Reels bắt trend, lồng tiếng Voice AI & phụ đề động chuyển động',
      description: 'Biên tập video dọc chuẩn khung hình 9:16 cho kênh quán cafe/thời trang. Hiệu ứng chuyển cảnh mượt mà, voice AI truyền cảm và phụ đề phong cách Alex Hormozi. Cam kết video sắc nét chuẩn Full HD.',
      price: 200000,
      deliveryDays: 1,
    },
    {
      ownerEmail: '221121514104@due.edu.vn',
      ownerName: 'Quốc Bảo',
      ownerAvatar: 'Q',
      ownerAvatarColor: 'bg-cyan-600',
      isDue: true,
      kind: 'service' as const,
      category: 'writing' as const,
      title: 'Dịch thuật tài liệu Kinh tế, bài báo NCKH quốc tế & Tóm tắt Abstract Anh - Việt chuẩn APA',
      description: 'Sinh viên có chứng chỉ IELTS Academic 7.5. Chuyên dịch thuật các tài liệu chuyên khảo kinh tế lượng, thương mại quốc tế và tóm tắt đề tài nghiên cứu đúng văn phong khoa học.',
      price: 180000,
      deliveryDays: 2,
    },
    {
      ownerEmail: 'tuan.cafe@gmail.com',
      ownerName: 'Anh Tuấn (The Lab Cafe)',
      ownerAvatar: 'A',
      ownerAvatarColor: 'bg-amber-600',
      isDue: false,
      kind: 'need' as const,
      category: 'design' as const,
      title: 'Cần bạn sinh viên hỗ trợ thiết kế Menu nước mùa đông & Standee khai trương cơ sở Ngũ Hành Sơn',
      description: 'Quán The Lab Cafe chuẩn bị khai trương thêm cơ sở mới gần trường ĐH Kinh tế. Cần 1 bạn sinh viên DUE thiết kế 1 menu chính khổ A4 và 2 standee đứng trước cửa. Quán đã có sẵn logo và ảnh chụp sản phẩm.',
      price: 400000,
      dueAt: new Date(Date.now() + 86400000 * 5).toISOString(),
    },
    {
      ownerEmail: 'mai.homestay@gmail.com',
      ownerName: 'Chị Mai (An Nhiên Homestay)',
      ownerAvatar: 'M',
      ownerAvatarColor: 'bg-emerald-600',
      isDue: false,
      kind: 'need' as const,
      category: 'video' as const,
      title: 'Cần bạn sinh viên quay dựng 2 video ngắn giới thiệu phòng trải nghiệm và không gian sân vườn homestay',
      description: 'Homestay tại Cẩm Châu - Hội An cần bạn sinh viên có gu thẩm mỹ tốt để quay và dựng 2 video ngắn (30-45s). Hỗ trợ xe đưa đón từ Đà Nẵng và chi phí ăn trưa. Video cần đăng Reels và TikTok.',
      price: 500000,
      dueAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    },
  ];

  for (const item of LISTINGS_DATA) {
    const ownerId = userMap[item.ownerEmail];
    if (!ownerId) continue;

    // Đăng nhập bằng chính tài khoản đó để thỏa mãn RLS auth.uid() = owner_id
    const userSeed = SEED_USERS.find(s => s.email === item.ownerEmail)!;
    const { data: auth } = await supabase.auth.signInWithPassword({
      email: item.ownerEmail,
      password: userSeed.pass,
    });

    if (!auth.user) {
      console.error(`Không thể login tài khoản ${item.ownerEmail} để đăng bài`);
      continue;
    }

    // Kiểm tra xem bài đăng này đã có trong Supabase chưa (dựa theo title)
    const { data: existing } = await supabase
      .from('listings')
      .select('id')
      .eq('owner_id', auth.user.id)
      .eq('title', item.title);

    if (existing && existing.length > 0) {
      console.log(`- Bài đăng đã tồn tại: "${item.title.substring(0, 40)}..."`);
      continue;
    }

    const { data: newListing, error: insertErr } = await supabase
      .from('listings')
      .insert({
        owner_id: auth.user.id,
        owner_name_snapshot: item.ownerName,
        owner_avatar_initial: item.ownerAvatar,
        owner_avatar_color: item.ownerAvatarColor,
        is_owner_due: item.isDue,
        kind: item.kind,
        category: item.category,
        title: item.title,
        description: item.description,
        price: item.price,
        delivery_days: item.deliveryDays || null,
        due_at: item.dueAt || null,
        status: 'open',
        is_hidden: false,
      })
      .select()
      .single();

    if (insertErr) {
      console.error(`✗ Lỗi đăng bài "${item.title.substring(0, 30)}":`, insertErr.message);
    } else {
      console.log(`✓ Đã đăng bài lên Supabase: "${item.title.substring(0, 40)}..." (ID: ${newListing.id})`);
    }
  }

  // Đăng xuất sau khi hoàn tất
  await supabase.auth.signOut();
  console.log('\n🎉 Hoàn thành khởi tạo dữ liệu thực tế 100% trên Supabase!');
}

seed();
