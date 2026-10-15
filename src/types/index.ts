// UNISTY Core Data Models & Types

export type UserRole = 'guest' | 'member' | 'due' | 'admin';

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  linkUrl: string;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  year: string;
  type: 'award' | 'scholarship' | 'certificate';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarInitial: string;
  avatarColor: string; // Tailwind color class for pastel avatar
  role: UserRole;
  isDueVerified: boolean;
  isLocked: boolean;
  bio?: string;
  major?: string;
  studentClass?: string; // Ví dụ: 50K32.3
  skills: string[];
  portfolioUrls: string[];
  portfolioItems?: PortfolioItem[];
  achievements?: Achievement[];
  completedProjectsCount?: number;
  averageRating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export type ListingKind = 'service' | 'need';
export type ListingCategory = 'design' | 'video' | 'office' | 'writing' | 'tutor' | 'other';
export type ListingStatus = 'open' | 'closed';

export interface Listing {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerAvatarColor: string;
  isOwnerDue: boolean;
  kind: ListingKind;
  category: ListingCategory;
  title: string;
  description: string;
  price: number;
  deliveryDays?: number;
  applicationDeadline?: string;
  dueAt?: string;
  status: ListingStatus;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface Proposal {
  id: string;
  listingId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderAvatarColor: string;
  isSenderDue: boolean;
  scope: string;
  price: number;
  dueAt: string;
  status: ProposalStatus;
  createdAt: string;
}

export type ContractState = 
  | 'pending_payment'
  | 'in_progress'
  | 'submitted'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface Contract {
  id: string;
  proposalId: string;
  listingId: string;
  requesterId: string;
  requesterName: string;
  providerId: string;
  providerName: string;
  isProviderDue: boolean;
  titleSnapshot: string;
  scopeSnapshot: string;
  priceSnapshot: number;
  dueAtSnapshot: string;
  state: ContractState;
  escrowStatus: 'unfunded' | 'held' | 'released' | 'refunded';
  cancellationPendingBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  contractId: string;
  providerId: string;
  urls: string[];
  notes: string;
  createdAt: string;
}

export interface RevisionRequest {
  id: string;
  contractId: string;
  requesterId: string;
  reason: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  contractId: string;
  openedBy: string;
  reason: string;
  previousState: ContractState;
  resolution?: 'refund_all' | 'release_all';
  resolvedBy?: string;
  resolutionReason?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderAvatarColor: string;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  stars: number;
  comment?: string;
  createdAt: string;
}

export interface Wallet {
  userId: string;
  available: number;
  held: number;
  granted: boolean;
}

export interface LedgerEntry {
  id: string;
  walletId: string;
  contractId?: string;
  action: 'credit_grant' | 'hold' | 'release' | 'refund';
  delta: number;
  reference: string;
  createdAt: string;
}
