-- ==============================================================================
-- PANTERA CAPITAL INVESTMENT PLATFORM - UNIFIED DATABASE SCHEMA (schema.sql)
-- ==============================================================================
-- Complete single-file production schema containing all tables, enumerations,
-- performance indexes, atomic RPC functions, triggers, storage configurations,
-- and non-recursive Row Level Security (RLS) policies.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM (
        'deposit', 
        'withdraw', 
        'invest', 
        'interest_payout', 
        'referral_commission', 
        'admin_adjustment'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE wallet_type AS ENUM ('deposit_wallet', 'interest_wallet');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE investment_status AS ENUM ('active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kyc_status AS ENUM ('unverified', 'pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE referral_commission_type AS ENUM ('deposit', 'invest', 'interest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE DATABASE TABLES
-- ==============================================================================

-- PROFILES TABLE (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    username TEXT UNIQUE,
    phone TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    
    -- Wallets & Balances
    deposit_wallet NUMERIC(15, 2) DEFAULT 0.00 CHECK (deposit_wallet >= 0),
    interest_wallet NUMERIC(15, 2) DEFAULT 0.00 CHECK (interest_wallet >= 0),
    
    -- Referral System
    referral_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text) from 1 for 8),
    referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    
    -- Payout QR Code & Destination (Migration v9)
    payout_qr_code_url TEXT,
    payout_address TEXT,
    payout_method TEXT,

    -- Status & Timestamps
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SITE SETTINGS TABLE (Single row)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name TEXT DEFAULT 'Pantera Capital',
    site_email TEXT DEFAULT 'support@panteracapital.io',
    currency_symbol TEXT DEFAULT '$',
    currency_code TEXT DEFAULT 'USD',
    logo_url TEXT,
    favicon_url TEXT,
    maintenance_mode BOOLEAN DEFAULT false,
    kyc_mandatory BOOLEAN DEFAULT false,
    two_fa_mandatory BOOLEAN DEFAULT false,
    signup_bonus NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row_settings CHECK (id = 1)
);

-- INVESTMENT PLANS TABLE
CREATE TABLE IF NOT EXISTS public.investment_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    badge TEXT DEFAULT 'Popular',
    description TEXT,
    min_amount NUMERIC(15, 2) NOT NULL DEFAULT 10.00,
    max_amount NUMERIC(15, 2) NOT NULL DEFAULT 1000.00,
    fixed_amount NUMERIC(15, 2) DEFAULT NULL,
    roi_percentage NUMERIC(5, 2) NOT NULL,
    payout_interval_hours NUMERIC(10, 4) NOT NULL DEFAULT 24,
    total_payout_periods INT NOT NULL,
    capital_back BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER INVESTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.investment_plans(id) ON DELETE RESTRICT,
    invest_amount NUMERIC(15, 2) NOT NULL,
    payout_per_period NUMERIC(15, 2) NOT NULL,
    total_payout_periods INT NOT NULL,
    paid_periods INT DEFAULT 0,
    total_profit_earned NUMERIC(15, 2) DEFAULT 0.00,
    status investment_status DEFAULT 'active',
    next_payout_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TRANSACTIONS LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    wallet wallet_type NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    charge NUMERIC(15, 2) DEFAULT 0.00,
    post_balance NUMERIC(15, 2) NOT NULL,
    description TEXT NOT NULL,
    trx_ref TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEPOSITS TABLE
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    charge NUMERIC(15, 2) DEFAULT 0.00,
    final_amount NUMERIC(15, 2) NOT NULL,
    gateway_name TEXT NOT NULL,
    trx_id TEXT UNIQUE NOT NULL,
    proof_url TEXT,
    status request_status DEFAULT 'pending',
    admin_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WITHDRAWALS TABLE
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    charge NUMERIC(15, 2) DEFAULT 0.00,
    net_amount NUMERIC(15, 2) NOT NULL,
    method_name TEXT NOT NULL,
    account_details JSONB NOT NULL,
    wallet_type wallet_type DEFAULT 'interest_wallet',
    qr_code_url TEXT,
    status request_status DEFAULT 'pending',
    admin_feedback TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENT GATEWAYS TABLE
CREATE TABLE IF NOT EXISTS public.gateways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    is_automatic BOOLEAN DEFAULT false,
    min_limit NUMERIC(15, 2) NOT NULL DEFAULT 10.00,
    max_limit NUMERIC(15, 2) NOT NULL DEFAULT 10000.00,
    fixed_charge NUMERIC(15, 2) DEFAULT 0.00,
    percent_charge NUMERIC(5, 2) DEFAULT 0.00,
    rate NUMERIC(15, 4) DEFAULT 1.0000,
    currency TEXT DEFAULT 'USD',
    wallet_address TEXT,
    qr_code_url TEXT,
    instructions TEXT,
    credentials JSONB DEFAULT '{}'::jsonb,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WITHDRAWAL METHODS TABLE
CREATE TABLE IF NOT EXISTS public.withdraw_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    min_limit NUMERIC(15, 2) NOT NULL DEFAULT 10.00,
    max_limit NUMERIC(15, 2) NOT NULL DEFAULT 5000.00,
    fixed_charge NUMERIC(15, 2) DEFAULT 0.00,
    percent_charge NUMERIC(5, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    required_fields JSONB DEFAULT '["Wallet Address or Bank Account Details"]'::jsonb,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MULTI-LEVEL REFERRAL TIERS & COMMISSIONS
CREATE TABLE IF NOT EXISTS public.referral_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level INT NOT NULL UNIQUE,
    commission_percent NUMERIC(5, 2) NOT NULL,
    type referral_commission_type DEFAULT 'deposit',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.referral_commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    referee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    level INT DEFAULT 1,
    amount NUMERIC(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- KYC REQUESTS & CONFIGURATION
CREATE TABLE IF NOT EXISTS public.kyc_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_number TEXT,
    document_front_url TEXT NOT NULL,
    document_back_url TEXT,
    address_proof_url TEXT,
    status kyc_status DEFAULT 'pending',
    admin_feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.kyc_settings (
    id INT PRIMARY KEY DEFAULT 1,
    is_required BOOLEAN DEFAULT true,
    required_documents JSONB DEFAULT '["National ID / Passport", "Proof of Address"]'::jsonb,
    CONSTRAINT single_row_kyc_settings CHECK (id = 1)
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'info',
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BLOGS & CATEGORIES CMS TABLES
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
    cover_image TEXT,
    excerpt TEXT,
    content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. NON-RECURSIVE SECURITY DEFINER FUNCTIONS & TRIGGERS
-- ==============================================================================

-- A. NON-RECURSIVE IS_ADMIN() CHECK
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  ) OR (
    COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') = 'admin'
  ) OR (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role'), '') = 'admin'
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon, service_role;

-- B. AUTOMATIC USER PROFILE CREATION WITH REFERRAL LINKING
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_referrer_id UUID := NULL;
    v_ref_code TEXT;
BEGIN
    v_ref_code := NEW.raw_user_meta_data->>'referred_by_code';

    IF v_ref_code IS NOT NULL AND v_ref_code != '' THEN
        SELECT id INTO v_referrer_id 
        FROM public.profiles 
        WHERE referral_code = v_ref_code 
        LIMIT 1;
    END IF;

    INSERT INTO public.profiles (id, email, full_name, username, avatar_url, role, referred_by)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1) || '_' || substring(md5(random()::text) from 1 for 4)),
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'user'::public.user_role),
        v_referrer_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- C. SYNC PROFILE ROLE TO AUTH METADATA TRIGGER
CREATE OR REPLACE FUNCTION public.sync_profile_role_to_auth()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.role IS DISTINCT FROM NEW.role THEN
        UPDATE auth.users
        SET raw_user_meta_data = jsonb_set(
            COALESCE(raw_user_meta_data, '{}'::jsonb),
            '{role}',
            to_jsonb(NEW.role::text)
        ),
        raw_app_meta_data = jsonb_set(
            COALESCE(raw_app_meta_data, '{}'::jsonb),
            '{role}',
            to_jsonb(NEW.role::text)
        )
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_profile_role_to_auth ON public.profiles;
CREATE TRIGGER trg_sync_profile_role_to_auth
    AFTER UPDATE OF role ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.sync_profile_role_to_auth();

-- D. SENSITIVE FINANCIAL COLUMN PROTECTION TRIGGER
CREATE OR REPLACE FUNCTION public.protect_profile_sensitive_columns()
RETURNS TRIGGER AS $$
BEGIN
    IF (current_user = 'authenticated' OR current_user = 'anon') THEN
        IF NOT public.is_admin() THEN
            IF OLD.deposit_wallet IS DISTINCT FROM NEW.deposit_wallet OR
               OLD.interest_wallet IS DISTINCT FROM NEW.interest_wallet OR
               OLD.role IS DISTINCT FROM NEW.role THEN
                RAISE EXCEPTION 'Unauthorized attempt to modify financial balances or roles.';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_sensitive_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_sensitive_columns
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.protect_profile_sensitive_columns();

-- E. ADMIN ROLE PROMOTION / DEMOTION RPC
CREATE OR REPLACE FUNCTION public.admin_set_user_role_rpc(
    p_user_id UUID,
    p_role public.user_role
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Only administrators can manage roles.');
    END IF;

    UPDATE public.profiles
    SET role = p_role, updated_at = NOW()
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Target user profile not found.');
    END IF;

    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(p_role::text)
    ),
    raw_app_meta_data = jsonb_set(
        COALESCE(raw_app_meta_data, '{}'::jsonb),
        '{role}',
        to_jsonb(p_role::text)
    )
    WHERE id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'User role successfully updated to ' || p_role::text
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_user_role_rpc(UUID, public.user_role) TO authenticated;

-- ==============================================================================
-- 5. ATOMIC FINANCIAL PROCEDURES (RPCs)
-- ==============================================================================

-- A. PROCESS INVESTMENT RPC (Deducts balance, creates investment, logs ledger)
CREATE OR REPLACE FUNCTION public.process_investment_rpc(
    p_user_id UUID,
    p_plan_id TEXT,
    p_amount NUMERIC,
    p_wallet_type wallet_type DEFAULT 'deposit_wallet'
) RETURNS JSONB AS $$
DECLARE
    v_current_bal NUMERIC;
    v_new_bal NUMERIC;
    v_plan RECORD;
    v_target_plan_id UUID;
    v_rate NUMERIC;
    v_payout_per_period NUMERIC;
    v_repeat_time INTEGER := 30;
    v_interval_hours NUMERIC := 24;
    v_next_payout TIMESTAMP;
    v_investment_id UUID;
    v_trx_ref TEXT;
BEGIN
    IF p_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Investment amount must be greater than zero.');
    END IF;

    IF p_wallet_type = 'deposit_wallet' THEN
        SELECT deposit_wallet INTO v_current_bal FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    ELSE
        SELECT interest_wallet INTO v_current_bal FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    END IF;

    IF v_current_bal IS NULL OR v_current_bal < p_amount THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient wallet balance to create investment.');
    END IF;

    -- Look up plan by UUID or Name
    SELECT * INTO v_plan FROM public.investment_plans
    WHERE (id::text = p_plan_id OR name ILIKE '%' || p_plan_id || '%') AND is_active = true
    LIMIT 1;

    IF FOUND THEN
        v_target_plan_id := v_plan.id;
        v_rate := v_plan.roi_percentage / 100.0;
        v_repeat_time := COALESCE(v_plan.total_payout_periods, 30);
        v_interval_hours := COALESCE(v_plan.payout_interval_hours, 24);
    ELSE
        SELECT id INTO v_target_plan_id FROM public.investment_plans WHERE is_active = true LIMIT 1;
        v_rate := 0.035;
        v_repeat_time := 30;
        v_interval_hours := 24;
    END IF;

    v_payout_per_period := p_amount * v_rate;
    v_next_payout := NOW() + (v_interval_hours * INTERVAL '1 hour');

    -- Deduct balance atomically
    IF p_wallet_type = 'deposit_wallet' THEN
        UPDATE public.profiles
        SET deposit_wallet = deposit_wallet - p_amount, updated_at = NOW()
        WHERE id = p_user_id
        RETURNING deposit_wallet INTO v_new_bal;
    ELSE
        UPDATE public.profiles
        SET interest_wallet = interest_wallet - p_amount, updated_at = NOW()
        WHERE id = p_user_id
        RETURNING interest_wallet INTO v_new_bal;
    END IF;

    -- Insert active user investment
    INSERT INTO public.user_investments (
        user_id, plan_id, invest_amount, payout_per_period,
        total_payout_periods, paid_periods, next_payout_at, status
    ) VALUES (
        p_user_id, v_target_plan_id, p_amount, v_payout_per_period,
        v_repeat_time, 0, v_next_payout, 'active'::investment_status
    ) RETURNING id INTO v_investment_id;

    -- Log transaction ledger
    v_trx_ref := 'INV-' || upper(substring(md5(random()::text) from 1 for 10));
    INSERT INTO public.transactions (
        user_id, type, wallet, amount, charge, post_balance, description, trx_ref
    ) VALUES (
        p_user_id, 'invest', p_wallet_type, p_amount, 0.00,
        v_new_bal, 'Investment in ' || COALESCE(v_plan.name, 'Starter Plan'), v_trx_ref
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Investment created successfully.',
        'investment_id', v_investment_id,
        'new_balance', v_new_bal
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. APPROVE DEPOSIT RPC (Credits balance, issues multi-tier referral bonuses)
CREATE OR REPLACE FUNCTION public.approve_deposit_rpc(
    p_deposit_id UUID,
    p_admin_id UUID,
    p_feedback TEXT DEFAULT 'Approved by admin'
) RETURNS JSONB AS $$
DECLARE
    v_deposit RECORD;
    v_new_balance NUMERIC;
    v_trx_ref TEXT;
    v_current_referrer UUID;
    v_lvl RECORD;
    v_comm_amount NUMERIC;
    v_ref_trx_ref TEXT;
    v_ref_post_bal NUMERIC;
BEGIN
    SELECT * INTO v_deposit FROM public.deposits WHERE id = p_deposit_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Deposit record not found.');
    END IF;

    IF v_deposit.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Deposit request is already processed.');
    END IF;

    -- Update deposit status
    UPDATE public.deposits
    SET status = 'approved',
        admin_feedback = p_feedback,
        updated_at = NOW()
    WHERE id = p_deposit_id;

    -- Credit user deposit wallet
    UPDATE public.profiles
    SET deposit_wallet = deposit_wallet + v_deposit.final_amount,
        updated_at = NOW()
    WHERE id = v_deposit.user_id
    RETURNING deposit_wallet INTO v_new_balance;

    -- Record transaction ledger
    v_trx_ref := 'DEP-' || upper(substring(md5(random()::text) from 1 for 10));
    INSERT INTO public.transactions (
        user_id, type, wallet, amount, charge, post_balance, description, trx_ref
    ) VALUES (
        v_deposit.user_id, 'deposit', 'deposit_wallet', v_deposit.final_amount, v_deposit.charge,
        v_new_balance, 'Deposit approved via ' || v_deposit.gateway_name, v_trx_ref
    );

    -- Create notification
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (v_deposit.user_id, 'Deposit Approved', 'Your deposit of $' || v_deposit.final_amount || ' via ' || v_deposit.gateway_name || ' has been approved.', 'success');

    -- Multi-Level Referral Bonus Distribution
    BEGIN
        SELECT referred_by INTO v_current_referrer FROM public.profiles WHERE id = v_deposit.user_id;

        FOR v_lvl IN SELECT * FROM public.referral_levels WHERE is_active = true ORDER BY level ASC LOOP
            EXIT WHEN v_current_referrer IS NULL;

            v_comm_amount := (v_deposit.final_amount * v_lvl.commission_percent) / 100.0;

            IF v_comm_amount > 0 THEN
                -- Credit referrer interest_wallet
                UPDATE public.profiles
                SET interest_wallet = interest_wallet + v_comm_amount, updated_at = NOW()
                WHERE id = v_current_referrer
                RETURNING interest_wallet INTO v_ref_post_bal;

                -- Record referral commission log
                INSERT INTO public.referral_commissions (referrer_id, referee_id, level, amount, description)
                VALUES (v_current_referrer, v_deposit.user_id, v_lvl.level, v_comm_amount, 'Deposit commission Level ' || v_lvl.level);

                -- Record transaction ledger for referrer
                v_ref_trx_ref := 'REF-' || upper(substring(md5(random()::text) from 1 for 10));
                INSERT INTO public.transactions (
                    user_id, type, wallet, amount, charge, post_balance, description, trx_ref
                ) VALUES (
                    v_current_referrer, 'referral_commission', 'interest_wallet', v_comm_amount, 0.00,
                    v_ref_post_bal, 'Referral commission Level ' || v_lvl.level || ' from deposit', v_ref_trx_ref
                );
            END IF;

            -- Move up to next upline referrer
            SELECT referred_by INTO v_current_referrer FROM public.profiles WHERE id = v_current_referrer;
        END LOOP;
    EXCEPTION
        WHEN OTHERS THEN NULL;
    END;

    RETURN jsonb_build_object('success', true, 'message', 'Deposit approved successfully.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. REJECT DEPOSIT RPC
CREATE OR REPLACE FUNCTION public.reject_deposit_rpc(
    p_deposit_id UUID,
    p_admin_id UUID,
    p_feedback TEXT DEFAULT 'Rejected by admin'
) RETURNS JSONB AS $$
DECLARE
    v_deposit RECORD;
BEGIN
    SELECT * INTO v_deposit FROM public.deposits WHERE id = p_deposit_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Deposit record not found.');
    END IF;

    IF v_deposit.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Deposit request is already processed.');
    END IF;

    UPDATE public.deposits
    SET status = 'rejected',
        admin_feedback = p_feedback,
        updated_at = NOW()
    WHERE id = p_deposit_id;

    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (v_deposit.user_id, 'Deposit Rejected', 'Your deposit request of $' || v_deposit.amount || ' was rejected: ' || p_feedback, 'danger');

    RETURN jsonb_build_object('success', true, 'message', 'Deposit rejected successfully.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D. REQUEST WITHDRAWAL RPC (Holds balance immediately, records wallet type)
CREATE OR REPLACE FUNCTION public.request_withdrawal_rpc(
    p_user_id UUID,
    p_wallet_type wallet_type,
    p_amount NUMERIC,
    p_method_name TEXT,
    p_account_details JSONB
) RETURNS JSONB AS $$
DECLARE
    v_current_bal NUMERIC;
    v_charge NUMERIC := 0.00;
    v_net_amount NUMERIC;
    v_method RECORD;
    v_withdrawal_id UUID;
    v_trx_ref TEXT;
BEGIN
    SELECT * INTO v_method FROM public.withdraw_methods WHERE name = p_method_name AND status = true;
    IF FOUND THEN
        v_charge := COALESCE(v_method.fixed_charge, 0) + ((p_amount * COALESCE(v_method.percent_charge, 0)) / 100.0);
    END IF;

    v_net_amount := p_amount - v_charge;
    IF v_net_amount <= 0 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal amount after charge must be greater than zero.');
    END IF;

    IF p_wallet_type = 'deposit_wallet' THEN
        SELECT deposit_wallet INTO v_current_bal FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    ELSE
        SELECT interest_wallet INTO v_current_bal FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    END IF;

    IF v_current_bal IS NULL OR v_current_bal < p_amount THEN
        RETURN jsonb_build_object('success', false, 'message', 'Insufficient wallet balance for withdrawal.');
    END IF;

    -- Deduct/hold amount from user wallet
    IF p_wallet_type = 'deposit_wallet' THEN
        UPDATE public.profiles SET deposit_wallet = deposit_wallet - p_amount, updated_at = NOW() WHERE id = p_user_id;
    ELSE
        UPDATE public.profiles SET interest_wallet = interest_wallet - p_amount, updated_at = NOW() WHERE id = p_user_id;
    END IF;

    INSERT INTO public.withdrawals (
        user_id, amount, charge, net_amount, method_name, account_details, wallet_type, status
    ) VALUES (
        p_user_id, p_amount, v_charge, v_net_amount, p_method_name, p_account_details, p_wallet_type, 'pending'
    ) RETURNING id INTO v_withdrawal_id;

    v_trx_ref := 'WTH-' || upper(substring(md5(random()::text) from 1 for 10));
    INSERT INTO public.transactions (
        user_id, type, wallet, amount, charge, post_balance, description, trx_ref
    ) VALUES (
        p_user_id, 'withdraw', p_wallet_type, p_amount, v_charge,
        (v_current_bal - p_amount), 'Withdrawal requested via ' || p_method_name, v_trx_ref
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Withdrawal request submitted successfully.',
        'withdrawal_id', v_withdrawal_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- E. APPROVE WITHDRAWAL RPC
CREATE OR REPLACE FUNCTION public.approve_withdrawal_rpc(
    p_withdrawal_id UUID,
    p_admin_id UUID,
    p_feedback TEXT DEFAULT 'Withdrawal processed successfully'
) RETURNS JSONB AS $$
DECLARE
    v_withdraw RECORD;
BEGIN
    SELECT * INTO v_withdraw FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal record not found.');
    END IF;

    IF v_withdraw.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal request is already processed.');
    END IF;

    UPDATE public.withdrawals
    SET status = 'approved',
        admin_feedback = p_feedback,
        updated_at = NOW()
    WHERE id = p_withdrawal_id;

    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (v_withdraw.user_id, 'Withdrawal Approved', 'Your withdrawal request of $' || v_withdraw.net_amount || ' via ' || v_withdraw.method_name || ' has been processed.', 'success');

    RETURN jsonb_build_object('success', true, 'message', 'Withdrawal approved successfully.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- F. REJECT WITHDRAWAL RPC (Refunds held balance back to original wallet)
CREATE OR REPLACE FUNCTION public.reject_withdrawal_rpc(
    p_withdrawal_id UUID,
    p_admin_id UUID,
    p_feedback TEXT DEFAULT 'Rejected by admin'
) RETURNS JSONB AS $$
DECLARE
    v_withdraw RECORD;
    v_new_balance NUMERIC;
    v_trx_ref TEXT;
    v_target_wallet wallet_type;
BEGIN
    SELECT * INTO v_withdraw FROM public.withdrawals WHERE id = p_withdrawal_id FOR UPDATE;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal record not found.');
    END IF;

    IF v_withdraw.status != 'pending' THEN
        RETURN jsonb_build_object('success', false, 'message', 'Withdrawal request is already processed.');
    END IF;

    v_target_wallet := COALESCE(v_withdraw.wallet_type, 'interest_wallet'::wallet_type);

    UPDATE public.withdrawals
    SET status = 'rejected',
        admin_feedback = p_feedback,
        updated_at = NOW()
    WHERE id = p_withdrawal_id;

    IF v_target_wallet = 'deposit_wallet' THEN
        UPDATE public.profiles
        SET deposit_wallet = deposit_wallet + v_withdraw.amount, updated_at = NOW()
        WHERE id = v_withdraw.user_id
        RETURNING deposit_wallet INTO v_new_balance;
    ELSE
        UPDATE public.profiles
        SET interest_wallet = interest_wallet + v_withdraw.amount, updated_at = NOW()
        WHERE id = v_withdraw.user_id
        RETURNING interest_wallet INTO v_new_balance;
    END IF;

    v_trx_ref := 'REF-' || upper(substring(md5(random()::text) from 1 for 10));
    INSERT INTO public.transactions (
        user_id, type, wallet, amount, charge, post_balance, description, trx_ref
    ) VALUES (
        v_withdraw.user_id, 'admin_adjustment', v_target_wallet, v_withdraw.amount, 0.00,
        v_new_balance, 'Withdrawal request rejected - refunded to ' || v_target_wallet, v_trx_ref
    );

    RETURN jsonb_build_object('success', true, 'message', 'Withdrawal rejected and refunded successfully.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- G. ADMIN ADJUST BALANCE RPC
CREATE OR REPLACE FUNCTION public.admin_adjust_balance_rpc(
    p_user_id UUID,
    p_target_wallet wallet_type,
    p_action TEXT,
    p_amount NUMERIC,
    p_remark TEXT DEFAULT 'Admin balance adjustment'
) RETURNS JSONB AS $$
DECLARE
    v_current_bal NUMERIC;
    v_new_bal NUMERIC;
    v_trx_ref TEXT;
BEGIN
    IF p_target_wallet = 'deposit_wallet' THEN
        SELECT deposit_wallet INTO v_current_bal FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    ELSE
        SELECT interest_wallet INTO v_current_bal FROM public.profiles WHERE id = p_user_id FOR UPDATE;
    END IF;

    IF v_current_bal IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'User profile not found.');
    END IF;

    IF p_action = 'subtract' AND v_current_bal < p_amount THEN
        RETURN jsonb_build_object('success', false, 'message', 'User balance is insufficient for subtraction.');
    END IF;

    IF p_action = 'add' THEN
        v_new_bal := v_current_bal + p_amount;
    ELSE
        v_new_bal := v_current_bal - p_amount;
    END IF;

    IF p_target_wallet = 'deposit_wallet' THEN
        UPDATE public.profiles SET deposit_wallet = v_new_bal, updated_at = NOW() WHERE id = p_user_id;
    ELSE
        UPDATE public.profiles SET interest_wallet = v_new_bal, updated_at = NOW() WHERE id = p_user_id;
    END IF;

    v_trx_ref := 'ADM-' || upper(substring(md5(random()::text) from 1 for 10));
    INSERT INTO public.transactions (
        user_id, type, wallet, amount, charge, post_balance, description, trx_ref
    ) VALUES (
        p_user_id, 'admin_adjustment', p_target_wallet, p_amount, 0.00,
        v_new_bal, p_remark, v_trx_ref
    );

    RETURN jsonb_build_object('success', true, 'message', 'Balance updated successfully.', 'new_balance', v_new_bal);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- H. AUTOMATED COMPOUNDING ROI PAYOUT ENGINE RPC
CREATE OR REPLACE FUNCTION public.process_investment_payouts_rpc()
RETURNS JSONB AS $$
DECLARE
    v_inv RECORD;
    v_count INTEGER := 0;
    v_new_bal NUMERIC;
    v_trx_ref TEXT;
    v_new_paid INTEGER;
    v_is_completed BOOLEAN;
    v_interval NUMERIC;
BEGIN
    FOR v_inv IN
        SELECT ui.*, p.interest_wallet, ip.payout_interval_hours, ip.capital_back
        FROM public.user_investments ui
        JOIN public.profiles p ON p.id = ui.user_id
        LEFT JOIN public.investment_plans ip ON ip.id = ui.plan_id
        WHERE ui.status = 'active'
          AND ui.next_payout_at <= NOW()
          AND ui.paid_periods < ui.total_payout_periods
        FOR UPDATE OF ui
    LOOP
        v_new_paid := v_inv.paid_periods + 1;
        v_is_completed := (v_new_paid >= v_inv.total_payout_periods);
        v_interval := COALESCE(v_inv.payout_interval_hours, 24);

        -- Credit user interest wallet
        UPDATE public.profiles
        SET interest_wallet = interest_wallet + v_inv.payout_per_period,
            updated_at = NOW()
        WHERE id = v_inv.user_id
        RETURNING interest_wallet INTO v_new_bal;

        -- Update investment record
        UPDATE public.user_investments
        SET paid_periods = v_new_paid,
            total_profit_earned = COALESCE(total_profit_earned, 0) + v_inv.payout_per_period,
            next_payout_at = CASE WHEN v_is_completed THEN NOW() ELSE NOW() + (v_interval * INTERVAL '1 hour') END,
            status = CASE WHEN v_is_completed THEN 'completed'::investment_status ELSE 'active'::investment_status END,
            updated_at = NOW()
        WHERE id = v_inv.id;

        -- Log interest payout transaction ledger
        v_trx_ref := 'ROI-' || upper(substring(md5(random()::text) from 1 for 10));
        INSERT INTO public.transactions (
            user_id, type, wallet, amount, charge, post_balance, description, trx_ref
        ) VALUES (
            v_inv.user_id, 'interest_payout'::transaction_type, 'interest_wallet', v_inv.payout_per_period, 0.00,
            v_new_bal, 'ROI payout period ' || v_new_paid || '/' || v_inv.total_payout_periods, v_trx_ref
        );

        -- Return capital if investment plan completed and capital_back enabled
        IF v_is_completed AND COALESCE(v_inv.capital_back, true) THEN
            UPDATE public.profiles
            SET deposit_wallet = deposit_wallet + v_inv.invest_amount,
                updated_at = NOW()
            WHERE id = v_inv.user_id
            RETURNING deposit_wallet INTO v_new_bal;

            v_trx_ref := 'CAP-' || upper(substring(md5(random()::text) from 1 for 10));
            INSERT INTO public.transactions (
                user_id, type, wallet, amount, charge, post_balance, description, trx_ref
            ) VALUES (
                v_inv.user_id, 'admin_adjustment'::transaction_type, 'deposit_wallet', v_inv.invest_amount, 0.00,
                v_new_bal, 'Capital returned upon plan maturity completion', v_trx_ref
            );
        END IF;

        v_count := v_count + 1;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Processed ' || v_count || ' ROI investment payouts.',
        'payouts_processed', v_count
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 6. UNIFIED ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdraw_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
CREATE POLICY "Users can view profiles" ON public.profiles
    FOR SELECT USING (
        auth.uid() = id
        OR auth.uid() = referred_by
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Users and admins can update profile" ON public.profiles;
CREATE POLICY "Users and admins can update profile" ON public.profiles
    FOR UPDATE USING (
        auth.uid() = id
        OR public.is_admin()
    );

-- Investment Plans Policies
DROP POLICY IF EXISTS "Public plans are viewable by everyone" ON public.investment_plans;
CREATE POLICY "Public plans are viewable by everyone" ON public.investment_plans
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage investment_plans" ON public.investment_plans;
CREATE POLICY "Admins can manage investment_plans" ON public.investment_plans
    FOR ALL USING (
        public.is_admin()
    ) WITH CHECK (
        public.is_admin()
    );

-- User Investments Policies (Supports Admin Impersonation)
DROP POLICY IF EXISTS "Users and admins view investments" ON public.user_investments;
CREATE POLICY "Users and admins view investments" ON public.user_investments
    FOR SELECT USING (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Users and admins can insert investments" ON public.user_investments;
CREATE POLICY "Users and admins can insert investments" ON public.user_investments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admins can manage user_investments" ON public.user_investments;
CREATE POLICY "Admins can manage user_investments" ON public.user_investments
    FOR ALL USING (
        public.is_admin()
    );

-- Deposits Policies (Supports Admin Impersonation)
DROP POLICY IF EXISTS "Users and admins can view deposits" ON public.deposits;
CREATE POLICY "Users and admins can view deposits" ON public.deposits
    FOR SELECT USING (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Users and admins can create deposits" ON public.deposits;
CREATE POLICY "Users and admins can create deposits" ON public.deposits
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admins can update deposits" ON public.deposits;
CREATE POLICY "Admins can update deposits" ON public.deposits
    FOR UPDATE USING (
        public.is_admin()
        OR auth.uid() = user_id
    );

-- Withdrawals Policies (Supports Admin Impersonation)
DROP POLICY IF EXISTS "Users and admins can view withdrawals" ON public.withdrawals;
CREATE POLICY "Users and admins can view withdrawals" ON public.withdrawals
    FOR SELECT USING (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Users and admins can create withdrawals" ON public.withdrawals;
CREATE POLICY "Users and admins can create withdrawals" ON public.withdrawals
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;
CREATE POLICY "Admins can update withdrawals" ON public.withdrawals
    FOR UPDATE USING (
        public.is_admin()
    );

-- Transactions Policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (
        auth.uid() = user_id
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Admins can manage transactions" ON public.transactions;
CREATE POLICY "Admins can manage transactions" ON public.transactions
    FOR ALL USING (
        public.is_admin()
    );

-- Gateways Policies
DROP POLICY IF EXISTS "Public gateways read" ON public.gateways;
CREATE POLICY "Public gateways read" ON public.gateways FOR SELECT USING (status = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access gateways" ON public.gateways;
CREATE POLICY "Admins full access gateways" ON public.gateways FOR ALL USING (public.is_admin());

-- Withdrawal Methods Policies
DROP POLICY IF EXISTS "Public withdraw methods read" ON public.withdraw_methods;
CREATE POLICY "Public withdraw methods read" ON public.withdraw_methods FOR SELECT USING (status = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access withdraw methods" ON public.withdraw_methods;
CREATE POLICY "Admins full access withdraw methods" ON public.withdraw_methods FOR ALL USING (public.is_admin());

-- Referral Levels & Commissions Policies
DROP POLICY IF EXISTS "Public referral levels read" ON public.referral_levels;
CREATE POLICY "Public referral levels read" ON public.referral_levels FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access referral levels" ON public.referral_levels;
CREATE POLICY "Admins full access referral levels" ON public.referral_levels FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view own referral commissions" ON public.referral_commissions;
CREATE POLICY "Users can view own referral commissions" ON public.referral_commissions
    FOR SELECT USING (
        auth.uid() = referrer_id
        OR public.is_admin()
    );

-- KYC Requests & Settings Policies
DROP POLICY IF EXISTS "Users and admins view kyc requests" ON public.kyc_requests;
CREATE POLICY "Users and admins view kyc requests" ON public.kyc_requests
    FOR SELECT USING (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Users and admins can create kyc requests" ON public.kyc_requests;
CREATE POLICY "Users and admins can create kyc requests" ON public.kyc_requests
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        OR public.is_admin()
        OR (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

DROP POLICY IF EXISTS "Admins full access kyc requests" ON public.kyc_requests;
CREATE POLICY "Admins full access kyc requests" ON public.kyc_requests FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins full access kyc settings" ON public.kyc_settings;
CREATE POLICY "Admins full access kyc settings" ON public.kyc_settings FOR ALL USING (public.is_admin());

-- Site Settings Policies
DROP POLICY IF EXISTS "Public site settings read" ON public.site_settings;
CREATE POLICY "Public site settings read" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access site settings" ON public.site_settings;
CREATE POLICY "Admins full access site settings" ON public.site_settings FOR ALL USING (public.is_admin());

-- Notifications Policies
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR SELECT USING (
        auth.uid() = user_id
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
CREATE POLICY "Users update own notifications" ON public.notifications
    FOR UPDATE USING (
        auth.uid() = user_id
        OR public.is_admin()
    );

-- Blogs & CMS Policies
DROP POLICY IF EXISTS "Public blogs read" ON public.blogs;
CREATE POLICY "Public blogs read" ON public.blogs FOR SELECT USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access blogs" ON public.blogs;
CREATE POLICY "Admins full access blogs" ON public.blogs FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Public blog categories read" ON public.blog_categories;
CREATE POLICY "Public blog categories read" ON public.blog_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins full access blog categories" ON public.blog_categories;
CREATE POLICY "Admins full access blog categories" ON public.blog_categories FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 7. STORAGE BUCKET CONFIGURATION & POLICIES
-- ==============================================================================
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'buckets') THEN
        -- Deposit Proofs Bucket
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('deposit-proofs', 'deposit-proofs', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
        ON CONFLICT (id) DO UPDATE SET public = true;

        -- KYC Documents Bucket
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('kyc-documents', 'kyc-documents', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
        ON CONFLICT (id) DO UPDATE SET public = true;

        -- Payout QR Codes Bucket (Migration v9)
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES ('payout-qrcodes', 'payout-qrcodes', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
        ON CONFLICT (id) DO UPDATE SET public = true;
    END IF;
END $$;

-- Storage Objects Policies for payout-qrcodes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
        DROP POLICY IF EXISTS "Public can view payout QR codes" ON storage.objects;
        CREATE POLICY "Public can view payout QR codes" ON storage.objects
            FOR SELECT USING (bucket_id = 'payout-qrcodes');

        DROP POLICY IF EXISTS "Authenticated users can upload payout QR codes" ON storage.objects;
        CREATE POLICY "Authenticated users can upload payout QR codes" ON storage.objects
            FOR INSERT WITH CHECK (bucket_id = 'payout-qrcodes' AND auth.role() = 'authenticated');

        DROP POLICY IF EXISTS "Users can update own payout QR codes" ON storage.objects;
        CREATE POLICY "Users can update own payout QR codes" ON storage.objects
            FOR UPDATE USING (bucket_id = 'payout-qrcodes' AND auth.uid()::text = (storage.foldername(name))[1]);

        DROP POLICY IF EXISTS "Users can delete own payout QR codes" ON storage.objects;
        CREATE POLICY "Users can delete own payout QR codes" ON storage.objects
            FOR DELETE USING (bucket_id = 'payout-qrcodes' AND auth.uid()::text = (storage.foldername(name))[1]);
    END IF;
END $$;

-- ==============================================================================
-- 8. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON public.user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_created ON public.transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deposits_user_id_status ON public.deposits(user_id, status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id_status ON public.withdrawals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_withdrawals_qr_code ON public.withdrawals(user_id) WHERE qr_code_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_investments_active_next_payout ON public.user_investments(next_payout_at) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_gateways_status ON public.gateways(status) WHERE status = true;
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by);

-- ==============================================================================
-- 9. SEED DEFAULT SYSTEM DATA
-- ==============================================================================

-- Site Settings
INSERT INTO public.site_settings (id, site_name, site_email, currency_symbol, currency_code)
VALUES (1, 'Pantera Capital', 'support@panteracapital.io', '$', 'USD')
ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    site_email = EXCLUDED.site_email;

-- KYC Default Configuration
INSERT INTO public.kyc_settings (id, is_required) 
VALUES (1, true) 
ON CONFLICT (id) DO NOTHING;

-- 6 Official Pantera Investment Packages
INSERT INTO public.investment_plans (name, badge, description, min_amount, max_amount, roi_percentage, payout_interval_hours, total_payout_periods, capital_back, is_active)
VALUES 
('Regular Package', 'Starter Tier', '2.5% weekly return with principal returned at maturity.', 500.00, 2000.00, 2.50, 168, 8, true, true),
('Silver Package', 'Growth Tier', '4.0% weekly return with multi-tier affiliate earnings.', 3000.00, 5000.00, 4.00, 168, 12, true, true),
('Gold Package', 'Most Popular', '6.0% weekly return with dedicated account management.', 10000.00, 20000.00, 6.00, 168, 16, true, true),
('VIP Package', 'High Yield', '10.0% weekly return with custom vault storage & 24/7 support.', 50000.00, 200000.00, 10.00, 168, 24, true, true),
('Ultimate Package', 'Executive Tier', '12.0% weekly return with institutional cold custody & private wealth advisory.', 500000.00, 3000000.00, 12.00, 168, 36, true, true),
('Elites Package', 'Exclusive Tier', '15.5% weekly return. In elite packages you can get a loan from the company to buy a house and pay in installments.', 5000000.00, 20000000.00, 15.50, 168, 52, true, true)
ON CONFLICT DO NOTHING;

-- Deposit Payment Gateways
INSERT INTO public.gateways (name, code, is_automatic, min_limit, max_limit, wallet_address, instructions)
VALUES 
('USDT (TRC20)', 'usdt_trc20', false, 20.00, 50000.00, 'T9yD14Nj9j7x8kL2m1n0PqRsTuVwXyZ3aB', 'Send exact USDT TRC20 amount to the wallet address and paste your TxHash below.'),
('Bitcoin (BTC)', 'bitcoin', false, 50.00, 100000.00, 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Transfer BTC amount to wallet address and provide Transaction ID.'),
('Bank Wire Transfer', 'bank_wire', false, 100.00, 250000.00, 'IBAN: US98765432109876543210', 'Transfer funds via SWIFT/Bank wire and upload deposit receipt.')
ON CONFLICT (code) DO NOTHING;

-- Withdrawal Payout Methods
INSERT INTO public.withdraw_methods (name, code, min_limit, max_limit, fixed_charge, percent_charge)
VALUES 
('USDT TRC20 Payout', 'usdt_trc20_w', 10.00, 10000.00, 1.00, 0.50),
('Bitcoin Payout', 'bitcoin_w', 25.00, 25000.00, 2.00, 1.00),
('Bank Account Transfer', 'bank_transfer_w', 50.00, 50000.00, 5.00, 1.50)
ON CONFLICT (code) DO NOTHING;

-- Multi-Level Affiliate Referral Tiers
INSERT INTO public.referral_levels (level, commission_percent, type)
VALUES 
(1, 5.00, 'deposit'),
(2, 3.00, 'deposit'),
(3, 1.00, 'deposit')
ON CONFLICT (level) DO NOTHING;
