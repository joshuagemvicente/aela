import { randomBytes } from "crypto"

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  // Convert to lowercase and replace spaces with hyphens
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens

  // If slug is empty or just hyphens, generate a random one
  if (!slug || slug === '-') {
    slug = `untitled-${randomBytes(4).toString('hex')}`
  }

  return slug
}

/**
 * Generate a unique slug by appending a random suffix if needed
 */
export async function generateUniqueSlug(
  title: string, 
  existingSlugs: string[] = []
): Promise<string> {
  let baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1

  // Check if slug exists and generate unique one
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

/**
 * Generate a slug with CUID suffix for guaranteed uniqueness
 */
export function generateSlugWithCuid(title: string): string {
  const baseSlug = generateSlug(title)
  const cuid = randomBytes(4).toString('hex')
  return `${baseSlug}-${cuid}`
}
