"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { toast } from "sonner"

export default function NewsletterCTA() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setPending(true)
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") || ""),
          email: String(formData.get("email") || ""),
        }),
      })
      if (!res.ok) throw new Error("Failed to subscribe")
      toast.success("Thanks! You are on the list.")
      setOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Subscription failed")
    } finally {
      setPending(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center rounded-md px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90 transition">
          Join newsletter
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md rounded-lg border bg-background p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold">Stay in the loop</Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mt-1">
            Get product updates and tips directly to your inbox.
          </Dialog.Description>
          <form
            className="mt-4 space-y-3"
            action={(fd) => {
              handleSubmit(fd)
            }}
          >
            <div className="grid gap-1.5">
              <label htmlFor="nl-name" className="text-sm">Name</label>
              <input id="nl-name" name="name" className="h-10 rounded-md border bg-background px-3" placeholder="Your name" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="nl-email" className="text-sm">Email</label>
              <input id="nl-email" name="email" type="email" className="h-10 rounded-md border bg-background px-3" placeholder="you@example.com" required />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button type="button" className="inline-flex items-center rounded-md px-3 py-2 border hover:bg-accent">Cancel</button>
              </Dialog.Close>
              <button disabled={pending} className="inline-flex items-center rounded-md px-3 py-2 bg-primary text-primary-foreground disabled:opacity-60">
                {pending ? "Sending..." : "Subscribe"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}


