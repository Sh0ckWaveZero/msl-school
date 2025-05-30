import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { username } from "better-auth/plugins"
import prisma from "../../prisma"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "better-auth-secret-key-12345",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [username()],
  trustedOrigins: [process.env.CORS_ORIGIN || "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
  },
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}
