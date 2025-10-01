import { prisma } from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { NextRequest } from "next/server";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  socialProviders: {
    google: {
      enabled: true,
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      enabled: true,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [nextCookies()] // Make sure this is the last plugin in the array
});

export const getUser = async (init: NextRequest | { headers: Headers }) => {
  const requestHeaders = (init as any).headers as Headers
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return null;
  }

  return session.user;
};

