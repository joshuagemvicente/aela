import nodemailer from "nodemailer";
import { EmailTemplate } from "./templates";

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP configuration error:", error);
  } else {
    console.log("✅ SMTP server is ready to take our messages");
  }
});

export interface EmailJobData {
  to: string;
  template: EmailTemplate;
  from?: string;
}

/**
 * Send email using the configured SMTP transporter
 */
export async function sendEmail(
  data: EmailJobData,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const mailOptions = {
      from: data.from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to: data.to,
      subject: data.template.subject,
      text: data.template.text,
      html: data.template.html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent successfully to ${data.to}:`, info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error(`❌ Failed to send email to ${data.to}:`, errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send bulk emails (for newsletters, updates, etc.)
 */
export async function sendBulkEmails(emails: EmailJobData[]): Promise<{
  success: number;
  failed: number;
  results: Array<{ email: string; success: boolean; error?: string }>;
}> {
  const results = await Promise.allSettled(
    emails.map(async (emailData) => {
      const result = await sendEmail(emailData);
      return {
        email: emailData.to,
        success: result.success,
        error: result.error,
      };
    }),
  );

  const success = results.filter(
    (r) => r.status === "fulfilled" && r.value.success,
  ).length;
  const failed = results.length - success;

  const emailResults = results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        email: emails[index].to,
        success: false,
        error: result.reason?.message || "Unknown error",
      };
    }
  });

  return {
    success,
    failed,
    results: emailResults,
  };
}

/**
 * Test email configuration
 */
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("❌ Email configuration test failed:", error);
    return false;
  }
}

