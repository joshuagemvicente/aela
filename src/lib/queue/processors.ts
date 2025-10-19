import { emailQueue, waitlistQueue } from '../queue';
import { sendEmail, sendBulkEmails } from '../email/service';
import { generateWaitlistWelcomeEmail, generateWaitlistUpdateEmail } from '../email/templates';
import { prisma } from '../prisma';

// Email queue processor
emailQueue.process(async (job) => {
  const { to, template, from } = job.data;
  
  console.log(`📧 Processing email job for ${to}`);
  
  try {
    const result = await sendEmail({ to, template, from });
    
    if (result.success) {
      console.log(`✅ Email sent successfully to ${to}`);
      return { success: true, messageId: result.messageId };
    } else {
      throw new Error(result.error || 'Failed to send email');
    }
  } catch (error) {
    console.error(`❌ Email job failed for ${to}:`, error);
    throw error;
  }
});

// Waitlist queue processor
waitlistQueue.process(async (job) => {
  const { type, data } = job.data;
  
  console.log(`📝 Processing waitlist job: ${type}`);
  
  try {
    switch (type) {
      case 'welcome':
        return await processWelcomeEmail(data);
      case 'update':
        return await processUpdateEmail(data);
      case 'bulk_update':
        return await processBulkUpdate(data);
      default:
        throw new Error(`Unknown waitlist job type: ${type}`);
    }
  } catch (error) {
    console.error(`❌ Waitlist job failed (${type}):`, error);
    throw error;
  }
});

/**
 * Process welcome email for new waitlist signup
 */
async function processWelcomeEmail(data: {
  email: string;
  position: number;
  totalCount: number;
}) {
  const { email, position, totalCount } = data;
  
  // Generate email template
  const template = generateWaitlistWelcomeEmail({ email, position, totalCount });
  
  // Send email
  const result = await sendEmail({
    to: email,
    template,
  });
  
  if (!result.success) {
    throw new Error(`Failed to send welcome email: ${result.error}`);
  }
  
  // Log the welcome email sent
  console.log(`✅ Welcome email sent to ${email} (position #${position})`);
  
  return {
    success: true,
    email,
    position,
    messageId: result.messageId,
  };
}

/**
 * Process update email for waitlist position change
 */
async function processUpdateEmail(data: {
  email: string;
  position: number;
  totalCount: number;
  message?: string;
}) {
  const { email, position, totalCount, message } = data;
  
  // Generate email template
  const template = generateWaitlistUpdateEmail({ email, position, totalCount, message });
  
  // Send email
  const result = await sendEmail({
    to: email,
    template,
  });
  
  if (!result.success) {
    throw new Error(`Failed to send update email: ${result.error}`);
  }
  
  // Log the update email sent
  console.log(`✅ Update email sent to ${email} (position #${position})`);
  
  return {
    success: true,
    email,
    position,
    messageId: result.messageId,
  };
}

/**
 * Process bulk update for all waitlist members
 */
async function processBulkUpdate(data: {
  message: string;
  appSlug?: string;
}) {
  const { message, appSlug = 'aela' } = data;
  
  // Get all waitlist entries
  const waitlistEntries = await prisma.waitlistEntry.findMany({
    where: { appSlug },
    orderBy: { position: 'asc' },
  });
  
  if (waitlistEntries.length === 0) {
    console.log('📝 No waitlist entries found for bulk update');
    return { success: true, processed: 0 };
  }
  
  const totalCount = waitlistEntries.length;
  
  // Prepare email data for all entries
  const emailData = waitlistEntries.map((entry, index) => {
    const template = generateWaitlistUpdateEmail({
      email: entry.email,
      position: entry.position,
      totalCount,
      message,
    });
    
    return {
      to: entry.email,
      template,
    };
  });
  
  // Send bulk emails
  const result = await sendBulkEmails(emailData);
  
  console.log(`✅ Bulk update completed: ${result.success} sent, ${result.failed} failed`);
  
  return {
    success: true,
    processed: result.success,
    failed: result.failed,
    total: emailData.length,
  };
}

// Export job creators for easy use
export const emailJobs = {
  /**
   * Add email job to queue
   */
  async sendEmail(to: string, template: any, from?: string) {
    return emailQueue.createJob({ to, template, from }).save();
  },
  
  /**
   * Add welcome email job to waitlist queue
   */
  async sendWelcomeEmail(email: string, position: number, totalCount: number) {
    return waitlistQueue.createJob({
      type: 'welcome',
      data: { email, position, totalCount },
    }).save();
  },
  
  /**
   * Add update email job to waitlist queue
   */
  async sendUpdateEmail(email: string, position: number, totalCount: number, message?: string) {
    return waitlistQueue.createJob({
      type: 'update',
      data: { email, position, totalCount, message },
    }).save();
  },
  
  /**
   * Add bulk update job to waitlist queue
   */
  async sendBulkUpdate(message: string, appSlug?: string) {
    return waitlistQueue.createJob({
      type: 'bulk_update',
      data: { message, appSlug },
    }).save();
  },
};