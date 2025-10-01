import { NextResponse } from "next/server"
import { z } from "zod"

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email(),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const data = schema.parse(json)
    // TODO integrate with email service provider
    console.log("newsletter subscribe", data)
    return NextResponse.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}


