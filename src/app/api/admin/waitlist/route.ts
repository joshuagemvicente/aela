import { NextResponse } from 'next/server';
import { getWaitlistStats } from '@/lib/actions/waitlist';

// GET /api/admin/waitlist - Get waitlist statistics
export async function GET() {
  try {
    const stats = await getWaitlistStats();
    
    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch waitlist statistics' },
      { status: 500 }
    );
  }
}