"use client";

import AdminTableRow from "@/components/admin-order-table-row";
import H1 from "@/components/h1";
import PaginationGeneric from "@/components/pagination-genetic";
import SelectedOrder from "@/components/selected-order";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrderContext } from "@/context/order-context";

export default function Page() {
  const { perPage, skip, setSkip, totalOrders, selectedOrder } =
    useOrderContext();
  return (
    <>
      <H1>Order Management</H1>
      <Table className="w-full my-8">
        <TableHeader className="border-b bg-zinc-200">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <AdminTableRow />
        </TableBody>
      </Table>

      <PaginationGeneric
        total={totalOrders}
        skip={skip}
        perPage={perPage}
        setSkip={setSkip}
      />
      {selectedOrder && <SelectedOrder />}
    </>
  );
}
