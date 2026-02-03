"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Finder } from "./finder";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SHORTCUT_OPEN_KEY = "?";
const EVENT_TOGGLE_SIDEBAR = "aela:toggle-sidebar";
const EVENT_CREATE_NOTE = "aela:create-note";

type ShortcutCategory = {
  title: string;
  shortcuts: { action: string; keys: string }[];
};

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    title: "Global",
    shortcuts: [
      { action: "Show keyboard shortcuts", keys: "⇧ + ?" },
      { action: "Toggle sidebar", keys: "⌘ + \\" },
    ],
  },
  {
    title: "Notes",
    shortcuts: [
      { action: "Create new note", keys: "⌘ + n" },
      { action: "Search notes", keys: "⌘ + k" },
    ],
  },
  {
    title: "EditorJS",
    shortcuts: [
      { action: "Bold", keys: "⌘ + b" },
      { action: "Italic", keys: "⌘ + i" },
      { action: "Marker (highlight)", keys: "⌘ + m" },
      { action: "Link (when focus in editor)", keys: "⌘ + k" },
    ],
  },
];

function ShortcutKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium text-foreground",
      )}
    >
      {children}
    </kbd>
  );
}

function renderKeys(keys: string) {
  const parts = keys.split(" + ");
  return (
    <>
      {parts.map((key, i) => (
        <span key={`${key}-${i}`} className="inline-flex items-center gap-1">
          <ShortcutKey>{key}</ShortcutKey>
          {i < parts.length - 1 && (
            <span className="text-muted-foreground">+</span>
          )}
        </span>
      ))}
    </>
  );
}

export function HelpSettings() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === SHORTCUT_OPEN_KEY && e.shiftKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
        return;
      }
      const isMac =
        typeof navigator !== "undefined" &&
        navigator.platform?.toLowerCase().includes("mac");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      if (e.key === "\\") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(EVENT_TOGGLE_SIDEBAR));
        return;
      }
      if (e.key === "n") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(EVENT_CREATE_NOTE));
        return;
      }
      if (e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="Show keyboard shortcuts"
            className="fixed bottom-6 right-6 z-40 size-12 rounded-full border border-border bg-background/95 shadow-md backdrop-blur hover:bg-accent"
          >
            <Keyboard className="size-5 text-muted-foreground" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" sideOffset={8}>
          Keyboard shortcuts (⇧ + ?)
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              Keyboard shortcuts
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-2">
            {SHORTCUT_CATEGORIES.map((category) => (
              <div key={category.title}>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {category.title}
                </h3>
                <div className="space-y-2">
                  {category.shortcuts.map(({ action, keys }) => (
                    <div
                      key={action}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-transparent px-2 py-1.5 hover:bg-muted/50"
                    >
                      <span className="text-sm text-foreground">{action}</span>
                      <span className="flex flex-wrap items-center gap-1">
                        {renderKeys(keys)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
            Press <ShortcutKey>⇧</ShortcutKey> + <ShortcutKey>?</ShortcutKey>{" "}
            anytime to open this help.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent
          className="max-w-xl gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Finder open={searchOpen} onClose={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
