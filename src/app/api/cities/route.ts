import { NextResponse } from 'next/server';
import { cityFraudData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(cityFraudData);
}
