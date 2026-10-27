-- ========================================================
-- UNISTY DATABASE MIGRATIONS (SUPABASE POSTGRES)
-- Cỗ máy trạng thái, RLS, và Ký quỹ mô phỏng học thuật
-- ========================================================

-- 1. EXTENSIONS & SCHEMAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('member', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE listing_kind AS ENUM ('service', 'need');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE listing_category AS ENUM ('design', 'video', 'office', 'writing', 'tutor', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE listing_status AS ENUM ('open', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE contract_state AS ENUM ('pending_payment', 'in_progress', 'submitted', 'completed', 'cancelled', 'disputed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE escrow_state AS ENUM ('held', 'released', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE ledger_action AS ENUM ('credit_grant', 'hold', 'release', 'refund');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. PROFILES TABLE (KHÔNG LỘ EMAIL)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(80) NOT NULL,
    major VARCHAR(120),
    bio VARCHAR(2000),
    skills TEXT[] DEFAULT '{}',
    portfolio_urls TEXT[] DEFAULT '{}',
    avatar_color VARCHAR(30) DEFAULT 'bg-teal-600',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ACCOUNT CONTROLS (PHÂN QUYỀN RBAC NỘI BỘ)
CREATE TABLE IF NOT EXISTS public.account_controls (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'member',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    owner_name_snapshot VARCHAR(80) NOT NULL,
    owner_avatar_initial VARCHAR(10) NOT NULL,
    owner_avatar_color VARCHAR(30) DEFAULT 'bg-teal-600',
    owner_avatar_url TEXT,
    is_owner_due BOOLEAN NOT NULL DEFAULT FALSE,
    kind listing_kind NOT NULL,
    category listing_category NOT NULL,
    title VARCHAR(120) NOT NULL,
    description VARCHAR(5000) NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 1 AND price <= 1000000),
    delivery_days INT CHECK (delivery_days >= 1 AND delivery_days <= 90),
    application_deadline TIMESTAMPTZ,
    due_at TIMESTAMPTZ,
    status listing_status NOT NULL DEFAULT 'open',
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sender_name_snapshot VARCHAR(80) NOT NULL,
    sender_avatar_initial VARCHAR(10) NOT NULL,
    is_sender_due BOOLEAN NOT NULL DEFAULT FALSE,
    scope VARCHAR(5000) NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 1 AND price <= 1000000),
    due_at TIMESTAMPTZ NOT NULL,
    status proposal_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CONTRACTS TABLE (IMMUTABLE SNAPSHOT)
CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES public.proposals(id) ON DELETE SET NULL,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    title_snapshot VARCHAR(120) NOT NULL,
    scope_snapshot VARCHAR(5000) NOT NULL,
    price_snapshot BIGINT NOT NULL CHECK (price_snapshot >= 1 AND price_snapshot <= 1000000),
    due_at_snapshot TIMESTAMPTZ NOT NULL,
    state contract_state NOT NULL DEFAULT 'pending_payment',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SIMULATED WALLETS & ESCROWS (BẢO TOÀN TIỀN TỆ)
CREATE TABLE IF NOT EXISTS public.mock_wallets (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    available BIGINT NOT NULL DEFAULT 0 CHECK (available >= 0),
    held BIGINT NOT NULL DEFAULT 0 CHECK (held >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_credit_grants (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL DEFAULT 1000000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_escrows (
    contract_id UUID PRIMARY KEY REFERENCES public.contracts(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL CHECK (amount > 0),
    state escrow_state NOT NULL DEFAULT 'held',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mock_wallet_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
    action ledger_action NOT NULL,
    delta BIGINT NOT NULL,
    reference VARCHAR(50) NOT NULL, -- SIM-xxxx
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DELIVERIES (1-5 HTTPS LINKS)
CREATE TABLE IF NOT EXISTS public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    urls TEXT[] NOT NULL,
    notes VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REVIEWS (1-CHIỀU TỪ REQUESTER)
CREATE TABLE IF NOT EXISTS public.reviews (
    contract_id UUID PRIMARY KEY REFERENCES public.contracts(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. DISPUTES TABLE (TRANH CHẤP & TRỌNG TÀI HÒA GIẢI)
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
    initiated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    resolution VARCHAR(50), -- 'refund_all' | 'release_all'
    admin_reason TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. HELPER FUNCTIONS & TRIGGERS (TỰ ĐỘNG CẤP VÍ & PROFILE KHI ĐĂNG KÝ)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_is_due BOOLEAN;
    v_display_name TEXT;
    v_avatar_initial TEXT;
BEGIN
    v_is_due := (NEW.email ILIKE '%@due.edu.vn');
    v_display_name := COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1));
    v_avatar_initial := UPPER(SUBSTRING(v_display_name, 1, 1));

    -- Tạo profile
    INSERT INTO public.profiles (id, display_name, major, bio, avatar_color)
    VALUES (
        NEW.id,
        v_display_name,
        CASE WHEN v_is_due THEN 'Sinh viên ĐH Kinh tế - ĐH Đà Nẵng (DUE)' ELSE 'Thành viên UNISTY' END,
        '',
        'bg-teal-600'
    ) ON CONFLICT (id) DO NOTHING;

    -- Tạo phân quyền (mặc định member)
    INSERT INTO public.account_controls (user_id, role, is_locked)
    VALUES (NEW.id, 'member', FALSE)
    ON CONFLICT (user_id) DO NOTHING;

    -- Cấp ví trải nghiệm 1.000.000 VNĐ
    INSERT INTO public.mock_wallets (user_id, available, held)
    VALUES (NEW.id, 1000000, 0)
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.mock_credit_grants (user_id, amount)
    VALUES (NEW.id, 1000000)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 13. RLS POLICIES (BẢO VỆ DỮ LIỆU)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Profiles: xem công khai, chỉ sửa của chính mình
CREATE POLICY "Public profiles are readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Account controls: xem của chính mình, admin xem hết
CREATE POLICY "Users read own control" ON public.account_controls FOR SELECT USING (auth.uid() = user_id);

-- Listings: mọi người đều xem được bài open, tạo/sửa bài của mình
CREATE POLICY "Open listings readable" ON public.listings FOR SELECT USING (status = 'open' AND is_hidden = false);
CREATE POLICY "Owner read own listings" ON public.listings FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated users can create listing" ON public.listings FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owner update own listing" ON public.listings FOR UPDATE USING (auth.uid() = owner_id);

-- Proposals: người gửi hoặc chủ bài xem được
CREATE POLICY "Proposal participants view" ON public.proposals FOR SELECT USING (
    auth.uid() = sender_id OR 
    EXISTS (SELECT 1 FROM public.listings WHERE listings.id = proposals.listing_id AND listings.owner_id = auth.uid())
);
CREATE POLICY "Create proposal" ON public.proposals FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Sender update proposal" ON public.proposals FOR UPDATE USING (auth.uid() = sender_id);

-- Contracts: chỉ 2 bên tham gia xem được
CREATE POLICY "Contract participants view" ON public.contracts FOR SELECT USING (
    auth.uid() = requester_id OR auth.uid() = provider_id
);
CREATE POLICY "Contract update participants" ON public.contracts FOR UPDATE USING (
    auth.uid() = requester_id OR auth.uid() = provider_id
);

-- Wallets: chỉ chính chủ xem được
CREATE POLICY "Users view own wallet" ON public.mock_wallets FOR SELECT USING (auth.uid() = user_id);

-- Deliveries & Reviews:
CREATE POLICY "Deliveries view" ON public.deliveries FOR SELECT USING (true);
CREATE POLICY "Deliveries insert" ON public.deliveries FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Reviews view" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Reviews insert" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Disputes view:
CREATE POLICY "Disputes view" ON public.disputes FOR SELECT USING (true);
CREATE POLICY "Disputes insert" ON public.disputes FOR INSERT WITH CHECK (auth.uid() = initiated_by);
