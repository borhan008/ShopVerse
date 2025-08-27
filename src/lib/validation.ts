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
