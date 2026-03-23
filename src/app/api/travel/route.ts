import { NextResponse } from 'next/server';
import { travelData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(travelData);
}
