import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getData();
    // Return top 100 impossible travel cases
    return NextResponse.json(data.impossibleTravel.slice(0, 100));
  } catch (error) {
    console.error('Error fetching impossible travel:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impossible travel data' },
      { status: 500 }
    );
  }
}
