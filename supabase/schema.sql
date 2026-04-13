-- 1. Profiles table: links to Supabase Auth
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "System can update profiles" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 2. Todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on todos
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Todos policies
CREATE POLICY "Users can CRUD their own todos" ON todos
  FOR ALL USING (auth.uid() = user_id);

-- 3. Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Instructions for Webhook (Supabase Dashboard)
/*
Steps to configure Webhook in Supabase Dashboard:
1. Go to Database -> Webhooks.
2. Name: "Check VIP Status".
3. Table: "todos".
4. Events: INSERT, UPDATE.
5. Action: HTTP Request.
6. Method: POST.
7. URL: http://<YOUR_BACKEND_URL>/webhooks/check-vip
8. Headers:
   - X-Webhook-Secret: <YOUR_SECRET>
   - Content-Type: application/json
*/
