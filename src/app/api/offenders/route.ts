import { NextResponse } from 'next/server';
import { offendersData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(offendersData);
}
