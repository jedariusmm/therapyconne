-- TherapyConnect Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT,
    emergency_contact JSONB,
    insurance_provider TEXT,
    insurance_id TEXT,
    medical_history JSONB,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Therapists Table
-- ============================================
CREATE TABLE IF NOT EXISTS therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    license_number TEXT NOT NULL,
    credentials TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    bio TEXT,
    years_experience INTEGER,
    session_types TEXT[] DEFAULT '{}',
    insurance_accepted TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2),
    availability JSONB DEFAULT '{}'::jsonb,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_sessions INTEGER DEFAULT 0,
    profile_image TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Sessions/Appointments Table
-- ============================================
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    therapist_id UUID REFERENCES therapists(id) NOT NULL,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    session_type TEXT NOT NULL, -- 'video', 'phone', 'in-person'
    status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no-show'
    notes TEXT,
    video_link TEXT,
    payment_id TEXT,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- Messages Table
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) NOT NULL,
    receiver_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Mood Entries Table
-- ============================================
CREATE TABLE IF NOT EXISTS mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
    emotions TEXT[] DEFAULT '{}',
    notes TEXT,
    activities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Journal Entries Table
-- ============================================
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    mood TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Goals Table
-- ============================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_date DATE,
    status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- Progress Data Table
-- ============================================
CREATE TABLE IF NOT EXISTS progress_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    metric_type TEXT NOT NULL, -- 'anxiety', 'depression', 'sleep_quality', etc.
    value DECIMAL(10,2) NOT NULL,
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Subscriptions Table
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan_type TEXT NOT NULL, -- 'basic', 'premium'
    status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'past_due'
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Payments Table
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    stripe_payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT NOT NULL, -- 'succeeded', 'pending', 'failed'
    description TEXT,
    session_id UUID REFERENCES sessions(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_therapist_id ON sessions(therapist_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_mood_entries_user ON mood_entries(user_id);
CREATE INDEX idx_journal_entries_user ON journal_entries(user_id);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_payments_user ON payments(user_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Therapists policies (anyone can view)
CREATE POLICY "Anyone can view therapists"
    ON therapists FOR SELECT
    TO authenticated
    USING (true);

-- Sessions policies
CREATE POLICY "Users can view own sessions"
    ON sessions FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() IN (
        SELECT user_id FROM therapists WHERE id = therapist_id
    ));

CREATE POLICY "Users can create own sessions"
    ON sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
    ON sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view own messages"
    ON messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Mood entries policies
CREATE POLICY "Users can view own mood entries"
    ON mood_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own mood entries"
    ON mood_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Journal entries policies
CREATE POLICY "Users can manage own journal"
    ON journal_entries FOR ALL
    USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can manage own goals"
    ON goals FOR ALL
    USING (auth.uid() = user_id);

-- Progress data policies
CREATE POLICY "Users can manage own progress"
    ON progress_data FOR ALL
    USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================
-- Functions
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapists_updated_at BEFORE UPDATE ON therapists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Insert sample therapists
INSERT INTO therapists (id, license_number, credentials, specialties, bio, years_experience, session_types, insurance_accepted, hourly_rate, rating)
VALUES
    (
        uuid_generate_v4(),
        'PSY-12345',
        ARRAY['Ph.D. in Clinical Psychology', 'Licensed Psychologist'],
        ARRAY['Anxiety', 'Depression', 'CBT'],
        'Experienced clinical psychologist specializing in cognitive behavioral therapy.',
        12,
        ARRAY['video', 'phone'],
        ARRAY['Aetna', 'Blue Cross', 'Cigna'],
        150.00,
        4.9
    ),
    (
        uuid_generate_v4(),
        'LMFT-67890',
        ARRAY['M.A. in Marriage & Family Therapy', 'LMFT'],
        ARRAY['Couples Therapy', 'Family Therapy', 'Communication'],
        'Compassionate therapist helping couples and families build stronger relationships.',
        8,
        ARRAY['video', 'in-person'],
        ARRAY['Aetna', 'UnitedHealthcare'],
        120.00,
        4.8
    );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

COMMENT ON TABLE users IS 'User profiles and personal information';
COMMENT ON TABLE therapists IS 'Licensed therapists offering services';
COMMENT ON TABLE sessions IS 'Scheduled therapy sessions/appointments';
COMMENT ON TABLE messages IS 'Messages between users and therapists';
COMMENT ON TABLE mood_entries IS 'Daily mood tracking entries';
COMMENT ON TABLE journal_entries IS 'Personal journal entries';
COMMENT ON TABLE goals IS 'User wellness goals';
COMMENT ON TABLE progress_data IS 'Progress tracking metrics';
COMMENT ON TABLE subscriptions IS 'Stripe subscription records';
COMMENT ON TABLE payments IS 'Payment transaction history';
