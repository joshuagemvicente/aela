# Queue System Setup

This document explains how to set up and use the Bee-Queue with Redis for email processing in Aela.

## Overview

The queue system handles asynchronous email processing for:
- Welcome emails for new waitlist signups
- Update emails for waitlist position changes
- Bulk update emails for all waitlist members
- General email notifications

## Prerequisites

1. **Redis Server**: Install and run Redis locally or use a cloud service
2. **SMTP Configuration**: Set up email service (Gmail, SendGrid, etc.)
3. **Environment Variables**: Configure all required environment variables

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy from `.env.example`):
```bash
cp .env.example .env.local
```

3. Configure your `.env.local` file with your Redis and SMTP settings.

## Environment Variables

### Redis Configuration
```env
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""  # Leave empty if no password
REDIS_DB="0"       # Database number (0-15)
```

### SMTP Configuration
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"  # true for 465, false for other ports
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"  # Use app password for Gmail
SMTP_FROM="Aela <noreply@aela.app>"
```

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use the app password as `SMTP_PASS`

## Running the Queue System

### Development Mode
Run both the Next.js app and queue worker:
```bash
npm run queue:dev
```

### Production Mode
1. Start the Next.js application:
```bash
npm run build
npm run start
```

2. Start the queue worker (in a separate terminal):
```bash
npm run queue:worker
```

### Docker (Optional)
You can also run Redis in Docker:
```bash
docker run -d -p 6379:6379 redis:alpine
```

## Queue Management

### API Endpoints

#### Get Queue Statistics
```bash
GET /api/admin/queue
```

#### Retry Failed Jobs
```bash
POST /api/admin/queue/retry
Content-Type: application/json

{
  "queue": "email",
  "jobId": "job-id-here"
}
```

#### Clear Failed Jobs
```bash
DELETE /api/admin/queue/clear?queue=email
```

### Waitlist Management

#### Send Bulk Update
```bash
POST /api/admin/waitlist
Content-Type: application/json

{
  "message": "We're launching soon! Get ready for early access."
}
```

#### Send Individual Update
```bash
PUT /api/admin/waitlist
Content-Type: application/json

{
  "email": "user@example.com",
  "message": "Your position has moved up!"
}
```

#### Get Waitlist Statistics
```bash
GET /api/admin/waitlist
```

## Queue Architecture

### Email Queue
- **Purpose**: General email sending
- **Jobs**: Welcome emails, notifications, etc.
- **Retry**: 3 attempts with 5-second delay
- **Cleanup**: Keeps last 10 successful, 5 failed jobs

### Waitlist Queue
- **Purpose**: Waitlist-specific email processing
- **Jobs**: Welcome, updates, bulk notifications
- **Retry**: 3 attempts with 10-second delay
- **Cleanup**: Keeps last 10 successful, 5 failed jobs

## Email Templates

### Welcome Email
- Sent when user joins waitlist
- Includes position and total count
- Beautiful HTML template with responsive design

### Update Email
- Sent for position changes or announcements
- Customizable message content
- Consistent branding

## Monitoring and Debugging

### Queue Health
Check queue health and job status:
```bash
# curl httpapi/admin/queue
```

### Logs
Monitor console output for:
- ✅ Successful job processing
- ❌ Failed jobs with error details
- 📧 Email sending confirmations

### Common Issues

1. **Redis Connection Failed**
   - Check Redis is running
   - Verify connection settings
   - Check firewall/network access

2. **SMTP Authentication Failed**
   - Verify email credentials
   - Check app password for Gmail
   - Ensure 2FA is enabled

3. **Jobs Not Processing**
   - Check queue worker is running
   - Verify Redis connection
   - Check job data format

## Production Considerations

### Scaling
- Run multiple queue workers for high volume
- Use Redis Cluster for high availability
- Monitor queue length and processing time

### Security
- Use environment variables for all secrets
- Implement proper authentication for admin APIs
- Use TLS for Redis connections in production

### Monitoring
- Set up alerts for failed jobs
- Monitor queue length and processing time
- Track email delivery rates

## Development Tips

### Testing Emails
1. Use a test email service (Mailtrap, etc.)
2. Check spam folder
3. Verify email templates render correctly

### Debugging Jobs
1. Check job data in Redis
2. Review error logs
3. Use queue monitoring APIs

### Local Development
1. Use `npm run queue:dev` for convenience
2. Check console output for job processing
3. Use admin APIs to test functionality

## Troubleshooting

### Queue Worker Won't Start
- Check Redis connection
- Verify environment variables
- Check for port conflicts

### Emails Not Sending
- Verify SMTP configuration
- Check email service limits
- Review error logs

### Jobs Stuck in Queue
- Check Redis memory usage
- Verify queue worker is running
- Check for infinite loops in processors

## Support

For issues or questions:
1. Check the logs first
2. Verify configuration
3. Test with simple email first
4. Check Redis and SMTP connectivity