"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { generateSlugWithCuid, generateSlug } from "@/lib/utils/slug";
import { User } from "@prisma/client";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
});

const updateNoteSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title is too long")
    .optional(),
  content: z.any().optional(),
});

export type Note = {
  id: string;
  title: string;
  slug: string;
  content: any;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session.user;
}

/**
 * Create a new note
 */
export async function createNote(formData: FormData): Promise<Note> {
  const user = await getCurrentUser();

  const rawData = {
    title: formData.get("title") as string,
  };

  const validatedData = createNoteSchema.safeParse(rawData);
  if (!validatedData.success) {
    const firstError = Object.values(
      validatedData.error.flatten().fieldErrors,
    )[0]?.[0];
    throw new Error(firstError || "Invalid input data");
  }

  const slug = generateSlugWithCuid(validatedData.data.title);

  const note = await prisma.note.create({
    data: {
      title: validatedData.data.title,
      slug: slug,
      userId: user.id,
    },
  });

  return note as Note;
}

export async function getUserNotes(): Promise<Note[]> {
  const user = await getCurrentUser();

  const notes = await prisma.note.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return notes as Note[];
}

/**
 * Get a specific note by ID
 */
export async function getNoteById(noteId: string): Promise<Note> {
  const user = await getCurrentUser();

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: user.id,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note as Note;
}

/**
 * Get a specific note by slug
 */
export async function getNoteBySlug(slug: string): Promise<Note> {
  const user = await getCurrentUser();

  const note = await prisma.note.findFirst({
    where: {
      slug: slug,
      userId: user.id,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note as Note;
}

/**
 * Update a note
 */
export async function updateNote(formData: FormData): Promise<Note> {
  const user = await getCurrentUser();

  const rawData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content")
      ? JSON.parse(formData.get("content") as string)
      : undefined,
  };

  const validatedData = updateNoteSchema.safeParse(rawData);
  if (!validatedData.success) {
    const firstError = Object.values(
      validatedData.error.flatten().fieldErrors,
    )[0]?.[0];
    throw new Error(firstError || "Invalid input data");
  }

  // Check if note exists and belongs to user
  const existingNote = await prisma.note.findFirst({
    where: {
      id: validatedData.data.id,
      userId: user.id,
    },
  });

  if (!existingNote) {
    throw new Error("Note not found");
  }

  const updateData: any = {};
  if (validatedData.data.title !== undefined) {
    updateData.title = validatedData.data.title;
    updateData.slug = generateSlugWithCuid(validatedData.data.title);
  }
  if (validatedData.data.content !== undefined) {
    updateData.content = validatedData.data.content;
  }

  const note = await prisma.note.update({
    where: {
      id: validatedData.data.id,
    },
    data: updateData,
  });

  return note as Note;
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  const user = await getCurrentUser();

  // Check if note exists and belongs to user
  const existingNote = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: user.id,
    },
  });

  if (!existingNote) {
    throw new Error("Note not found");
  }

  await prisma.note.delete({
    where: {
      id: noteId,
    },
  });
}

/**
 * Create a blank note (for quick creation)
 */
export async function createBlankNote(): Promise<Note> {
  const user = await getCurrentUser();

  const slug = generateSlugWithCuid("Untitled");

  const note = await prisma.note.create({
    data: {
      title: "Untitled",
      slug: slug,
      userId: user.id,
    },
  });

  return note as Note;
}

export async function duplicateNote(noteId: string): Promise<Note> {
  const user = await getCurrentUser();

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: user.id,
    },
  });

  if (note) {
    const duplicateNote = await prisma.note.create({
      data: {
        title: note.title,
        slug: generateSlugWithCuid(note.title),
        userId: user.id,
        content: note.content ?? undefined,
      },
    });

    return duplicateNote as Note;
  } else {
    throw new Error("Note not found");
  }
}
