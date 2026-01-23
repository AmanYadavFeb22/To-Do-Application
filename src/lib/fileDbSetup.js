// Database setup for user files
// This script should be run once to create the necessary table

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Creates the user_files table in Supabase
 * This should be run manually once during setup
 */
export const createFilesTable = async () => {
  // Note: Table creation needs to be done manually in Supabase SQL Editor
  // This is the SQL you would run in your Supabase dashboard:
  const sql = `
    CREATE TABLE user_files (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL UNIQUE,
      file_url TEXT NOT NULL,
      file_size BIGINT,
      file_type TEXT,
      uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable Row Level Security
    ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

    -- Create policies for user files
    CREATE POLICY "Users can view own files" ON user_files
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "Users can insert own files" ON user_files
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update own files" ON user_files
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete own files" ON user_files
      FOR DELETE USING (auth.uid() = user_id);

    -- Create indexes
    CREATE INDEX idx_user_files_user_id ON user_files(user_id);
    CREATE INDEX idx_user_files_uploaded_at ON user_files(uploaded_at DESC);
  `;

  console.log("Run this SQL in your Supabase SQL Editor:");
  console.log(sql);
};

/**
 * Creates the storage bucket for user files
 * This should be done in the Supabase dashboard
 */
export const createFilesBucket = () => {
  console.log(`
    To create the storage bucket:
    
    1. Go to your Supabase Dashboard
    2. Navigate to Storage
    3. Click "New bucket"
    4. Bucket name: "user-files"
    5. Public: false (private by default)
    6. Configure the policies:
    
    -- Storage policies
    -- Allow users to upload to their own folder
    CREATE POLICY "Individual folders are private for users" ON storage.objects
      FOR SELECT TO authenticated
      USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);

    CREATE POLICY "Users can upload to own folder" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);

    CREATE POLICY "Users can update own files" ON storage.objects
      FOR UPDATE TO authenticated
      USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);

    CREATE POLICY "Users can delete own files" ON storage.objects
      FOR DELETE TO authenticated
      USING (bucket_id = 'user-files' AND (storage.foldername(name))[1] = auth.uid()::text);
  `);
};

export default { createFilesTable, createFilesBucket };