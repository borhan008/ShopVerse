import { OrderStatus, Role } from "@/generated/prisma";
import { z } from "zod";

export const validateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),

  price: z.coerce
    .number()
    .positive("Price must be a positive number")
    .min(1, "Price must be at least 1"),

  image: z.string().min(1, "Image must be a valid URL"),

  categoryId: z.coerce.number().min(1, "Category is required"),

  stock: z.coerce.number().min(1, "Stock must be at least 1"),
});

export type TProductFormValues = z.infer<typeof validateProductSchema>;

export const validateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  parentId: z.coerce.number().nonnegative().default(0),
});

export type TCategoryFormValues = z.infer<typeof validateCategorySchema>;

export const validateUserLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});
export type TUserLoginFormValues = z.infer<typeof validateUserLoginSchema>;

export const validateSignUserSchema = z.object({
  name: z.string().trim().min(3, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const validateUserSchema = z.object({
  name: z.string().trim().min(3, "Name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(Role).default("USER"),
});
export type TUserFormValues = z.infer<typeof validateUserSchema>;

export const validateCheckoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
});
export type TCheckoutFormValues = z.infer<typeof validateCheckoutSchema>;

export const validateOrderStatus = z.object({
  status: z.enum(OrderStatus).default("PENDING"),
});
