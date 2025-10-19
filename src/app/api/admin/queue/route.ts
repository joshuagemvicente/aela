import { NextRequest, NextResponse } from 'next/server';
import { emailQueue, waitlistQueue } from '@/lib/queue';

// GET /api/admin/queue - Get queue statistics
export async function GET() {
  try {
    // Get email queue stats
    const emailStats = await emailQueue.checkHealth();
    const emailJobs = await emailQueue.getJobs('waiting', { start: 0, end: 9 });
    const emailFailedJobs = await emailQueue.getJobs('failed', { start: 0, end: 9 });

    // Get waitlist queue stats
    const waitlistStats = await waitlistQueue.checkHealth();
    const waitlistJobs = await waitlistQueue.getJobs('waiting', { start: 0, end: 9 });
    const waitlistFailedJobs = await waitlistQueue.getJobs('failed', { start: 0, end: 9 });

    return NextResponse.json({
      success: true,
      data: {
        email: {
          health: emailStats,
          waiting: emailJobs.length,
          failed: emailFailedJobs.length,
          recentJobs: emailJobs.map(job => ({
            id: job.id,
            data: job.data,
            created: job.createdAt,
          })),
          recentFailures: emailFailedJobs.map(job => ({
            id: job.id,
            data: job.data,
            error: job.error,
            failedAt: job.failedAt,
          })),
        },
        waitlist: {
          health: waitlistStats,
          waiting: waitlistJobs.length,
          failed: waitlistFailedJobs.length,
          recentJobs: waitlistJobs.map(job => ({
            id: job.id,
            data: job.data,
            created: job.createdAt,
          })),
          recentFailures: waitlistFailedJobs.map(job => ({
            id: job.id,
            data: job.data,
            error: job.error,
            failedAt: job.failedAt,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching queue stats:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch queue statistics' },
      { status: 500 }
    );
  }
}

// POST /api/admin/queue/retry - Retry failed jobs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { queue, jobId } = body;

    if (!queue || !jobId) {
      return NextResponse.json(
        { success: false, message: 'Queue and jobId are required' },
        { status: 400 }
      );
    }

    const targetQueue = queue === 'email' ? emailQueue : waitlistQueue;
    const job = await targetQueue.getJob(jobId);

    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found' },
        { status: 404 }
      );
    }

    await job.retry();

    return NextResponse.json({
      success: true,
      message: 'Job retried successfully',
    });
  } catch (error) {
    console.error('Error retrying job:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retry job' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/queue/clear - Clear failed jobs
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queue = searchParams.get('queue');

    if (!queue) {
      return NextResponse.json(
        { success: false, message: 'Queue parameter is required' },
        { status: 400 }
      );
    }

    const targetQueue = queue === 'email' ? emailQueue : waitlistQueue;
    
    // Get all failed jobs and remove them
    const failedJobs = await targetQueue.getJobs('failed', { start: 0, end: -1 });
    
    for (const job of failedJobs) {
      await job.remove();
    }

    return NextResponse.json({
      success: true,
      message: `Cleared ${failedJobs.length} failed jobs from ${queue} queue`,
    });
  } catch (error) {
    console.error('Error clearing failed jobs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear failed jobs' },
      { status: 500 }
    );
  }
}