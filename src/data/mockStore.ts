import { User, Listing, Contract, Review, Message, Wallet, LedgerEntry, Delivery, RevisionRequest, Dispute, Proposal } from '../types';
import { INITIAL_USERS, INITIAL_LISTINGS, INITIAL_CONTRACTS, INITIAL_REVIEWS, INITIAL_DISPUTES } from './mockFixtures';

const STORAGE_KEY = 'unisty.demo.v2';

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-201',
    listingId: 'list-5', // Cần thiết kế Standee & Menu quán cafe
    senderId: 'user-due-thao',
    senderName: 'Thảo Nguyễn',
    senderAvatar: 'T',
    senderAvatarColor: 'bg-teal-600',
    isSenderDue: true,
    scope: 'Chào anh Tuấn, em đã từng thiết kế menu và standee cho 2 quán cafe tại Ngũ Hành Sơn. Em có thể hoàn thành cả 2 ấn phẩm trong 2 ngày với đầy đủ file in ấn và link Canva gốc ạ.',
    price: 350000,
    dueAt: '2026-10-24T17:00:00Z',
    status: 'pending',
    createdAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'prop-202',
    listingId: 'list-5',
    senderId: 'user-due-ha',
    senderName: 'Hà Linh',
    senderAvatar: 'H',
    senderAvatarColor: 'bg-rose-500',
    isSenderDue: true,
    scope: 'Em chào anh! Em chuyên thiết kế ấn phẩm đồ họa phong cách ấm cúng cho mùa đông. Em sẵn sàng gửi trước 2 bản demo màu cho quán duyệt trước ạ.',
    price: 400000,
    dueAt: '2026-10-25T12:00:00Z',
    status: 'pending',
    createdAt: '2026-10-15T10:15:00Z',
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

  wallets['user-requester-minh'].held = 500000;
  wallets['user-requester-minh'].available = 1000000 - 500000 - 250000;
  wallets['user-due-nam'].available = 1000000 + 250000;

  const deliveries: Delivery[] = [
    {
      id: 'del-1',
      contractId: 'con-102',
      providerId: 'user-due-ha',
      urls: ['https://drive.google.com/sample-video-tea', 'https://tiktok.com/@video-preview'],
      notes: 'Em đã dựng xong video 30s theo đúng kịch bản anh Tuấn gửi ạ. Anh xem qua giúp em nhé!',
      createdAt: '2026-10-14T09:30:00Z',
    }
  ];

  const messages: Message[] = [
    {
      id: 'msg-1',
      threadId: 'con-101',
      senderId: 'user-requester-minh',
      senderName: 'Anh Tuấn (The Lab Cafe)',
      senderAvatar: 'A',
      senderAvatarColor: 'bg-amber-600',
      content: 'Chào Thảo, anh đã thanh toán cho dự án rồi nhé. Em cố gắng gửi bản nháp sớm giúp anh nhé.',
      createdAt: '2026-10-14T10:20:00Z',
    },
    {
      id: 'msg-2',
      threadId: 'con-101',
      senderId: 'user-due-thao',
      senderName: 'Thảo Nguyễn',
      senderAvatar: 'T',
      senderAvatarColor: 'bg-teal-600',
      content: 'Dạ em chào anh Tuấn, em đã nhận được thông báo ạ. Dự kiến tối mai em sẽ gửi bản demo 5 slide đầu cho anh duyệt tone màu trước nhé!',
      createdAt: '2026-10-14T10:35:00Z',
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
    currentUserId: 'user-due-thao',
  };
}

class MockStore {
  private data: StorageData;

  constructor() {
    this.data = this.read();
  }

  private read(): StorageData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.proposals && parsed.users) {
          const initial = loadInitialData();
          return {
            ...initial,
            ...parsed,
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
    this.data = loadInitialData();
    this.write(this.data);
  }

  public getCurrentUser(): User {
    const user = this.data.users.find(u => u.id === this.data.currentUserId);
    return user || this.data.users[0];
  }

  public setCurrentUserId(userId: string) {
    this.data.currentUserId = userId;
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
    if (updates.name || updates.avatarInitial || updates.avatarColor) {
      const updatedUser = this.data.users[userIndex];
      this.data.listings = this.data.listings.map(l => {
        if (l.ownerId === userId) {
          return {
            ...l,
            ownerName: updatedUser.name,
            ownerAvatar: updatedUser.avatarInitial,
            ownerAvatarColor: updatedUser.avatarColor,
          };
        }
        return l;
      });
    }

    this.write(this.data);
    return this.data.users[userIndex];
  }

  public getListings(): Listing[] {
    return this.data.listings.filter(l => !l.isHidden);
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
    this.write(this.data);
    return { success: true, contractId, message: 'Đã chọn bạn sinh viên thành công! Hãy tiến hành thanh toán để bắt đầu.' };
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

    requesterWallet.held -= contract.priceSnapshot;
    providerWallet.available += contract.priceSnapshot;

    contract.state = 'completed';
    contract.escrowStatus = 'released';
    contract.updatedAt = new Date().toISOString();

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

    this.data.reviews.push(review);
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
