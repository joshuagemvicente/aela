# Waitlist Setup

This application supports a waitlist mode that can be toggled using environment variables.

## How to Enable Waitlist Mode

1. Create a `.env.local` file in the root directory
2. Add the following environment variable:

```bash
IS_WAITLIST=true
```

## How to Disable Waitlist Mode

To show the main application instead of the waitlist:

```bash
IS_WAITLIST=false
```

Or simply remove the `IS_WAITLIST` variable from your environment file.

## Files Created/Modified

- `src/components/waitlist.tsx` - Beautiful waitlist page component
- `src/lib/waitlist.ts` - Utility function to check waitlist mode
- `src/app/page.tsx` - Updated to conditionally render waitlist or main app

## Features

The waitlist page includes:
- Modern, responsive design with dark mode support
- Email signup form
- Feature highlights
- Social proof (waitlist count)
- Contact information

## Usage

The application will automatically check the `IS_WAITLIST` environment variable on each page load and render the appropriate content.
