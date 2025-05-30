import { auth } from "@/lib/auth"
import { publicProcedure } from "@/lib/orpc"
import { ORPCError } from "@orpc/server"
import { z } from "zod"

// Input validation schemas
const signInSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().min(1).optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => data.email || data.username, {
    message: "Either email or username is required",
    path: ["email"],
  })

const signUpSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
})

export const authRouter = {
  /**
   * Sign in user with email/username and password
   */
  signIn: publicProcedure.input(signInSchema).handler(async ({ input, context }) => {
    try {
      let signInResult:
        | Awaited<ReturnType<typeof auth.api.signInEmail>>
        | Awaited<ReturnType<typeof auth.api.signInUsername>>

      if (input.email) {
        // Sign in with email
        signInResult = await auth.api.signInEmail({
          body: {
            email: input.email,
            password: input.password,
          },
          headers: context.headers,
        })
      } else if (input.username) {
        // Sign in with username
        signInResult = await auth.api.signInUsername({
          body: {
            username: input.username,
            password: input.password,
          },
          headers: context.headers,
        })
      } else {
        throw new Error("Either email or username is required")
      }

      // Get updated session after sign-in
      const session = await auth.api.getSession({
        headers: context.headers,
      })

      return {
        success: true,
        message: "Sign-in successful",
        user: signInResult?.user || null,
        session: session,
        token: signInResult?.token || null,
      }
    } catch (error) {
      console.error("Sign-in error:", error)
      throw new ORPCError("UNAUTHORIZED", {
        message: "Invalid credentials",
        cause: error,
      })
    }
  }),

  /**
   * Sign up new user
   */
  signUp: publicProcedure.input(signUpSchema).handler(async ({ input, context }) => {
    try {
      const signUpResult = await auth.api.signUpEmail({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
          ...(input.username && { username: input.username }),
        },
        headers: context.headers,
      })

      return {
        success: true,
        message: "Sign-up successful",
        user: signUpResult?.user || null,
      }
    } catch (error) {
      console.error("Sign-up error:", error)
      throw new ORPCError("BAD_REQUEST", {
        message: "Sign-up failed",
        cause: error,
      })
    }
  }),

  /**
   * Get current session
   */
  getSession: publicProcedure.handler(async ({ context }) => {
    return {
      session: context.session,
      user: context.session?.user || null,
    }
  }),

  /**
   * Sign out current user
   */
  signOut: publicProcedure.handler(async ({ context }) => {
    try {
      await auth.api.signOut({
        headers: context.headers,
      })

      return {
        success: true,
        message: "Sign-out successful",
      }
    } catch (error) {
      console.error("Sign-out error:", error)
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Sign-out failed",
        cause: error,
      })
    }
  }),
}
