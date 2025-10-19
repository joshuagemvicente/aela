"use server"

import { prisma } from "@/lib/prisma"
import { waitlistSchema, type WaitlistInput } from "@/lib/validations/waitlist"
import { emailJobs } from "@/lib/queue/processors"

export type WaitlistResult = {
  success: boolean
  position?: number
  message?: string
}

const DEFAULT_APP_SLUG = "aela"

/**
 * Server action to join the waitlist
 */
export async function joinWaitlist(formData: FormData): Promise<WaitlistResult> {
  const rawData = {
    email: formData.get("email") as string,
  }

  const validatedData = waitlistSchema.safeParse(rawData)
  
  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors)[0]?.[0]
    return {
      success: false,
      message: firstError || "Invalid email address",
    }
  }

  const { email } = validatedData.data

  try {
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: {
        email_appSlug: {
          email: email.toLowerCase(),
          appSlug: DEFAULT_APP_SLUG,
        },
      },
    })

    if (existingEntry) {
      return {
        success: false,
        message: "This email is already on the waitlist",
      }
    }

    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        email: email.toLowerCase(),
        appSlug: DEFAULT_APP_SLUG,
      },
    })

    const currentPosition = await prisma.waitlistEntry.count({
      where: {
        appSlug: DEFAULT_APP_SLUG,
        createdAt: {
          lte: waitlistEntry.createdAt,
        },
      },
    })

    // Get total count for email
    const totalCount = await prisma.waitlistEntry.count({
      where: { appSlug: DEFAULT_APP_SLUG },
    })

    // Queue welcome email
    try {
      await emailJobs.sendWelcomeEmail(
        email.toLowerCase(),
        currentPosition,
        totalCount
      )
      console.log(`📧 Welcome email queued for ${email}`)
    } catch (error) {
      console.error(`❌ Failed to queue welcome email for ${email}:`, error)
      // Don't fail the signup if email queuing fails
    }

    return {
      success: true,
      position: currentPosition,
      message: "Successfully joined the waitlist!",
    }
  } catch (error) {
    console.error("Waitlist error:", error)
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    }
  }
}

/**
 * Get total count of waitlist entries
 */
export async function getWaitlistCount(): Promise<number> {
  try {
    const count = await prisma.waitlistEntry.count({
      where: {
        appSlug: DEFAULT_APP_SLUG,
      },
    })
    return count
  } catch (error) {
    console.error("Error getting waitlist count:", error)
    return 0
  }
}

/**
 * Send update email to all waitlist members
 */
export async function sendWaitlistUpdate(message: string): Promise<{
  success: boolean
  processed: number
  failed: number
  message?: string
}> {
  try {
    const job = await emailJobs.sendBulkUpdate(message, DEFAULT_APP_SLUG)
    
    return {
      success: true,
      processed: 0, // Will be updated by the job processor
      failed: 0,
      message: "Bulk update email queued successfully",
    }
  } catch (error) {
    console.error("Error queuing bulk update:", error)
    return {
      success: false,
      processed: 0,
      failed: 0,
      message: "Failed to queue bulk update email",
    }
  }
}

/**
 * Send update email to specific waitlist member
 */
export async function sendWaitlistMemberUpdate(
  email: string,
  message: string
): Promise<WaitlistResult> {
  try {
    const entry = await prisma.waitlistEntry.findUnique({
      where: {
        email_appSlug: {
          email: email.toLowerCase(),
          appSlug: DEFAULT_APP_SLUG,
        },
      },
    })

    if (!entry) {
      return {
        success: false,
        message: "Email not found on waitlist",
      }
    }

    const totalCount = await prisma.waitlistEntry.count({
      where: { appSlug: DEFAULT_APP_SLUG },
    })

    await emailJobs.sendUpdateEmail(
      email.toLowerCase(),
      entry.position,
      totalCount,
      message
    )

    return {
      success: true,
      position: entry.position,
      message: "Update email sent successfully",
    }
  } catch (error) {
    console.error("Error sending member update:", error)
    return {
      success: false,
      message: "Failed to send update email",
    }
  }
}

/**
 * Get waitlist statistics
 */
export async function getWaitlistStats(): Promise<{
  total: number
  recent: number
  positions: Array<{ position: number; email: string; createdAt: Date }>
}> {
  try {
    const total = await prisma.waitlistEntry.count({
      where: { appSlug: DEFAULT_APP_SLUG },
    })

    const recent = await prisma.waitlistEntry.count({
      where: {
        appSlug: DEFAULT_APP_SLUG,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    })

    const positions = await prisma.waitlistEntry.findMany({
      where: { appSlug: DEFAULT_APP_SLUG },
      select: {
        position: true,
        email: true,
        createdAt: true,
      },
      orderBy: { position: 'asc' },
      take: 10, // Top 10 positions
    })

    return { total, recent, positions }
  } catch (error) {
    console.error("Error getting waitlist stats:", error)
    return { total: 0, recent: 0, positions: [] }
  }
}

