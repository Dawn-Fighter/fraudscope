import { NextResponse } from 'next/server';
import { feedData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(feedData);
}
