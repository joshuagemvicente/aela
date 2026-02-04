import WaitlistPage from "@/components/waitlist";
import { isWaitlistModeEnabled } from "@/lib/waitlist";
import Link from "next/link";
import Carousel from "@/components/landing/Carousel";
import NewsletterCTA from "@/components/landing/NewsletterCTA";
import Image from "next/image";
import Testimonial04 from "@/components/landing/testimonials";

function LandingSection() {
  const isFree = process.env.NEXT_PUBLIC_FREE_PLAN;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <div className="size-6 rounded-md bg-primary"></div> */}
              <Image src="/aela.png" alt="Aela" width={36} height={36} />
              <span className="font-semibold tracking-tight text-xl">Aela</span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a
                href="#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#preview"
                className="hover:text-foreground transition-colors"
              >
                Preview
              </a>
              <a
                href="#pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center text-sm rounded-md px-3 py-1.5 bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center rounded-full border px-2.5 py-1 text-xs text-muted-foreground gap-2">
                  <span className="inline-block size-2 rounded-full bg-emerald-500"></span>
                  Realtime, autosave, and beautiful editor
                </div>
                <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
                  Think clearer. Write faster. Own your notes with Aela
                </h1>
                <p className="mt-4 text-muted-foreground text-lg">
                  A delightful note app designed for clarity and speed. Organize
                  your thoughts with headers, lists, tables, and more —
                  autosaved and available everywhere.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center rounded-md px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
                  >
                    Create your account
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-md px-4 py-2 border hover:bg-accent transition"
                  >
                    Sign in
                  </Link>
                </div>
                <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-primary"></span>
                    <span>Autosave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-primary"></span>
                    <span>Realtime sidebar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-primary"></span>
                    <span>Secure auth</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                  <div className="aspect-video w-full rounded-md bg-gradient-to-br from-muted to-background"></div>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                    <div className="h-10 rounded-md bg-muted"></div>
                    <div className="h-10 rounded-md bg-muted"></div>
                    <div className="h-10 rounded-md bg-muted"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 sm:py-20 border-t">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-lg border p-6 bg-card">
                <div className="mb-3 inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  ✍️
                </div>
                <h3 className="font-semibold">Powerful Editor</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Headers, lists, quotes, code, tables, and more. Beautiful
                  defaults with keyboard-first UX.
                </p>
              </div>
              <div className="rounded-lg border p-6 bg-card">
                <div className="mb-3 inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  ⚡
                </div>
                <h3 className="font-semibold">Autosave & Debounce</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Write freely. Your notes save as you type and recover
                  instantly on any device.
                </p>
              </div>
              <div className="rounded-lg border p-6 bg-card">
                <div className="mb-3 inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  🔐
                </div>
                <h3 className="font-semibold">Secure by default</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Better-Auth sessions, RBAC-ready, and optimized Prisma queries
                  for reliability.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-t">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center text-sm text-muted-foreground mb-6">
              Trusted by modern teams
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center opacity-80">
              <div className="h-8 bg-muted rounded" title="Logo"></div>
              <div className="h-8 bg-muted rounded" title="Logo"></div>
              <div className="h-8 bg-muted rounded" title="Logo"></div>
              <div className="h-8 bg-muted rounded" title="Logo"></div>
              <div className="h-8 bg-muted rounded" title="Logo"></div>
              <div className="h-8 bg-muted rounded" title="Logo"></div>
            </div>
          </div>
        </section>

        <section id="preview" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="rounded-xl border bg-card p-6">
              <div className="h-72 sm:h-96 w-full rounded-lg bg-gradient-to-br from-primary/10 via-accent/30 to-background"></div>
              <div className="mt-4 text-sm text-muted-foreground">
                Live preview of your notes dashboard and editor.
              </div>
            </div>
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Testimonial04 />
          </div>
        </section>

        <section id="faq" className="py-16 sm:py-20 border-t">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="text-2xl font-semibold mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              <details className="rounded-lg border bg-card p-4">
                <summary className="font-medium cursor-pointer">
                  Is there a free plan?
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Yes, the Free plan gives you unlimited personal notes.
                </p>
              </details>
              <details className="rounded-lg border bg-card p-4">
                <summary className="font-medium cursor-pointer">
                  Can I import my notes?
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  We are building importers; CSV/Markdown support is coming
                  soon.
                </p>
              </details>
              <details className="rounded-lg border bg-card p-4">
                <summary className="font-medium cursor-pointer">
                  Do you support teams?
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">
                  Team plan includes role-based access and shared spaces.
                </p>
              </details>
            </div>
          </div>
        </section>

        {!isFree ? (
          <section id="pricing" className="py-16 sm:py-20 border-t">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-lg border p-6 bg-card">
                  <h3 className="font-semibold">Free</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Basic notes and sync
                  </p>
                  <p className="mt-6 text-3xl font-bold">$0</p>
                  <Link
                    href="/register"
                    className="mt-6 inline-flex items-center rounded-md px-3 py-2 border hover:bg-accent transition"
                  >
                    Start free
                  </Link>
                </div>
                <div className="rounded-lg border p-6 bg-card ring-1 ring-primary/20">
                  <h3 className="font-semibold">Pro</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Unlimited notes, priority sync
                  </p>
                  <p className="mt-6 text-3xl font-bold">
                    $8
                    <span className="text-base font-medium text-muted-foreground">
                      /mo
                    </span>
                  </p>
                  <Link
                    href="/register"
                    className="mt-6 inline-flex items-center rounded-md px-3 py-2 bg-primary text-primary-foreground hover:opacity-90 transition"
                  >
                    Go Pro
                  </Link>
                </div>
                <div className="rounded-lg border p-6 bg-card">
                  <h3 className="font-semibold">Team</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Collaboration and roles
                  </p>
                  <p className="mt-6 text-3xl font-bold">
                    $24
                    <span className="text-base font-medium text-muted-foreground">
                      /mo
                    </span>
                  </p>
                  <Link
                    href="/register"
                    className="mt-6 inline-flex items-center rounded-md px-3 py-2 border hover:bg-accent transition"
                  >
                    Contact sales
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : null}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
            <h2 className="text-2xl font-semibold">
              Start capturing better notes today
            </h2>
            <p className="mt-3 text-muted-foreground">
              No friction, no clutter — just you and your ideas. Join Aela for
              free.
            </p>
            <div className="mt-6">
              <Link
                href="/register"
                className="inline-flex items-center rounded-md px-5 py-2.5 bg-primary text-primary-foreground hover:opacity-90 transition mr-3"
              >
                Create account
              </Link>
              <NewsletterCTA />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} Aela. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a
              href="/login"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const isWaitlistEnabled = isWaitlistModeEnabled();
  if (isWaitlistEnabled) {
    return <WaitlistPage></WaitlistPage>;
  }
  return <LandingSection></LandingSection>;
}
