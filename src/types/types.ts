import { Cart, OrderStatus, Product } from "@/generated/prisma";

export type TProduct = Product;
export type TProductFormValues = Omit<
  TProduct,
  "id" | "created_at" | "updated_at"
>;
export type TCart = Cart & {
  product: Product;
};

export type TOrderStatusType = OrderStatus;
