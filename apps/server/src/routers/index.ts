import { z } from "zod"
import { protectedProcedure, publicProcedure } from "../lib/orpc"
import { authRouter } from "./auth"

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK"
  }),

  simpleTest: publicProcedure.input(z.string()).handler(({ input }) => {
    console.log("Simple test input:", input)
    return { message: `Hello ${input}` }
  }),

  testInput: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .handler(({ input }) => {
      console.log("Test input received:", input)
      return { received: input }
    }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    }
  }),
  auth: authRouter,
}
export type AppRouter = typeof appRouter
