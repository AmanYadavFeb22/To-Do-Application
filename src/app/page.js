'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, ListTodo, CheckCircle2, Circle, LogOut } from 'lucide-react';
import TodoItem from './components/TodoItem';
import AddTodoDialog from './components/AddTodoDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { todoApi } from '../services/api';
import { getCurrentUser, signOut } from '../lib/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out.');
    }
  };

  // Fetch todos and check authentication status on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch todos
        await fetchTodos();
        
        // Check authentication status
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error during initial load:', err);
      }
    };
    
    fetchData();
  }, []);
  
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      // Ensure data is an array
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      // Check if the error is related to authentication
      if (err.message && (err.message.includes('User not authenticated') || err.message.includes('permission denied'))) {
        // Don't show error message or log for auth issues
        setTodos([]);
      } else {
        setError('Failed to fetch todos. Make sure the backend is running.');
        console.error('Error fetching todos:', err);
      }
      // Set todos to an empty array on error
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      const newTodo = await todoApi.create(todoData);
      setTodos(prevTodos => [{...newTodo, _id: newTodo.id}, ...prevTodos]);
    } catch (err) {
      // Check if the error is related to authentication
      if (err.message && (err.message.includes('User not authenticated') || err.message.includes('permission denied'))) {
        setError('Please log in to create todos.');
        router.push('/auth/login');
      } else {
        setError('Failed to create todo.');
      }
      console.error('Error creating todo:', err);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const updatedTodo = await todoApi.toggleTodo(id);
      setTodos(prevTodos => {
        const newTodos = [...prevTodos];
        const index = newTodos.findIndex(todo => (todo._id || todo.id) === id);
        if (index !== -1) {
          newTodos[index] = { ...updatedTodo, _id: updatedTodo.id };
        }
        return newTodos;
      });
    } catch (err) {
      // Check if the error is related to authentication
      if (err.message && (err.message.includes('User not authenticated') || err.message.includes('permission denied'))) {
        setError('Please log in to toggle todos.');
        router.push('/auth/login');
      } else {
        setError('Failed to toggle todo.');
      }
      console.error('Error toggling todo:', err);
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      const updatedTodo = await todoApi.update(id, todoData);
      setTodos(prevTodos => {
        const newTodos = [...prevTodos];
        const index = newTodos.findIndex(todo => (todo._id || todo.id) === id);
        if (index !== -1) {
          newTodos[index] = { ...updatedTodo, _id: updatedTodo.id };
        }
        return newTodos;
      });
    } catch (err) {
      // Check if the error is related to authentication
      if (err.message && (err.message.includes('User not authenticated') || err.message.includes('permission denied'))) {
        setError('Please log in to update todos.');
        router.push('/auth/login');
      } else {
        setError('Failed to update todo.');
      }
      console.error('Error updating todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await todoApi.delete(id);
      setTodos(prevTodos => prevTodos.filter(todo => (todo._id || todo.id) !== id));
    } catch (err) {
      // Check if the error is related to authentication
      if (err.message && (err.message.includes('User not authenticated') || err.message.includes('permission denied'))) {
        setError('Please log in to delete todos.');
        router.push('/auth/login');
      } else {
        setError('Failed to delete todo.');
      }
      console.error('Error deleting todo:', err);
    }
  };

  const filteredTodos = Array.isArray(todos) ? todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  }) : [];

  const stats = {
    total: Array.isArray(todos) ? todos.length : 0,
    active: Array.isArray(todos) ? todos.filter(t => !t.completed).length : 0,
    completed: Array.isArray(todos) ? todos.filter(t => t.completed).length : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-5xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            {/* <CheckSquare className="h-12 w-12 text-primary" /> */}
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Todo App
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Organize your tasks efficiently and stay productive
          </p>
          
          {user && (
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">
                Signed in as: <span className="font-medium">{user.email}</span>
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="h-8 w-8 p-0"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {/* <ListTodo className="h-4 w-4 text-blue-500" /> */}
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {/* <Circle className="h-4 w-4 text-orange-500" /> */}
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{stats.active}</div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {/* <CheckCircle2 className="h-4 w-4 text-green-500" /> */}
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
          <AddTodoDialog onAdd={handleAddTodo} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive animate-fade-in">
            <p className="font-medium">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTodos}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Todo List */}
        <div className="space-y-3">
          {loading ? (
            <Card className="p-8 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="h-6 w-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground">Loading todos...</p>
              </div>
            </Card>
          ) : filteredTodos.length === 0 ? (
            <Card className="p-12 text-center">
              {/* <ListTodo className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" /> */}
              <CardTitle className="mb-2">No todos found</CardTitle>
              <CardDescription className="mb-4">
                {filter === 'all'
                  ? "Get started by creating your first todo!"
                  : filter === 'active'
                  ? "No active tasks. Great job!"
                  : "No completed tasks yet. Keep going!"}
              </CardDescription>
              {filter !== 'all' && (
                <Button variant="outline" onClick={() => setFilter('all')}>
                  View All Todos
                </Button>
              )}
            </Card>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id || todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onUpdate={handleUpdateTodo}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Supabase & shadcn/ui</p>
        </div>
      </div>
    </div>
  );
}