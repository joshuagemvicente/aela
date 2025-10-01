import { useRef, useEffect, useCallback } from "react"

/**
 * useDebounce
 * Returns a debounced version of the provided callback.
 * The debounced function will only be invoked after the specified delay has elapsed since the last call.
 *
 * @param callback - The function to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns A debounced function
 */
export function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const callbackRef = useRef<T>(callback)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep the latest callback in ref
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Type assertion to return the correct function signature
  return debouncedFn as T
}

export default useDebounce
