import { NextResponse } from 'next/server';
import { velocityData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(velocityData);
}
