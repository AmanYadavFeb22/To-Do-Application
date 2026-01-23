import React, { useState } from 'react';
import { Plus, Upload, X, FileIcon, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';


const AddTodoDialog = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const router = useRouter();

  const handleOpen = async () => {
    setOpen(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      
      // Create preview URL for images
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileName('');
    setPreviewUrl(null);
    // Reset the file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (title.trim()) {
      // Prepare todo data with file info if available
      const todoData = {
        title: title.trim(),
        description: description.trim(),
      };
      
      // Add file information if file is selected
      if (file) {
        todoData.file = file;
        todoData.fileName = fileName;
        todoData.fileType = file.type;
        todoData.fileSize = file.size;
      }
      
      await onAdd(todoData);
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setFileName('');
      setPreviewUrl(null);
      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="shadow-lg hover:shadow-xl transition-shadow duration-200"
          onClick={handleOpen}
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Todo</DialogTitle>
            <DialogDescription>
              Add a new task to your todo list. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter todo title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            {/* File Upload Section */}
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Attach File (Optional)</Label>
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <Label htmlFor="file-upload" className="cursor-pointer block">
                    <span className="text-sm font-medium text-gray-700">Choose a file</span>
                    <Input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">Images, PDF, DOC, TXT up to 10MB</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      {previewUrl ? (
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-8 h-8 object-cover rounded"
                        />
                      ) : (
                        <FileIcon className="h-5 w-5 text-gray-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium truncate max-w-xs">{fileName}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {previewUrl && (
                    <div className="border rounded-lg overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="File preview" 
                        className="w-full h-32 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            {/* Upload Button - positioned to the left of Cancel */}
            {file && (
              <Button
                type="button"
                variant="outline"
                onClick={removeFile}
              >
                <X className="h-4 w-4 mr-2" />
                Remove File
              </Button>
            )}
            <Button type="submit" disabled={!title.trim()}>
              Create Todo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoDialog;
