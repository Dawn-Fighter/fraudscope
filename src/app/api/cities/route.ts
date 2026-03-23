import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getData();
    return NextResponse.json(data.cityFraud);
  } catch (error) {
    console.error('Error fetching city fraud:', error);
    return NextResponse.json(
      { error: 'Failed to fetch city fraud data' },
      { status: 500 }
    );
  }
}
