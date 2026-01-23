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
          file_url: todoData.file_url || null,
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
    
    // First, get the todo to check if it has an associated file
    const { data: todo, error: fetchError } = await supabase
      .from('todos')
      .select('id, file_url')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // If todo has a file_url, delete the file from storage and user_files table
    if (todo.file_url) {
      try {
        // First, find the file record in user_files table using the file_url
        const { data: fileRecord, error: fileFetchError } = await supabase
          .from('user_files')
          .select('id, file_path')
          .eq('file_url', todo.file_url)
          .single();
        
        if (!fileFetchError && fileRecord) {
          // Delete from storage
          const { error: storageError } = await supabase.storage
            .from('user-files')
            .remove([fileRecord.file_path]);
          
          if (storageError) {
            console.warn('Failed to delete file from storage:', storageError);
          }
          
          // Delete file record from user_files table
          const { error: fileDeleteError } = await supabase
            .from('user_files')
            .delete()
            .eq('id', fileRecord.id);
          
          if (fileDeleteError) {
            console.warn('Failed to delete file record:', fileDeleteError);
          }
        }
      } catch (fileError) {
        console.warn('Error handling file deletion:', fileError);
        // Continue with todo deletion even if file deletion fails
      }
    }
    
    // Delete the todo
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