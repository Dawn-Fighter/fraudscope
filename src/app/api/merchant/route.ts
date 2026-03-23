import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data.merchantFraud);
  } catch (error) {
    console.error('Error fetching merchant fraud:', error);
    return NextResponse.json(
      { error: 'Failed to fetch merchant fraud data' },
      { status: 500 }
    );
  }
}
