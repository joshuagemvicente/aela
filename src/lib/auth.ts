import { prisma } from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { NextRequest } from "next/server";

const isDev = process.env.NODE_ENV !== "production";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

const isGoogleConfigured = Boolean(googleClientId && googleClientSecret);
const isGithubConfigured = Boolean(githubClientId && githubClientSecret);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: isGoogleConfigured
      ? {
          enabled: true,
          clientId: googleClientId as string,
          clientSecret: googleClientSecret as string,
        }
      : {
          enabled: false,
          // Dummy values to satisfy type requirements; not used when enabled is false
          clientId: "disabled",
          clientSecret: "disabled",
        },
    github: isGithubConfigured
      ? {
          enabled: true,
          clientId: githubClientId as string,
          clientSecret: githubClientSecret as string,
        }
      : {
          enabled: false,
          clientId: "disabled",
          clientSecret: "disabled",
        },
  },
  plugins: [nextCookies()], // Make sure this is the last plugin in the array
});

export const getUser = async (init: NextRequest | { headers: Headers }) => {
  const requestHeaders = (init as any).headers as Headers;
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return null;
  }

  return session.user;
};

