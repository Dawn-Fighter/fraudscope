import { NextResponse } from 'next/server';
import { thresholdData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(thresholdData);
}
