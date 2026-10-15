-- ========================================================
-- UNISTY DATABASE MIGRATIONS (SUPABASE POSTGRES)
-- Cỗ máy trạng thái, RLS, và Ký quỹ mô phỏng học thuật
-- ========================================================

-- 1. EXTENSIONS & SCHEMAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
CREATE TYPE user_role AS ENUM ('member', 'admin');
CREATE TYPE listing_kind AS ENUM ('service', 'need');
CREATE TYPE listing_category AS ENUM ('design', 'video', 'office', 'writing', 'tutor', 'other');
CREATE TYPE listing_status AS ENUM ('open', 'closed');
CREATE TYPE proposal_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');
CREATE TYPE contract_state AS ENUM ('pending_payment', 'in_progress', 'submitted', 'completed', 'cancelled', 'disputed');
CREATE TYPE escrow_state AS ENUM ('held', 'released', 'refunded');
CREATE TYPE ledger_action AS ENUM ('credit_grant', 'hold', 'release', 'refund');

-- 3. PROFILES TABLE (KHÔNG LỘ EMAIL)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(80) NOT NULL,
    major VARCHAR(120),
    bio VARCHAR(2000),
    skills TEXT[] DEFAULT '{}',
    portfolio_urls TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ACCOUNT CONTROLS (PHÂN QUYỀN RBAC NỘI BỘ)
CREATE TABLE public.account_controls (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'member',
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. LISTINGS TABLE
CREATE TABLE public.listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    owner_name_snapshot VARCHAR(80) NOT NULL,
    owner_avatar_initial VARCHAR(10) NOT NULL,
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
CREATE TABLE public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    scope VARCHAR(5000) NOT NULL,
    price BIGINT NOT NULL CHECK (price >= 1 AND price <= 1000000),
    due_at TIMESTAMPTZ NOT NULL,
    status proposal_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CONTRACTS TABLE (IMMUTABLE SNAPSHOT)
CREATE TABLE public.contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID UNIQUE NOT NULL REFERENCES public.proposals(id) ON DELETE RESTRICT,
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
CREATE TABLE public.mock_wallets (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    available BIGINT NOT NULL DEFAULT 0 CHECK (available >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.mock_credit_grants (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL DEFAULT 1000000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.mock_escrows (
    contract_id UUID PRIMARY KEY REFERENCES public.contracts(id) ON DELETE RESTRICT,
    amount BIGINT NOT NULL CHECK (amount > 0),
    state escrow_state NOT NULL DEFAULT 'held',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.mock_wallet_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    contract_id UUID REFERENCES public.contracts(id) ON DELETE RESTRICT,
    action ledger_action NOT NULL,
    delta BIGINT NOT NULL,
    reference VARCHAR(50) NOT NULL, -- SIM-xxxx
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DELIVERIES (1-5 HTTPS LINKS)
CREATE TABLE public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE RESTRICT,
    provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    urls TEXT[] NOT NULL,
    notes VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. REVIEWS (1-CHIỀU TỪ REQUESTER)
CREATE TABLE public.reviews (
    contract_id UUID PRIMARY KEY REFERENCES public.contracts(id) ON DELETE RESTRICT,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    reviewee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment VARCHAR(2000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. HELPER PERMISSION FUNCTIONS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_due_student(p_user_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_email TEXT;
BEGIN
    SELECT email INTO v_email FROM auth.users WHERE id = p_user_id;
    RETURN (v_email ILIKE '%@due.edu.vn');
END;
$$;

-- 12. RLS POLICIES (BẢO VỆ DỮ LIỆU)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are readable by authenticated members"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Open listings are readable by everyone"
ON public.listings FOR SELECT USING (status = 'open' AND is_hidden = false);

CREATE POLICY "Contract participants can view their contracts"
ON public.contracts FOR SELECT TO authenticated
USING (auth.uid() = requester_id OR auth.uid() = provider_id);

CREATE POLICY "Users can only view their own wallet"
ON public.mock_wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
