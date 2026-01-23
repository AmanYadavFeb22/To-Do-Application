import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

class FileService {
  constructor() {
    this.bucketName = 'user-files';
  }

  // Upload file to Supabase storage
  async uploadFile(file, userId, customName = null) {
    try {
      // Generate unique filename with user ID
      const fileName = customName || `${userId}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName);

      // Store file metadata in database
      const { data: fileRecord, error: dbError } = await supabase
        .from('user_files')
        .insert({
          user_id: userId,
          file_name: file.name,
          file_path: fileName,
          file_url: publicUrl,
          file_size: file.size,
          file_type: file.type,
          uploaded_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) {
        // If DB insert fails, also delete the uploaded file
        if (data) {
          await supabase.storage.from(this.bucketName).remove([fileName]);
        }
        throw dbError;
      }

      return {
        ...fileRecord,
        file_url: publicUrl
      };
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  }

  // Get user's files
  async getUserFiles(userId) {
    try {
      const { data, error } = await supabase
        .from('user_files')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Get user files error:', error);
      throw error;
    }
  }

  // Delete file from storage and database
  async deleteFile(fileId, userId) {
    try {
      // First, get the file record to get the file path
      const { data: fileRecord, error: fetchError } = await supabase
        .from('user_files')
        .select('file_path')
        .eq('id', fileId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.bucketName)
        .remove([fileRecord.file_path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_files')
        .delete()
        .eq('id', fileId)
        .eq('user_id', userId);

      if (dbError) {
        throw dbError;
      }

      return true;
    } catch (error) {
      console.error('File delete error:', error);
      throw error;
    }
  }



  // Check if bucket exists and create if it doesn't (requires admin privileges)
  async ensureBucketExists() {
    try {
      // This would typically be done in Supabase dashboard
      // For now, just verify we can access the bucket
      const { data, error } = await supabase.storage.from(this.bucketName).list('', {
        limit: 1,
        offset: 0
      });

      if (error && error.message.includes('does not exist')) {
        console.warn(`Bucket ${this.bucketName} does not exist. Please create it in Supabase dashboard.`);
      }
    } catch (error) {
      console.error('Bucket access error:', error);
    }
  }
}

export default new FileService();