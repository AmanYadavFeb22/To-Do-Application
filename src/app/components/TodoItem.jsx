import React, { useState } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { cn } from '@/lib/utils';

const TodoItem = ({ todo, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');

  const handleSave = () => {
    onUpdate(todo._id, { 
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
    <div className="group p-4 bg-card border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in hover:border-primary/50">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo._id)}
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
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(todo.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
            onClick={() => onDelete(todo._id)}
            className="h-8 w-8 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;