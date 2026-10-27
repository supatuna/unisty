import { User, Listing, Contract, Review, Message, Wallet, LedgerEntry, Delivery, RevisionRequest, Dispute, Proposal } from '../types';
import { INITIAL_USERS, INITIAL_LISTINGS, INITIAL_CONTRACTS, INITIAL_REVIEWS, INITIAL_DISPUTES } from './mockFixtures';
import { supabaseService } from '../lib/supabaseService';

const STORAGE_KEY = 'unisty.cloud.v3';

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-real-101',
    listingId: '77bfc63d-cbfe-4628-af81-baf38ae703ad', // Cần thiết kế Standee & Menu quán cafe (Anh Tuấn)
    senderId: '24aecbcb-76d1-4cec-87d0-3424ff6ad797',
    senderName: 'Thảo Nguyễn',
    senderAvatar: 'T',
    senderAvatarColor: 'bg-teal-600',
    isSenderDue: true,
    scope: 'Chào anh Tuấn, em đã từng thiết kế menu và standee cho 2 quán cafe tại Ngũ Hành Sơn. Em có thể hoàn thành cả 2 ấn phẩm trong 2 ngày với đầy đủ file in ấn và link Canva gốc ạ.',
    price: 350000,
    dueAt: '2026-10-24T17:00:00Z',
    status: 'pending',
    createdAt: '2026-10-19T09:00:00Z',
  },
  {
    id: 'prop-real-102',
    listingId: '77bfc63d-cbfe-4628-af81-baf38ae703ad',
    senderId: '183f5737-6165-4651-852f-91e7ca620c40',
    senderName: 'Hà Linh',
    senderAvatar: 'H',
    senderAvatarColor: 'bg-rose-600',
    isSenderDue: true,
    scope: 'Em chào anh! Em chuyên thiết kế ấn phẩm đồ họa phong cách ấm cúng cho mùa đông. Em sẵn sàng gửi trước 2 bản demo màu cho quán duyệt trước ạ.',
    price: 400000,
    dueAt: '2026-10-25T12:00:00Z',
    status: 'pending',
    createdAt: '2026-10-19T10:15:00Z',
  }
];

interface StorageData {
  users: User[];
  listings: Listing[];
  proposals: Proposal[];
  contracts: Contract[];
  reviews: Review[];
  messages: Message[];
  deliveries: Delivery[];
  revisions: RevisionRequest[];
  disputes: Dispute[];
  wallets: Record<string, Wallet>;
  ledger: LedgerEntry[];
  currentUserId: string;
}

function loadInitialData(): StorageData {
  const wallets: Record<string, Wallet> = {};
  INITIAL_USERS.forEach(u => {
    wallets[u.id] = {
      userId: u.id,
      available: 1000000,
      held: 0,
      granted: true,
    };
  });

  const anhTuanId = 'cacc43af-a897-43d6-9d5e-c6b2d4a1c793';
  const thaoNguyenId = '24aecbcb-76d1-4cec-87d0-3424ff6ad797';
  const chiMaiId = 'cc980545-1fc7-4825-a577-81156bc454b0';

  if (wallets[anhTuanId]) {
    wallets[anhTuanId].available = 1000000 - 250000;
  }
  if (wallets[thaoNguyenId]) {
    wallets[thaoNguyenId].available = 1000000 + 250000;
  }
  if (wallets[chiMaiId]) {
    wallets[chiMaiId].held = 500000;
    wallets[chiMaiId].available = 1000000 - 500000;
  }

  const deliveries: Delivery[] = [
    {
      id: 'del-real-1',
      contractId: 'con-real-101',
      providerId: '24aecbcb-76d1-4cec-87d0-3424ff6ad797',
      urls: ['https://drive.google.com/sample-menu-thelab', 'https://canva.com/design/demo-standee'],
      notes: 'Dạ em gửi anh Tuấn bộ file in ấn menu và standee cơ sở Ngũ Hành Sơn ạ!',
      createdAt: '2026-10-20T09:30:00Z',
    }
  ];

  const messages: Message[] = [
    {
      id: 'msg-real-1',
      threadId: 'con-real-101',
      senderId: 'cacc43af-a897-43d6-9d5e-c6b2d4a1c793',
      senderName: 'Anh Tuấn (The Lab Cafe)',
      senderAvatar: 'A',
      senderAvatarColor: 'bg-amber-600',
      content: 'Chào Thảo, anh đã thanh toán ký quỹ cho dự án rồi nhé. Em cố gắng gửi bản nháp sớm giúp anh nhé.',
      createdAt: '2026-10-18T10:20:00Z',
    },
    {
      id: 'msg-real-2',
      threadId: 'con-real-101',
      senderId: '24aecbcb-76d1-4cec-87d0-3424ff6ad797',
      senderName: 'Thảo Nguyễn',
      senderAvatar: 'T',
      senderAvatarColor: 'bg-teal-600',
      content: 'Dạ em chào anh Tuấn, em đã nhận được thông báo ạ. Dự kiến tối mai em sẽ gửi bản demo trước nhé!',
      createdAt: '2026-10-18T10:35:00Z',
    }
  ];

  return {
    users: INITIAL_USERS,
    listings: INITIAL_LISTINGS,
    proposals: INITIAL_PROPOSALS,
    contracts: INITIAL_CONTRACTS,
    reviews: INITIAL_REVIEWS,
    messages,
    deliveries,
    revisions: [],
    disputes: INITIAL_DISPUTES,
    wallets,
    ledger: [],
    currentUserId: '', // Mặc định không đăng nhập khi mới truy cập web
  };
}

