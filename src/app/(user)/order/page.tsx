import { fetchOrders } from "@/app/actions/actions";
import H1 from "@/components/h1";
import OrderStatusSelection from "@/components/order-status-selection";

export default async function Page() {
  const orders = await fetchOrders();
  console.log(orders);
  return (
    <div>
      <H1>Orders</H1>
      <OrderStatusSelection orders={orders.data} />
    </div>
  );
}
