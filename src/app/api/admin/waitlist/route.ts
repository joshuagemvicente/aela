import { NextRequest, NextResponse } from 'next/server';
import { sendWaitlistUpdate, sendWaitlistMemberUpdate, getWaitlistStats } from '@/lib/actions/waitlist';
import { z } from 'zod';

const sendUpdateSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
});

const sendMemberUpdateSchema = z.object({
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
});

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

// POST /api/admin/waitlist - Send bulk update email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = sendUpdateSchema.parse(body);

    const result = await sendWaitlistUpdate(message);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: {
        processed: result.processed,
        failed: result.failed,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error sending waitlist update:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send waitlist update' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/waitlist - Send update to specific member
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, message } = sendMemberUpdateSchema.parse(body);

    const result = await sendWaitlistMemberUpdate(email, message);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: {
        position: result.position,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid input data', errors: error.errors },
        { status: 400 }
      );
    }

    console.error('Error sending member update:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send member update' },
      { status: 500 }
    );
  }
}