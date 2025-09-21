/**
 * Checks if the application is in waitlist mode based on environment variable
 * @returns boolean indicating if waitlist mode is enabled
 */
export function isWaitlistModeEnabled(): boolean {
  return process.env.IS_WAITLIST === 'true';
}

