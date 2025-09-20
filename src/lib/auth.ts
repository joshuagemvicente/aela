import { prisma } from "./prisma"
import { betterAuth} from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { NextRequest } from "next/server"


export const auth = betterAuth({
    database: {
        adapter: prismaAdapter(prisma, {
            provider: "postgresql",
        })
    },
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
        apple: {
            enabled: true,
            clientId: process.env.APPLE_CLIENT_ID as string,
            clientSecret: process.env.APPLE_CLIENT_SECRET,
        }
    }
})


export const getUser = async (request: NextRequest) => {
    const session =await auth.api.getSession({
        headers: request.headers,
    })
    if (!session) {
        return null
    }
    
    return session.user
}