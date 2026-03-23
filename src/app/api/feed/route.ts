import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getData();
    // Return top 50 flagged transactions by amount
    return NextResponse.json(data.flaggedFeed.slice(0, 50));
  } catch (error) {
    console.error('Error fetching flagged feed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flagged transactions' },
      { status: 500 }
    );
  }
}
