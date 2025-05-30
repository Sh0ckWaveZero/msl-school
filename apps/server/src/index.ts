import "dotenv/config"
import { createContext } from "@/lib/context"
import { appRouter } from "@/routers/index"
import { RPCHandler } from "@orpc/server/fetch"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

const app = new Hono()

app.use(logger())
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
  })
)

const handler = new RPCHandler(appRouter)
app.all("/rpc/*", async (c) => {
  console.log("ORPC request:", c.req.method, c.req.url)

  const context = await createContext({ context: c })
  const result = await handler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  })

  console.log("Handler result matched:", result.matched)
  if (result.matched) {
    return result.response
  }

  return c.json({ error: "Handler did not match" }, 404)
})

app.get("/", (c) => {
  return c.text("OK")
})

export default app
