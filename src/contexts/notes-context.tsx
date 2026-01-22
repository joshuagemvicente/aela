"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { type Note } from "@/lib/actions/notes";

interface NotesContextType {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  updateNote: (updatedNote: Note) => void;
  addNote: (note: Note) => void;
  removeNote: (noteId: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({
  children,
  initialNotes,
}: {
  children: ReactNode;
  initialNotes: Note[];
}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const updateNote = useCallback((updatedNote: Note) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note,
      ),
    );
  }, []);

  const addNote = useCallback((note: Note) => {
    setNotes((prevNotes) => [note, ...prevNotes]);
  }, []);

  const removeNote = useCallback((noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        setNotes,
        updateNote,
        addNote,
        removeNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
