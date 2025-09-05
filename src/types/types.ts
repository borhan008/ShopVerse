import {
  Cart,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  User,
} from "@/generated/prisma";

export type TProduct = Product;
export type TProductFormValues = Omit<
  TProduct,
  "id" | "created_at" | "updated_at"
>;
export type TCart = Cart & {
  product: Product;
};

export type TOrderStatusType = OrderStatus;

export type OrderItemWithProduct = OrderItem & {
  product: Product;
};

export type TOrder = Order & {
  items: OrderItemWithProduct[];
  user: Pick<User, "id" | "name" | "email">;
};
