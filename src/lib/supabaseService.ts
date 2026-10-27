import { supabase, isSupabaseConfigured } from './supabase';
import { User, Listing } from '../types';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const supabaseService = {
  isAvailable(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  async signUp(params: {
    email: string;
    password: string;
    name: string;
    role: 'due' | 'guest';
    studentClass?: string;
    skills?: string[];
  }): Promise<AuthResult> {
    if (!supabase) return { success: false, error: 'Chưa cấu hình Supabase' };

    const isDue = params.role === 'due' || params.email.toLowerCase().endsWith('@due.edu.vn');
    const major = isDue
      ? (params.studentClass ? `Sinh viên Lớp ${params.studentClass} — ĐH Kinh tế (DUE)` : 'Sinh viên ĐH Kinh tế (DUE)')
      : 'Khách hàng ngoài trường';

    const { data, error } = await supabase.auth.signUp({
      email: params.email.trim(),
      password: params.password,
      options: {
        data: {
          name: params.name.trim(),
          major,
          studentClass: params.studentClass || '',
          isDue,
          skills: params.skills || [],
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Không thể tạo tài khoản, vui lòng thử lại.' };
    }

    // Lấy thông tin profile vừa được trigger tạo
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const initial = params.name.trim().charAt(0).toUpperCase() || 'U';

    const user: User = {
      id: data.user.id,
      name: profile?.display_name || params.name.trim(),
      email: data.user.email || params.email,
      avatarInitial: initial,
      avatarColor: isDue ? 'bg-teal-600' : 'bg-indigo-600',
      avatarUrl: profile?.avatar_url || undefined,
      role: isDue ? 'due' : 'member',
      isDueVerified: isDue,
      isLocked: false,
      major: profile?.major || major,
      studentClass: params.studentClass,
      skills: profile?.skills && profile.skills.length > 0 ? profile.skills : (params.skills || []),
      portfolioUrls: profile?.portfolio_urls || [],
      completedProjectsCount: 0,
      averageRating: 5.0,
      reviewsCount: 0,
      createdAt: data.user.created_at || new Date().toISOString(),
    };

    return { success: true, user };
  },

  async signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) return { success: false, error: 'Chưa cấu hình Supabase' };

    const cleanEmail = email.trim().toLowerCase();
    let authPassword = password;

    // Hỗ trợ linh hoạt các biến thể mật khẩu admin khi trình diễn
    if (cleanEmail === 'admin@unisty.due.edu.vn') {
      if (password === 'Admin@123456' || password === 'admin123' || password === 'Admin123' || password === 'admin') {
        authPassword = 'admin123456';
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: authPassword,
    });

    if (error) {
      let msg = error.message;
      if (msg.includes('Invalid login credentials')) {
        msg = 'Email hoặc mật khẩu không chính xác.';
      } else if (msg.includes('Email not confirmed')) {
        msg = 'Email chưa được xác nhận trong Supabase.';
      }
      return { success: false, error: msg };
    }

    if (!data.user) {
      return { success: false, error: 'Không tìm thấy thông tin đăng nhập.' };
    }

    // Lấy profile từ Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // Lấy quyền từ account_controls
    const { data: control } = await supabase
      .from('account_controls')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    const isDue = (data.user.email || '').toLowerCase().endsWith('@due.edu.vn');
    const displayName = profile?.display_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    const user: User = {
      id: data.user.id,
      name: displayName,
      email: data.user.email || '',
      avatarInitial: initial,
      avatarColor: isDue ? 'bg-teal-600' : 'bg-indigo-600',
      avatarUrl: profile?.avatar_url || undefined,
      role: (control?.role === 'admin' || data.user.email === 'admin@unisty.due.edu.vn') ? 'admin' : (isDue ? 'due' : 'member'),
      isDueVerified: isDue,
      isLocked: control?.is_locked || false,
      major: profile?.major || (isDue ? 'Sinh viên ĐH Kinh tế (DUE)' : 'Thành viên'),
      skills: profile?.skills || [],
      portfolioUrls: profile?.portfolio_urls || [],
      completedProjectsCount: 0,
      averageRating: 5.0,
      reviewsCount: 0,
      createdAt: data.user.created_at || new Date().toISOString(),
    };

    return { success: true, user };
  },

  async signOut(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut();
    }
  },

  async getSessionUser(): Promise<User | null> {
    if (!supabase) return null;
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const { data: control } = await supabase
      .from('account_controls')
      .select('*')
      .eq('user_id', data.user.id)
      .single();

    const isDue = (data.user.email || '').toLowerCase().endsWith('@due.edu.vn');
    const displayName = profile?.display_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
    const initial = displayName.charAt(0).toUpperCase();

    return {
      id: data.user.id,
      name: displayName,
      email: data.user.email || '',
      avatarInitial: initial,
      avatarColor: isDue ? 'bg-teal-600' : 'bg-indigo-600',
      avatarUrl: profile?.avatar_url || undefined,
      role: (control?.role === 'admin' || data.user.email === 'admin@unisty.due.edu.vn') ? 'admin' : (isDue ? 'due' : 'member'),
      isDueVerified: isDue,
      isLocked: control?.is_locked || false,
      major: profile?.major || (isDue ? 'Sinh viên ĐH Kinh tế (DUE)' : 'Thành viên'),
      skills: profile?.skills || [],
      portfolioUrls: profile?.portfolio_urls || [],
      completedProjectsCount: 0,
      averageRating: 5.0,
      reviewsCount: 0,
      createdAt: data.user.created_at || new Date().toISOString(),
    };
  },

  async fetchListings(): Promise<Listing[]> {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      ownerId: row.owner_id,
      ownerName: row.owner_name_snapshot,
      ownerAvatar: row.owner_avatar_initial,
      ownerAvatarColor: row.owner_avatar_color || 'bg-teal-600',
      ownerAvatarUrl: row.owner_avatar_url || undefined,
      isOwnerDue: row.is_owner_due,
      kind: row.kind,
      category: row.category,
      title: row.title,
      description: row.description,
      price: Number(row.price),
      deliveryDays: row.delivery_days || undefined,
      applicationDeadline: row.application_deadline || undefined,
      dueAt: row.due_at || undefined,
      status: row.status,
      isHidden: row.is_hidden,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  async createListing(listing: Listing): Promise<boolean> {
    if (!supabase) return false;
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return false;

    const { error } = await supabase.from('listings').insert({
      owner_id: authData.user.id,
      owner_name_snapshot: listing.ownerName,
      owner_avatar_initial: listing.ownerAvatar,
      owner_avatar_color: listing.ownerAvatarColor,
      owner_avatar_url: listing.ownerAvatarUrl || null,
      is_owner_due: listing.isOwnerDue,
      kind: listing.kind,
      category: listing.category,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      delivery_days: listing.deliveryDays || null,
      due_at: listing.dueAt || null,
      status: 'open',
      is_hidden: false,
    });

    if (error) {
      console.error('Error creating listing in Supabase:', error);
      return false;
    }
    return true;
  },

  async updateProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    if (!supabase) return false;
    const updateObj: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name) updateObj.display_name = updates.name;
    if (updates.major) updateObj.major = updates.major;
    if (updates.bio) updateObj.bio = updates.bio;
    if (updates.skills) updateObj.skills = updates.skills;
    if (updates.portfolioUrls) updateObj.portfolio_urls = updates.portfolioUrls;
    if (updates.avatarUrl !== undefined) updateObj.avatar_url = updates.avatarUrl;
    if (updates.avatarColor) updateObj.avatar_color = updates.avatarColor;

    const { error } = await supabase
      .from('profiles')
      .update(updateObj)
      .eq('id', userId);

    return !error;
  },
};
