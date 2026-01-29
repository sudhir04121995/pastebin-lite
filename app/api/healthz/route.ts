
import connectToDatabase from '@/lib/db';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Try to connect to MongoDB
    await connectToDatabase();
    
    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { ok: false, error: 'Database connection failed' },
      { status: 500 }
    );
  }
}