class MockStore {
  private data: StorageData;

  constructor() {
    this.data = this.read();
    this.initSupabaseSync();
  }

  private async initSupabaseSync() {
    if (!supabaseService.isAvailable()) return;
    try {
      // 1. Kiểm tra session đăng nhập thật từ Supabase
      const sessionUser = await supabaseService.getSessionUser();
      if (sessionUser) {
        const users = this.data.users;
        const idx = users.findIndex(u => u.id === sessionUser.id);
        if (idx !== -1) {
          users[idx] = sessionUser;
        } else {
          users.unshift(sessionUser);
        }
        this.data.currentUserId = sessionUser.id;
        this.write(this.data);
      }

      // 2. Tải bài đăng thật từ Supabase Cloud
      const cloudListings = await supabaseService.fetchListings();
      if (cloudListings && cloudListings.length > 0) {
        this.data.listings = cloudListings;
        this.write(this.data);
      }
    } catch (e) {
      console.warn('Lỗi đồng bộ Supabase:', e);
    }
  }

  private read(): StorageData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.proposals && parsed.users) {
          const initial = loadInitialData();
          let currentUserId = parsed.currentUserId || '';
          // Nếu tài khoản đang lưu là mặc định cũ Thảo Nguyễn mà chưa từng đăng nhập chủ động thì reset thành khách
          if (currentUserId === 'user-due-thao' && !localStorage.getItem('unisty.auth.manual_login')) {
            currentUserId = '';
          }
          return {
            ...initial,
            ...parsed,
            currentUserId,
            contracts: parsed.contracts && parsed.contracts.length >= initial.contracts.length ? parsed.contracts : initial.contracts,
            disputes: parsed.disputes && parsed.disputes.length > 0 ? parsed.disputes : initial.disputes,
          };
        }
      }
    } catch {
      // Fallback
    }
    const initial = loadInitialData();
    this.write(initial);
    return initial;
  }

  private write(data: StorageData) {
    this.data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  public resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('unisty.auth.manual_login');
    this.data = loadInitialData();
    this.write(this.data);
  }

  public getCurrentUser(): User {
    if (this.data.currentUserId) {
      const user = this.data.users.find(u => u.id === this.data.currentUserId);
      if (user) return user;
    }
    return {
      id: '',
      name: 'Khách vãng lai',
      email: '',
      avatarInitial: '?',
      avatarColor: 'bg-slate-400',
      role: 'guest',
      isDueVerified: false,
      isLocked: false,
      skills: [],
      portfolioUrls: [],
      completedProjectsCount: 0,
      averageRating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
    };
  }

  public isLoggedIn(): boolean {
    return Boolean(this.data.currentUserId && this.data.users.some(u => u.id === this.data.currentUserId));
  }

  public logout() {
    this.data.currentUserId = '';
    localStorage.removeItem('unisty.auth.manual_login');
    this.write(this.data);
    if (supabaseService.isAvailable()) {
      supabaseService.signOut().catch(() => {});
    }
  }

  public setCurrentUserId(userId: string) {
    this.data.currentUserId = userId;
    if (userId) {
      localStorage.setItem('unisty.auth.manual_login', 'true');
    } else {
      localStorage.removeItem('unisty.auth.manual_login');
    }
    this.write(this.data);
  }

  public getAllUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public updateUser(userId: string, updates: Partial<User>): User | undefined {
    const userIndex = this.data.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return undefined;

    this.data.users[userIndex] = {
      ...this.data.users[userIndex],
      ...updates,
    };

    // Đồng bộ thông tin tên và avatar vào các tin đăng của người dùng
    if (updates.name || updates.avatarInitial || updates.avatarColor || updates.avatarUrl !== undefined) {
      const updatedUser = this.data.users[userIndex];
      this.data.listings = this.data.listings.map(l => {
        if (l.ownerId === userId) {
          return {
            ...l,
            ownerName: updatedUser.name,
            ownerAvatar: updatedUser.avatarInitial,
            ownerAvatarColor: updatedUser.avatarColor,
            ownerAvatarUrl: updatedUser.avatarUrl,
          };
        }
        return l;
      });
    }

    this.write(this.data);

    // Đồng bộ cập nhật hồ sơ lên Supabase Cloud
    if (supabaseService.isAvailable()) {
      supabaseService.updateProfile(userId, updates).catch(() => {});
    }

    return this.data.users[userIndex];
  }

  public getListings(): Listing[] {
    return this.data.listings.filter(l => !l.isHidden);
  }

  public getAllListingsAdmin(): Listing[] {
    return this.data.listings;
  }

  public toggleHideListing(listingId: string): boolean {
    const listing = this.data.listings.find(l => l.id === listingId);
    if (!listing) return false;
    listing.isHidden = !listing.isHidden;
    this.write(this.data);
    return listing.isHidden;
  }

  public toggleLockUser(userId: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    user.isLocked = !user.isLocked;
    this.write(this.data);
    return user.isLocked;
  }

  public toggleAdminRole(userId: string): boolean {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) return false;
    user.role = user.role === 'admin' ? (user.isDueVerified ? 'due' : 'member') : 'admin';
    this.write(this.data);
    return user.role === 'admin';
  }

  public adminAdjustWallet(userId: string, newAvailable: number, newHeld?: number): { success: boolean; message: string } {
    const wallet = this.getWallet(userId);
    wallet.available = Math.max(0, newAvailable);
    if (newHeld !== undefined) {
      wallet.held = Math.max(0, newHeld);
    }
    this.write(this.data);

    // Đồng bộ lên Supabase mock_wallets nếu có kết nối
    if (supabaseService.isAvailable()) {
      import('../lib/supabase').then(({ supabase }) => {
        if (supabase) {
          supabase.from('mock_wallets').upsert({
            user_id: userId,
            available: wallet.available,
            held: wallet.held,
            updated_at: new Date().toISOString()
          }).then();
        }
      });
    }

    return { success: true, message: `Đã cập nhật số dư ví thành công: ${wallet.available.toLocaleString('vi-VN')}đ` };
  }

  public topUpWallet(userId: string, amount: number, method: string = 'vietqr'): { success: boolean; message: string; newBalance: number } {
    if (amount <= 0) {
      return { success: false, message: 'Số tiền nạp phải lớn hơn 0đ.', newBalance: 0 };
    }
    const wallet = this.getWallet(userId);
    wallet.available += amount;

    const entry: LedgerEntry = {
      id: `led-${Date.now()}`,
      walletId: userId,
      action: 'top_up',
      delta: amount,
      reference: `NAP-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    if (!this.data.ledger) this.data.ledger = [];
    this.data.ledger.unshift(entry);

    this.write(this.data);

    if (supabaseService.isAvailable()) {
      import('../lib/supabase').then(({ supabase }) => {
        if (supabase) {
          supabase.from('mock_wallets').upsert({
            user_id: userId,
            available: wallet.available,
            held: wallet.held,
            updated_at: new Date().toISOString()
          }).then();
        }
      });
    }

    return { 
      success: true, 
      message: `Nạp thành công +${amount.toLocaleString('vi-VN')}đ vào ví!`, 
      newBalance: wallet.available 
    };
  }

  public withdrawWallet(
    userId: string, 
    amount: number, 
    bankInfo: { bankName: string; accountNumber: string; accountHolder: string }
  ): { success: boolean; message: string; newBalance: number } {
    const wallet = this.getWallet(userId);
    if (amount <= 0) {
      return { success: false, message: 'Số tiền rút phải lớn hơn 0đ.', newBalance: wallet.available };
    }
    if (wallet.available < amount) {
      return { 
        success: false, 
        message: `Số dư khả dụng (${wallet.available.toLocaleString('vi-VN')}đ) không đủ để rút ${amount.toLocaleString('vi-VN')}đ.`, 
        newBalance: wallet.available 
      };
    }

    wallet.available -= amount;

    const entry: LedgerEntry = {
      id: `led-${Date.now()}`,
      walletId: userId,
      action: 'withdraw',
      delta: -amount,
      reference: `RUT-${bankInfo.bankName.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
    };
    if (!this.data.ledger) this.data.ledger = [];
    this.data.ledger.unshift(entry);

    this.write(this.data);

    if (supabaseService.isAvailable()) {
      import('../lib/supabase').then(({ supabase }) => {
        if (supabase) {
          supabase.from('mock_wallets').upsert({
            user_id: userId,
            available: wallet.available,
            held: wallet.held,
            updated_at: new Date().toISOString()
          }).then();
        }
      });
    }

    return { 
      success: true, 
      message: `Tạo lệnh rút ${amount.toLocaleString('vi-VN')}đ về STK ${bankInfo.accountNumber} (${bankInfo.bankName}) thành công!`, 
      newBalance: wallet.available 
    };
  }

  public getLedgerForUser(userId: string): LedgerEntry[] {
    if (!this.data.ledger) return [];
    return this.data.ledger.filter(l => l.walletId === userId);
  }

  public deleteListing(listingId: string): boolean {
    const idx = this.data.listings.findIndex(l => l.id === listingId);
    if (idx === -1) return false;
    this.data.listings.splice(idx, 1);
    this.write(this.data);

    if (supabaseService.isAvailable()) {
      import('../lib/supabase').then(({ supabase }) => {
        if (supabase) {
          supabase.from('listings').delete().eq('id', listingId).then();
        }
      });
    }
    return true;
  }

  public getListingById(id: string): Listing | undefined {
    return this.data.listings.find(l => l.id === id);
  }

  public createListing(listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'isHidden' | 'status'>): Listing {
    const newListing: Listing = {
      ...listingData,
      id: `list-${Date.now()}`,
      status: 'open',
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.listings.unshift(newListing);
    this.write(this.data);

    // Đồng bộ lưu bài đăng lên Supabase Cloud
    if (supabaseService.isAvailable()) {
      supabaseService.createListing(newListing).catch(err => {
        console.warn('Lỗi lưu bài đăng lên Supabase:', err);
      });
    }

    return newListing;
  }

  // Proposals
  public getProposalsForListing(listingId: string): Proposal[] {
    return (this.data.proposals || []).filter(p => p.listingId === listingId);
  }

  public submitProposal(listingId: string, scope: string, price: number): { success: boolean; message: string } {
    const user = this.getCurrentUser();
    const newProp: Proposal = {
      id: `prop-${Date.now()}`,
      listingId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarInitial,
      senderAvatarColor: user.avatarColor,
      isSenderDue: user.isDueVerified,
      scope,
      price,
      dueAt: new Date(Date.now() + 3 * 86400000).toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    if (!this.data.proposals) this.data.proposals = [];
    this.data.proposals.push(newProp);
    this.write(this.data);
    return { success: true, message: 'Đã gửi đề xuất ứng tuyển thành công!' };
  }

  public acceptProposal(proposalId: string): { success: boolean; contractId: string; message: string } {
    const prop = (this.data.proposals || []).find(p => p.id === proposalId);
    if (!prop) return { success: false, contractId: '', message: 'Không tìm thấy đề xuất.' };

    const listing = this.getListingById(prop.listingId);
    if (!listing) return { success: false, contractId: '', message: 'Không tìm thấy bài đăng.' };

    prop.status = 'accepted';

    // Tạo hợp đồng mới
    const contractId = `con-${Date.now().toString().slice(-4)}`;
    const newContract: Contract = {
      id: contractId,
      proposalId: prop.id,
      listingId: listing.id,
      requesterId: listing.ownerId,
      requesterName: listing.ownerName,
      providerId: prop.senderId,
      providerName: prop.senderName,
      isProviderDue: prop.isSenderDue,
      titleSnapshot: listing.title,
      scopeSnapshot: prop.scope,
      priceSnapshot: prop.price,
      dueAtSnapshot: prop.dueAt,
      state: 'pending_payment',
      escrowStatus: 'unfunded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.contracts.unshift(newContract);

    // Initial message
    if (!this.data.messages) this.data.messages = [];
    this.data.messages.push({
      id: `msg-${Date.now()}`,
      threadId: contractId,
      senderId: listing.ownerId,
      senderName: listing.ownerName,
      senderAvatar: listing.ownerAvatar,
      senderAvatarColor: listing.ownerAvatarColor,
      content: `Chào ${prop.senderName}, tôi đã chọn đề xuất của bạn cho công việc "${listing.title}". Hãy trao đổi thêm ở đây nhé!`,
      createdAt: new Date().toISOString(),
    });

    this.write(this.data);
    return { success: true, contractId, message: 'Đã chọn bạn sinh viên thành công! Hãy tiến hành thanh toán để bắt đầu.' };
  }

  public createContractFromService(listingId: string, requesterId: string, scopeNotes?: string): { success: boolean; contractId: string; message: string } {
    const listing = this.getListingById(listingId);
    if (!listing) return { success: false, contractId: '', message: 'Không tìm thấy dịch vụ này.' };

    const requester = this.getUserById(requesterId) || this.getCurrentUser();
    const provider = this.getUserById(listing.ownerId);
    if (!provider) return { success: false, contractId: '', message: 'Không tìm thấy bạn sinh viên cung cấp dịch vụ.' };

    if (requester.id === provider.id) {
      return { success: false, contractId: '', message: 'Bạn không thể tự đặt dịch vụ của chính mình.' };
    }

    const contractId = `con-${Date.now().toString().slice(-4)}`;
    const dueDays = listing.deliveryDays || 3;
    const dueAt = new Date(Date.now() + dueDays * 86400000).toISOString();

    const newContract: Contract = {
      id: contractId,
      proposalId: `prop-direct-${contractId}`,
      listingId: listing.id,
      requesterId: requester.id,
      requesterName: requester.name,
      providerId: provider.id,
      providerName: provider.name,
      isProviderDue: provider.isDueVerified,
      titleSnapshot: listing.title,
      scopeSnapshot: scopeNotes || listing.description,
      priceSnapshot: listing.price,
      dueAtSnapshot: dueAt,
      state: 'pending_payment',
      escrowStatus: 'unfunded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.contracts.unshift(newContract);

    // Initial message
    if (!this.data.messages) this.data.messages = [];
    this.data.messages.push({
      id: `msg-${Date.now()}`,
      threadId: contractId,
      senderId: requester.id,
      senderName: requester.name,
      senderAvatar: requester.avatarInitial,
      senderAvatarColor: requester.avatarColor,
      content: scopeNotes 
        ? `Chào ${provider.name}, tôi đã đặt gói dịch vụ "${listing.title}". Yêu cầu của tôi: ${scopeNotes}`
        : `Chào ${provider.name}, tôi đã đặt gói dịch vụ "${listing.title}". Chúng ta trao đổi chi tiết công việc ở đây nhé!`,
      createdAt: new Date().toISOString(),
    });

    this.write(this.data);
    return { success: true, contractId, message: 'Đã tạo yêu cầu đặt dịch vụ thành công! Vui lòng nạp tiền ký quỹ để bắt đầu.' };
  }

  public getReviewsForUser(userId: string): Review[] {
    return (this.data.reviews || []).filter(r => r.revieweeId === userId);
  }

  public getContractsForUser(userId: string): Contract[] {
    return this.data.contracts.filter(c => c.requesterId === userId || c.providerId === userId);
  }

  public getContractById(id: string): Contract | undefined {
    return this.data.contracts.find(c => c.id === id);
  }

  public getDeliveries(contractId: string): Delivery[] {
    return this.data.deliveries.filter(d => d.contractId === contractId);
  }

  public getMessages(threadId: string): Message[] {
    return this.data.messages.filter(m => m.threadId === threadId);
  }

  public sendMessage(threadId: string, content: string): Message {
    const user = this.getCurrentUser();
    const msg: Message = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarInitial,
      senderAvatarColor: user.avatarColor,
      content,
      createdAt: new Date().toISOString(),
    };
    this.data.messages.push(msg);
    this.write(this.data);
    return msg;
  }

  public getWallet(userId: string): Wallet {
    if (!userId) {
      return {
        userId: '',
        available: 0,
        held: 0,
        granted: false,
      };
    }
    if (!this.data.wallets[userId]) {
      this.data.wallets[userId] = {
        userId,
        available: 1000000,
        held: 0,
        granted: true,
      };
      this.write(this.data);
    }
    return this.data.wallets[userId];
  }

  // --- ACTIONS ---

  public fundContract(contractId: string, method: 'wallet' | 'vietqr' = 'wallet'): { success: boolean; message: string } {
    const contract = this.getContractById(contractId);
    if (!contract || contract.state !== 'pending_payment') {
      return { success: false, message: 'Trạng thái không hợp lệ.' };
    }

    const requesterWallet = this.getWallet(contract.requesterId);
    if (method === 'vietqr') {
      // Mô phỏng dòng tiền từ ngân hàng bên ngoài chuyển vào két đảm bảo Escrow
      requesterWallet.held += contract.priceSnapshot;
    } else {
      if (requesterWallet.available < contract.priceSnapshot) {
        return { success: false, message: 'Số dư khả dụng không đủ để thanh toán.' };
      }
      requesterWallet.available -= contract.priceSnapshot;
      requesterWallet.held += contract.priceSnapshot;
    }

    contract.state = 'in_progress';
    contract.escrowStatus = 'held';
    contract.updatedAt = new Date().toISOString();

    this.write(this.data);
    return { success: true, message: 'Đã thanh toán đảm bảo thành công!' };
  }

  public submitDelivery(contractId: string, urls: string[], notes: string): { success: boolean; message: string } {
    const contract = this.getContractById(contractId);
    if (!contract || contract.state !== 'in_progress') {
      return { success: false, message: 'Không thể nộp sản phẩm vào lúc này.' };
    }

    const user = this.getCurrentUser();
    const delivery: Delivery = {
      id: `del-${Date.now()}`,
      contractId,
      providerId: user.id,
      urls,
      notes,
      createdAt: new Date().toISOString(),
    };

    this.data.deliveries.push(delivery);
    contract.state = 'submitted';
    contract.updatedAt = new Date().toISOString();

    this.write(this.data);
    return { success: true, message: 'Đã gửi sản phẩm thành công!' };
  }

  public requestRevision(contractId: string, reason: string): { success: boolean; message: string } {
    const contract = this.getContractById(contractId);
    if (!contract || contract.state !== 'submitted') {
      return { success: false, message: 'Không thể yêu cầu sửa đổi ở trạng thái này.' };
    }

    const user = this.getCurrentUser();
    const revision: RevisionRequest = {
      id: `rev-${Date.now()}`,
      contractId,
      requesterId: user.id,
      reason,
      createdAt: new Date().toISOString(),
    };

    this.data.revisions.push(revision);
    contract.state = 'in_progress';
    contract.updatedAt = new Date().toISOString();

    this.write(this.data);
    return { success: true, message: 'Đã gửi yêu cầu chỉnh sửa cho bạn sinh viên.' };
  }

  public completeContract(contractId: string): { success: boolean; message: string } {
    const contract = this.getContractById(contractId);
    if (!contract || contract.state !== 'submitted') {
      return { success: false, message: 'Không thể duyệt ở trạng thái này.' };
    }

    const requesterWallet = this.getWallet(contract.requesterId);
    const providerWallet = this.getWallet(contract.providerId);

    requesterWallet.held = Math.max(0, requesterWallet.held - contract.priceSnapshot);
    providerWallet.available += contract.priceSnapshot;

    contract.state = 'completed';
    contract.escrowStatus = 'released';
    contract.updatedAt = new Date().toISOString();

    // Đồng bộ tăng số dự án hoàn thành của sinh viên
    const providerUser = this.getUserById(contract.providerId);
    if (providerUser) {
      providerUser.completedProjectsCount = (providerUser.completedProjectsCount || 0) + 1;
    }

    this.write(this.data);
    return { success: true, message: 'Đã duyệt sản phẩm và gửi thù lao cho bạn sinh viên!' };
  }

  public addReview(contractId: string, stars: number, comment: string): { success: boolean; message: string } {
    const contract = this.getContractById(contractId);
    if (!contract || contract.state !== 'completed') {
      return { success: false, message: 'Chỉ có thể đánh giá sau khi đã duyệt hoàn thành.' };
    }

    const user = this.getCurrentUser();
    const review: Review = {
      id: `rev-${Date.now()}`,
      contractId,
      reviewerId: user.id,
      reviewerName: user.name,
      revieweeId: contract.providerId,
      stars,
      comment,
      createdAt: new Date().toISOString(),
    };

    if (!this.data.reviews) this.data.reviews = [];
    this.data.reviews.unshift(review);

    // Cập nhật rating và số lượt đánh giá của sinh viên
    const providerUser = this.getUserById(contract.providerId);
    if (providerUser) {
      const allProviderReviews = this.data.reviews.filter(r => r.revieweeId === contract.providerId);
      const totalStars = allProviderReviews.reduce((sum, r) => sum + r.stars, 0);
      providerUser.reviewsCount = allProviderReviews.length;
      providerUser.averageRating = Math.round((totalStars / allProviderReviews.length) * 10) / 10;
    }

    this.write(this.data);
    return { success: true, message: 'Cảm ơn bạn đã để lại đánh giá!' };
  }

  public openDispute(contractId: string, reason: string): { success: boolean; message: string } {
    const contract = this.getContractById(contractId);
    if (!contract || (contract.state !== 'in_progress' && contract.state !== 'submitted')) {
      return { success: false, message: 'Không thể mở hòa giải ở trạng thái này.' };
    }

    const user = this.getCurrentUser();
    const dispute: Dispute = {
      id: `disp-${Date.now()}`,
      contractId,
      openedBy: user.id,
      reason,
      previousState: contract.state,
      createdAt: new Date().toISOString(),
    };

    this.data.disputes.push(dispute);
    contract.state = 'disputed';
    contract.updatedAt = new Date().toISOString();

    this.write(this.data);
    return { success: true, message: 'Đã gửi yêu cầu hỗ trợ đến Ban Quản trị.' };
  }

  public getDisputes(): Dispute[] {
    return this.data.disputes || [];
  }

  public resolveDispute(
    disputeId: string, 
    resolution: 'refund_all' | 'release_all', 
    reason: string
  ): { success: boolean; message: string } {
    const dispute = (this.data.disputes || []).find(d => d.id === disputeId);
    if (!dispute) {
      return { success: false, message: 'Không tìm thấy khiếu nại này.' };
    }

    const contract = this.getContractById(dispute.contractId);
    if (!contract) {
      return { success: false, message: 'Không tìm thấy hợp đồng liên quan.' };
    }

    const requesterWallet = this.getWallet(contract.requesterId);
    const providerWallet = this.getWallet(contract.providerId);

    if (resolution === 'refund_all') {
      // Hoàn tiền 100% cho người thuê
      requesterWallet.held -= contract.priceSnapshot;
      requesterWallet.available += contract.priceSnapshot;
      contract.state = 'cancelled';
      contract.escrowStatus = 'refunded';
    } else {
      // Giải ngân thù lao cho sinh viên
      requesterWallet.held -= contract.priceSnapshot;
      providerWallet.available += contract.priceSnapshot;
      contract.state = 'completed';
      contract.escrowStatus = 'released';
    }

    dispute.resolution = resolution;
    dispute.resolutionReason = reason;
    dispute.resolvedBy = 'admin';
    contract.updatedAt = new Date().toISOString();

    this.write(this.data);
    return { 
      success: true, 
      message: resolution === 'refund_all' 
        ? 'Đã hoàn 100% tiền tạm giữ lại vào ví của người thuê!' 
        : 'Đã giải phóng thù lao vào ví của bạn sinh viên!' 
    };
  }
}

export const mockStore = new MockStore();
