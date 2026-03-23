import { NextResponse } from 'next/server';
import { cityPairsData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(cityPairsData);
}
