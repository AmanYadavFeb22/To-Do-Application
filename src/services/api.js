// API service for interacting with Supabase
import { supabase } from '../lib/supabaseClient';

// Helper function to get current user ID
const getCurrentUserId = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('User not authenticated');
  }
  return user.id;
};

export const todoApi = {
  getAll: async () => {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  create: async (todoData) => {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title: todoData.title,
          description: todoData.description || '',
          user_id: userId,
          completed: false  
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  update: async (id, todoData) => {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('todos')
      .update(todoData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const userId = await getCurrentUserId();
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { message: 'Todo deleted successfully' };
  },
  toggleTodo: async (id) => {
    const userId = await getCurrentUserId();
    
    // First get the current todo to ensure it belongs to the user
    const { data: currentTodo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with flipped completed status
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !currentTodo.completed })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  getById: async (id) => {
    const userId = await getCurrentUserId();
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
};