import z from "zod";

// Schema for user registration
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1, { message: "Username cannot be empty" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RegisterSchema = z.object({
  username: z.string().min(1, { message: "Username cannot be empty" }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

export const UpdateProfileSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username cannot be empty" })
    .optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  password: z
    .string()
    .min(1, { message: "Password cannot be empty" })
    .optional(),
});

export const ParamsUserSchema = z.object({
  id: z.string(), // Mongoose IDs are strings
});

export type IUser = z.infer<typeof UserSchema>;
