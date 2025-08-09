-- Create transactions table for expense tracking
-- This table will store all transactions for authenticated users

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(20) DEFAULT 'expense' CHECK (transaction_type IN ('income', 'expense')),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create categories table for predefined expense categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    color VARCHAR(7), -- For hex color codes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_categories table for custom user categories
CREATE TABLE IF NOT EXISTS public.user_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, name)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_categories
CREATE POLICY "Users can view their own categories" ON public.user_categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" ON public.user_categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON public.user_categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON public.user_categories
    FOR DELETE USING (auth.uid() = user_id);

-- Categories are public (everyone can read)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (true);

-- Insert default categories
INSERT INTO public.categories (name, icon, color) VALUES
    ('Food & Dining', '🍽️', '#FF6B6B'),
    ('Transportation', '🚗', '#4ECDC4'),
    ('Shopping', '🛒', '#45B7D1'),
    ('Entertainment', '🎬', '#96CEB4'),
    ('Bills & Utilities', '⚡', '#FFEAA7'),
    ('Healthcare', '🏥', '#DDA0DD'),
    ('Education', '📚', '#98D8C8'),
    ('Travel', '✈️', '#F7DC6F'),
    ('Business', '💼', '#BB8FCE'),
    ('Other', '📝', '#85C1E9'),
    ('Salary', '💰', '#58D68D'),
    ('Freelance', '💻', '#F8C471'),
    ('Investment', '📈', '#85C1E9'),
    ('Gift', '🎁', '#F1948A')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for transactions table
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE
    ON public.transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Create indexes for better performancess
CREATE INDEX IF NOT EXISTS transactions_user_id_idx ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS transactions_date_idx ON public.transactions(date);
CREATE INDEX IF NOT EXISTS transactions_category_idx ON public.transactions(category);
CREATE INDEX IF NOT EXISTS transactions_type_idx ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS user_categories_user_id_idx ON public.user_categories(user_id);
