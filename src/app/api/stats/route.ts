import { NextResponse } from 'next/server';
import { statsData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(statsData);
}
