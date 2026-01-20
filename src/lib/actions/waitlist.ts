"use server"

import { prisma } from "@/lib/prisma"
import { waitlistSchema, type WaitlistInput } from "@/lib/validations/waitlist"

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

    return {
      success: true,
      position: currentPosition,
      message: "Successfully joined the waitlist!",
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Waitlist error:", error)
    }
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
    if (process.env.NODE_ENV !== "production") {
      console.error("Error getting waitlist count:", error)
    }
    return 0
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
    if (process.env.NODE_ENV !== "production") {
      console.error("Error getting waitlist stats:", error)
    }
    return { total: 0, recent: 0, positions: [] }
  }
}

