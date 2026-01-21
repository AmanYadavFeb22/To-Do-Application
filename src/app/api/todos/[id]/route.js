import { connectToDB } from '../../../../lib/db';
import Todo from '../../../../lib/todoModel';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    await connectToDB();
    const todo = await Todo.findById(id);
    
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return NextResponse.json({ error: 'Failed to fetch todo' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const requestData = await request.json();
    
    await connectToDB();
    
    // Check if this is a toggle request (only 'completed' field sent)
    if (Object.keys(requestData).length === 1 && requestData.hasOwnProperty('completed')) {
      // If completed is true, we're toggling, so fetch current status and flip it
      const currentTodo = await Todo.findById(id);
      if (!currentTodo) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
      }
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { completed: !currentTodo.completed },
        { new: true }
      );

      return NextResponse.json(updatedTodo);
    } else {
      // Regular update request
      const { title, description, completed } = requestData;
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { title, description, completed },
        { new: true }
      );
      
      if (!updatedTodo) {
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
      }
      
      return NextResponse.json(updatedTodo);
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    await connectToDB();
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}