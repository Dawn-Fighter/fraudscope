import { NextResponse } from 'next/server';
import { getData } from '@/lib/data';

export async function GET() {
  try {
    const data = await getData();
    // Returns 7x24 grid: [dayOfWeek][hour] = fraud count
    // Day 0 = Sunday, Day 6 = Saturday
    return NextResponse.json({
      heatmap: data.heatmap,
      labels: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        hours: Array.from({ length: 24 }, (_, i) => 
          i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`
        ),
      },
    });
  } catch (error) {
    console.error('Error fetching heatmap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch heatmap data' },
      { status: 500 }
    );
  }
}
