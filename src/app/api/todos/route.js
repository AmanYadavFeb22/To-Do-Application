import { connectToDB } from '../../../lib/db';
import Todo from '../../../lib/todoModel';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDB();
    const todos = await Todo.find({}).sort({ createdAt: -1 });
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { title, description } = await request.json();
    
    await connectToDB();
    const newTodo = new Todo({ title, description: description || "" });
    const savedTodo = await newTodo.save();
    
    return NextResponse.json(savedTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}