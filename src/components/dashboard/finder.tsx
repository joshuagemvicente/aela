"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "@/contexts/notes-context";
import { Search, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/actions/notes";

interface FinderProps {
  open: boolean;
  onClose: () => void;
}

function filterNotesByTitleKeyword(notes: Note[], keyword: string): Note[] {
  if (!keyword.trim()) return notes;
  const q = keyword.toLowerCase().trim();
  return notes.filter(
    (n) =>
      (n.title && n.title.toLowerCase().includes(q)) ||
      (n.slug && n.slug.toLowerCase().includes(q)),
  );
}

export function Finder({ open, onClose }: FinderProps) {
  const router = useRouter();
  const { notes } = useNotes();
  const [keyword, setKeyword] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredNotes = useMemo(
    () => filterNotesByTitleKeyword(notes, keyword),
    [notes, keyword],
  );

  useEffect(() => {
    if (open) {
      setKeyword("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [keyword]);

  useEffect(() => {
    const len = filteredNotes.length;
    if (len === 0) return;
    if (selectedIndex < 0) setSelectedIndex(0);
    if (selectedIndex >= len) setSelectedIndex(len - 1);
  }, [selectedIndex, filteredNotes.length]);

  const handleSelectNote = (note: Note) => {
    router.push(`/dashboard/${note.slug}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filteredNotes.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter" && filteredNotes[selectedIndex]) {
      e.preventDefault();
      handleSelectNote(filteredNotes[selectedIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-xl"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-3 py-2.5">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search notes..."
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          aria-label="Search notes"
        />
      </div>

      <ul
        ref={listRef}
        className="max-h-[min(60vh,400px)] overflow-y-auto py-1"
        role="listbox"
        aria-label="Search results"
      >
        {filteredNotes.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-muted-foreground">
            {keyword.trim() ? "No notes match." : "No notes yet."}
          </li>
        ) : (
          filteredNotes.map((note, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li key={note.id} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => handleSelectNote(note)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors focus:outline-none",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted/60",
                  )}
                >
                  <FileText
                    className={cn(
                      "size-5 shrink-0",
                      isSelected
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {note.title || "Untitled"}
                    </p>
                    <p
                      className={cn(
                        "truncate text-xs",
                        isSelected
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground",
                      )}
                    >
                      /dashboard/{note.slug}
                    </p>
                    <p
                      className={cn(
                        "truncate text-xs",
                        isSelected
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground",
                      )}
                    >
                      {note.updatedAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "size-4 shrink-0",
                      isSelected
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  />
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
