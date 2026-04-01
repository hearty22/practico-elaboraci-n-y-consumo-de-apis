import { z } from "zod";

// Schema for the main list object
export const ListSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string().optional(),
  is_complete: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for creating a new list (only title is required from the user)
export const CreateListSchema = z.object({
  title: z.string().min(1, { message: "Title cannot be empty" }),
  description: z.string().optional(),
});

// Schema for updating a list (all fields optional)
export const UpdateListSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  is_complete: z.boolean().optional(),
});

// Schema for URL params containing an ID
export const ParamsSchema = z.object({
  id: z.string(), // Mongoose IDs are strings
});

// Infer the TypeScript types directly from the Zod schemas
export type IList = z.infer<typeof ListSchema>;
