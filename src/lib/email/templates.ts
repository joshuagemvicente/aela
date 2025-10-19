export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface WaitlistWelcomeEmailData {
  email: string;
  position: number;
  totalCount: number;
}

export interface WaitlistUpdateEmailData {
  email: string;
  position: number;
  totalCount: number;
  message?: string;
}

/**
 * Generate welcome email template for new waitlist signups
 */
export function generateWaitlistWelcomeEmail(data: WaitlistWelcomeEmailData): EmailTemplate {
  const { email, position, totalCount } = data;
  
  const subject = `Welcome to Aela! You're #${position.toLocaleString()} on the waitlist`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Aela</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .position-badge { display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 18px; margin: 20px 0; }
        .features { margin: 30px 0; }
        .feature { display: flex; align-items: center; margin: 15px 0; }
        .feature-icon { width: 24px; height: 24px; margin-right: 12px; color: #667eea; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
        .social-links { margin: 20px 0; }
        .social-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Aela!</h1>
          <p>You're now on the waitlist for the future of note-taking</p>
        </div>
        
        <div class="content">
          <h2>You're in! 🎉</h2>
          <p>Thanks for joining the Aela waitlist. We're excited to have you on this journey with us.</p>
          
          <div style="text-align: center;">
            <div class="position-badge">Position #${position.toLocaleString()}</div>
            <p>Out of ${totalCount.toLocaleString()} people waiting</p>
          </div>
          
          <div class="features">
            <h3>What to expect:</h3>
            <div class="feature">
              <span class="feature-icon">🚀</span>
              <span>Early access to the beta release</span>
            </div>
            <div class="feature">
              <span class="feature-icon">💬</span>
              <span>Priority support and direct feedback channel</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🎁</span>
              <span>Exclusive founding member benefits</span>
            </div>
            <div class="feature">
              <span class="feature-icon">📧</span>
              <span>Regular updates on our progress</span>
            </div>
          </div>
          
          <p>We'll keep you updated on our progress and let you know as soon as Aela is ready for you to try.</p>
          
          <div style="text-align: center;">
            <a href="https://aela.app" class="cta-button">Visit Aela</a>
          </div>
        </div>
        
        <div class="footer">
          <p>Thanks for your interest in Aela!</p>
          <div class="social-links">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </div>
          <p>© ${new Date().getFullYear()} Aela. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Welcome to Aela!

You're now on the waitlist for the future of note-taking.

Position: #${position.toLocaleString()}
Total waitlist: ${totalCount.toLocaleString()} people

What to expect:
- Early access to the beta release
- Priority support and direct feedback channel
- Exclusive founding member benefits
- Regular updates on our progress

We'll keep you updated on our progress and let you know as soon as Aela is ready for you to try.

Visit us at: https://aela.app

Thanks for your interest in Aela!

© ${new Date().getFullYear()} Aela. All rights reserved.
  `;
  
  return { subject, html, text };
}

/**
 * Generate update email template for waitlist position changes
 */
export function generateWaitlistUpdateEmail(data: WaitlistUpdateEmailData): EmailTemplate {
  const { email, position, totalCount, message } = data;
  
  const subject = `Aela Update: You're now #${position.toLocaleString()} on the waitlist`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Aela Waitlist Update</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .position-badge { display: inline-block; background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 18px; margin: 20px 0; }
        .update-message { background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Aela Update</h1>
          <p>Your waitlist position has been updated</p>
        </div>
        
        <div class="content">
          <h2>Position Update 📈</h2>
          <p>Great news! Your position on the Aela waitlist has moved up.</p>
          
          <div style="text-align: center;">
            <div class="position-badge">Position #${position.toLocaleString()}</div>
            <p>Out of ${totalCount.toLocaleString()} people waiting</p>
          </div>
          
          ${message ? `
            <div class="update-message">
              <strong>Update:</strong> ${message}
            </div>
          ` : ''}
          
          <p>We're working hard to get Aela ready for you. Stay tuned for more updates!</p>
        </div>
        
        <div class="footer">
          <p>Thanks for your patience!</p>
          <p>© ${new Date().getFullYear()} Aela. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Aela Waitlist Update

Your waitlist position has been updated!

Position: #${position.toLocaleString()}
Total waitlist: ${totalCount.toLocaleString()} people

${message ? `Update: ${message}` : ''}

We're working hard to get Aela ready for you. Stay tuned for more updates!

Thanks for your patience!

© ${new Date().getFullYear()} Aela. All rights reserved.
  `;
  
  return { subject, html, text };
}