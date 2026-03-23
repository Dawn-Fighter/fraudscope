import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getData();
    
    // Safety check - Calculate total risk amount dynamically since it isn't in Stats type originally
    const flaggedTxns = data.transactions.filter(t => t.status === 'Flagged');
    const totalRiskAmount = flaggedTxns.reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      ...data.stats,
      totalRiskAmount
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
