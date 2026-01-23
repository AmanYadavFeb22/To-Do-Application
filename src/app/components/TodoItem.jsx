import React, { useState } from 'react';
import { Trash2, Edit2, Check, X, Eye, FileIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    onUpdate(todo._id || todo.id, { 
      title: editTitle, 
      description: editDescription,
      completed: todo.completed 
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const hasFile = todo.file_url || todo.image_url;

  if (isEditing) {
    return (
      <div className="group p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
        <div className="space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Todo title"
            className="font-medium"
          />
          <Textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            className="min-h-[60px]"
          />
          <div className="flex gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!editTitle.trim()}
            >
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in hover:border-primary/50">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggle(todo._id || todo.id)}
            className="mt-1"
          />  
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "font-medium text-lg transition-all duration-200",
                todo.completed && "line-through text-muted-foreground"
              )}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p
                className={cn(
                  "text-sm text-muted-foreground mt-1",
                  todo.completed && "line-through"
                )}
              >
                {todo.description}
              </p>
            )}
            
            {/* File Preview Section */}
            {hasFile && (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  {todo.file_url && todo.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img 
                      src={todo.file_url} 
                      alt="Todo attachment" 
                      className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => setShowPreview(true)}
                    />
                  ) : (
                    <div 
                      className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
                      onClick={() => setShowPreview(true)}
                    >
                      <FileIcon className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-blue-600">View Attachment</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              {todo.createdAt ? new Date(todo.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : todo.created_at ? new Date(todo.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : ''}
            </p>
            {todo.created_at && (
              <p className="text-xs text-muted-foreground mt-1">
                Created: {new Date(todo.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            )}
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {hasFile && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowPreview(true)}
                className="h-8 w-8"
                title="Preview attachment"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(todo._id || todo.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <div className="text-center space-y-2">
              <div className="text-left">
                <h3 className="text-sm font-bold text-black uppercase tracking-wide">Title :</h3>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {todo.title}
                </DialogTitle>
              </div>
              {todo.description && (
                <div className="text-left">
                  <h4 className="text-sm font-bold text-black uppercase tracking-wide">Description :</h4>
                  <p className="text-gray-700 mt-1 break-words">
                    {todo.description}
                  </p>
                </div>
              )}
            </div>
          </DialogHeader>
          
          <div className="flex justify-center mt-6">
            {todo.file_url && todo.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img 
                src={todo.file_url} 
                alt={todo.title} 
                className="max-w-full max-h-[50vh] object-contain border rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-center py-12">
                <FileIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Attachment Preview</p>
                <p className="text-sm text-gray-500 mb-6">
                  Preview not available for this file type
                </p>
                <Button 
                  className="mt-4"
                  onClick={() => window.open(todo.file_url, '_blank')}
                >
                  Download File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TodoItem;