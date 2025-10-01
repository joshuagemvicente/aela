"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { loginSchema, registerSchema, oauthSchema, type LoginInput, type RegisterInput, type OAuthInput } from "@/lib/validations/auth"

export type AuthResult = {
  user: {
    id: string
    name: string
    email: string
    image?: string
  }
}

/**
 * Server action for email/password login
 */
export async function signInWithEmail(formData: FormData): Promise<AuthResult> {
  // Extract form data
  const rawData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  // Validate input
  const validatedData = loginSchema.safeParse(rawData)
  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors)[0]?.[0]
    throw new Error(firstError || "Invalid input data")
  }

  const { email, password } = validatedData.data

  // Attempt to sign in
  const result = await auth.api.signInEmail({
    body: {
      email,
      password, 
    },
  })

  if (!result.user) {
    throw new Error("Invalid credentials")
  }

 

  return {
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      image: result.user.image || undefined,
    },
  }
}

/**
 * Server action for email/password registration
 */
export async function signUpWithEmail(formData: FormData): Promise<AuthResult> {
  // Extract form data
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  }

  // Validate input
  const validatedData = registerSchema.safeParse(rawData)
  if (!validatedData.success) {
    const fieldErrors = validatedData.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors)[0]?.[0]
    throw new Error(firstError || "Invalid input data")
  }

  const { name, email, password } = validatedData.data

  // Attempt to sign up
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  })

  if (!result.user) {
    throw new Error("Failed to create account")
  }


  return {
    user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        image: result.user.image || undefined,
    },
  }
}

/**
 * Server action for OAuth login (Google/GitHub)
 */
export async function signInWithOAuth(provider: "google" | "github", callbackURL = "/dashboard"): Promise<void> {
  // Validate input
  const validatedData = oauthSchema.safeParse({ provider, callbackURL })
  if (!validatedData.success) {
    throw new Error("Invalid provider")
  }

  // Redirect to OAuth provider
  const result = await auth.api.signInSocial({
    body: {
      provider: validatedData.data.provider,
      callbackURL: validatedData.data.callbackURL,
    },
  })

  // For OAuth, we redirect to the provider's URL
  if (result.url) {
    redirect(result.url)
  }
}

/**
 * Server action for signing out
 */
export async function signOut(): Promise<void> {
  await auth.api.signOut({
    headers: await headers(),
  })
}

/**
 * Server action to get current session
 */
export async function getCurrentSession(): Promise<AuthResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("No active session")
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image || undefined,
    },
  }
}

/**
 * Server action to check if user is authenticated
 */
export async function requireAuth(): Promise<AuthResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image || undefined,
    },
  }
}

/**
 * Server action to get current user profile
 */
export async function getCurrentUserProfile(): Promise<AuthResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("No active session")
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image || undefined,
    },
  }
}
