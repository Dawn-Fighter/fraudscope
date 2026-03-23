import { NextResponse } from 'next/server';
import { merchantData } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(merchantData);
}
