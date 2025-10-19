import Queue from 'bee-queue';

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
};

// Create queues
export const emailQueue = new Queue('email', {
  redis: redisConfig,
  removeOnSuccess: 10, // Keep last 10 successful jobs
  removeOnFailure: 5,  // Keep last 5 failed jobs
  activateDelayedJobs: true,
  retryDelay: 5000,    // 5 seconds between retries
  maxRetries: 3,       // Max 3 retries
});

export const waitlistQueue = new Queue('waitlist', {
  redis: redisConfig,
  removeOnSuccess: 10,
  removeOnFailure: 5,
  activateDelayedJobs: true,
  retryDelay: 10000,   // 10 seconds between retries
  maxRetries: 3,
});

// Queue event handlers for monitoring
emailQueue.on('ready', () => {
  console.log('📧 Email queue is ready');
});

emailQueue.on('error', (err) => {
  console.error('❌ Email queue error:', err);
});

emailQueue.on('job succeeded', (jobId, result) => {
  console.log(`✅ Email job ${jobId} succeeded:`, result);
});

emailQueue.on('job failed', (jobId, err) => {
  console.error(`❌ Email job ${jobId} failed:`, err);
});

waitlistQueue.on('ready', () => {
  console.log('📝 Waitlist queue is ready');
});

waitlistQueue.on('error', (err) => {
  console.error('❌ Waitlist queue error:', err);
});

waitlistQueue.on('job succeeded', (jobId, result) => {
  console.log(`✅ Waitlist job ${jobId} succeeded:`, result);
});

waitlistQueue.on('job failed', (jobId, err) => {
  console.error(`❌ Waitlist job ${jobId} failed:`, err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down queues...');
  await emailQueue.close();
  await waitlistQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down queues...');
  await emailQueue.close();
  await waitlistQueue.close();
  process.exit(0);
});