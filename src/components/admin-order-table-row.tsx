"use client";

import { useOrderContext } from "@/context/order-context";
import { Button } from "./ui/button";
import { TableRow, TableCell, TableFooter } from "./ui/table";
import PaginationGeneric from "./pagination-genetic";

export default function AdminTableRow() {
  const { orders, setSelectedOrder } = useOrderContext();
  console.log("orders : ", orders);
  return (
    <>
      {orders &&
        orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.id}</TableCell>
            <TableCell>{order.user.name}</TableCell>
            <TableCell>
              {new Date(order.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrder(order)}
              >
                Action
              </Button>
            </TableCell>
          </TableRow>
        ))}
    </>
  );
}
