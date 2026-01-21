// API service for interacting with Next.js API routes
const API_BASE_URL = '/api/todos';

export const todoApi = {
  getAll: async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch todos: ${response.status}`);
    }
    return response.json();
  },
  create: async (todoData) => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create todo: ${response.status}`);
    }
    return response.json();
  },
  update: async (id, todoData) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.status}`);
    }
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.status}`);
    }
    return response.json();
  },
  toggleTodo: async (id) => {
    // First, get the current todo
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todo for toggle: ${response.status}`);
    }
    const currentTodo = await response.json();
    
    // Then send PUT request with flipped completed status
    const putResponse = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: currentTodo.title,
        description: currentTodo.description,
        completed: !currentTodo.completed
      })
    });
    
    if (!putResponse.ok) {
      throw new Error(`Failed to toggle todo: ${putResponse.status}`);
    }
    
    return putResponse.json();
  }
};