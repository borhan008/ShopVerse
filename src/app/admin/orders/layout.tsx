import OrderProvider from "@/context/order-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OrderProvider>{children}</OrderProvider>;
}
