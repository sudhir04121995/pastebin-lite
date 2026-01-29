

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Paste } from '@/lib/models/Paste';
import { formatDate } from '@/lib/utils';

// Handle GET request for a specific paste
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    // Await the params promise
    const { id } = await params;
    console.log('Fetching paste with slug:', id);
    
    // Find paste by slug
    const paste = await Paste.findOne({ slug: id });
    console.log('Found paste:', paste ? paste.slug : 'none');
    
    // Check if paste exists
    if (!paste) {
      console.log('Paste not found');
      return NextResponse.json(
        { error: 'Paste not found' },
        { status: 404 }
      );
    }
    
    console.log('Paste details:', {
      contentLength: paste.content.length,
      views: paste.views,
      maxViews: paste.maxViews,
      expiresAt: paste.expiresAt,
      isExpired: paste.expiresAt && new Date(paste.expiresAt) <= new Date(),
    });
    
    // Check if paste is available using the instance method
    const isAvailable = paste.isAvailable();
    console.log('Is paste available?', isAvailable);
    
    if (!isAvailable) {
      console.log('Paste is not available');
      return NextResponse.json(
        { error: 'Paste unavailable' },
        { status: 404 }
      );
    }
    
    // Increment view count
    await paste.incrementViews();
    console.log('View count incremented to:', paste.views);
    
    // Prepare response
    const response = {
      content: paste.content,
      remaining_views: paste.maxViews ? paste.maxViews - paste.views : null,
      expires_at: paste.expiresAt ? formatDate(paste.expiresAt) : null,
    };
    
    console.log('Sending response:', {
      contentLength: response.content.length,
      remaining_views: response.remaining_views,
      expires_at: response.expires_at,
    });
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle other methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

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