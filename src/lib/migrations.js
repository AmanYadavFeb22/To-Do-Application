// Database migration for adding file_url to todos table

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Adds file_url column to todos table
 * Run this once in your Supabase SQL Editor
 */
export const addFileUrlColumn = async () => {
  const sql = `
    -- Add file_url column to todos table
    ALTER TABLE todos ADD COLUMN IF NOT EXISTS file_url TEXT;
    
    -- Update RLS policies to include the new column
    -- Note: You may need to adjust these depending on your existing policies
  `;

  console.log("Run this SQL in your Supabase SQL Editor:");
  console.log(sql);
};

/**
 * Creates the updated todos table (if needed)
 * Only run this if you need to recreate the table
 */
export const createUpdatedTodosTable = async () => {
  const sql = `
    -- Drop existing table if needed (BE CAREFUL - this will delete all data)
    -- DROP TABLE IF EXISTS todos;
    
    -- Create updated todos table with file_url column
    CREATE TABLE IF NOT EXISTS todos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      file_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Enable Row Level Security
    ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view own todos" ON todos
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own todos" ON todos
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update own todos" ON todos
      FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete own todos" ON todos
      FOR DELETE USING (auth.uid() = user_id);
    
    -- Create indexes
    CREATE INDEX idx_todos_user_id ON todos(user_id);
    CREATE INDEX idx_todos_completed ON todos(completed);
    CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
  `;

  console.log("Run this SQL in your Supabase SQL Editor if recreating the table:");
  console.log(sql);
};

export default { addFileUrlColumn, createUpdatedTodosTable };