

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { Paste } from '@/lib/models/Paste';
import { generateSlug } from '@/lib/utils';
import connectToDatabase from '@/lib/db';


const createPasteSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  ttl_seconds: z.number().int().min(1).optional(),
  max_views: z.number().int().min(1).optional(),
});

// Handle POST request - Create a new paste
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validate input
    const validation = createPasteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.issues },
        { status: 400 }
      );
    }
    
    const { content, ttl_seconds, max_views } = validation.data;
    
    // Generate unique slug
    const slug = generateSlug();
    
    // Calculate expiry date if TTL is provided
    let expiresAt: Date | undefined;
    if (ttl_seconds) {
      const now = new Date();
      // Handle test mode for deterministic expiry
      if (process.env.TEST_MODE === '1') {
        expiresAt = new Date(now.getTime() + ttl_seconds * 1000);
      } else {
        expiresAt = new Date(now.getTime() + ttl_seconds * 1000);
      }
    }
    
    // Create paste
    const paste = await Paste.create({
      content,
      slug,
      maxViews: max_views,
      expiresAt,
      views: 0,
    });
    
    // Generate URL
    const baseUrl = process.env.MONGODB_URI|| request.nextUrl.origin;
    const url = `${baseUrl}/p/${paste.slug}`;
    
    return NextResponse.json(
      {
        id: paste.slug,
        url,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating paste:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET request to list pastes (if needed)
export async function GET() {
  return NextResponse.json(
    { error: 'Method not implemented. Use POST to create a paste.' },
    { status: 405 }
  );
}

// Handle other methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}