import { Product } from "@/generated/prisma";

export type TProduct = Product;
export type TProductFormValues = Omit<
  TProduct,
  "id" | "created_at" | "updated_at"
>;
