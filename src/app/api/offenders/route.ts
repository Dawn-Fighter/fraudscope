import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getData();
    // Return top 50 repeat offenders
    return NextResponse.json(data.repeatOffenders.slice(0, 50));
  } catch (error) {
    console.error('Error fetching repeat offenders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repeat offenders data' },
      { status: 500 }
    );
  }
}
