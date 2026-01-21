// API service for interacting with Supabase
import { supabase } from '../lib/supabaseClient';

export const todoApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  create: async (todoData) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          title: todoData.title,
          description: todoData.description || '',
          completed: false  
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  update: async (id, todoData) => {
    const { data, error } = await supabase
      .from('todos')
      .update(todoData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  delete: async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { message: 'Todo deleted successfully' };
  },
  toggleTodo: async (id) => {
    // First get the current todo
    const { data: currentTodo, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with flipped completed status
    const { data, error } = await supabase
      .from('todos')
      .update({ completed: !currentTodo.completed })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  getById: async (id) => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};