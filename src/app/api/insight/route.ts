import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    critical: "Multiple repeat offenders remain active",
    pattern: "Fraud concentrated in specific merchant categories",
    recommend: "Apply threshold-based filtering"
  });
}
