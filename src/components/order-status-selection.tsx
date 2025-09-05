"use client";

import { TOrderStatusType } from "@/types/types";
import React, { useState } from "react";
import { Order, OrderItem, Product } from "@/generated/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type TOrerItem = OrderItem & {
  product: Product;
};

type TOrder = Order & {
  items: TOrerItem[];
};

type TOrderStatusSelectionProps = {
  orders: TOrder[] | null | undefined;
};

export default function OrderStatusSelection({
  orders,
}: TOrderStatusSelectionProps) {
  const orderStatus: TOrderStatusType[] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const [selectedStatus, setSelectedStatus] = useState<TOrderStatusType | null>(
    "PENDING"
  );
  //console.log(orders);

  return (
    <div>
      <ul className="flex gap-5">
        {orderStatus.map((status) => (
          <li
            key={status}
            className={`px-4 py-2 border rounded-full cursor-pointer hover:bg-zinc-100 transition ${
              selectedStatus === status ? "bg-zinc-200" : ""
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </li>
        ))}
      </ul>

      <div className="w-full flex flex-col gap-5 py-4">
        {orders &&
          orders.length > 0 &&
          orders
            .filter((ord) => ord.status === selectedStatus)
            .map((order: TOrder) => (
              <div key={order.id.toString()}>
                <div className="flex flex-col  p-2  bg-zinc-100">
                  <h2 className="text-lg font-semibold">
                    Order ID: {order.id}
                  </h2>
                  <p className="text-xs text-zinc-900">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <Table>
                  <TableHeader className="bg-zinc-200 ">
                    <TableHead className="">Product</TableHead>
                    <TableHead className="">Quantity</TableHead>
                    <TableHead className="">Cost</TableHead>
                  </TableHeader>

                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id.toString()}>
                        <TableCell className="font-medium flex gap-2 items-center ">
                          <img
                            src={`${process.env.NEXT_PUBLIC_GATEWAY}/${item.product.image}`}
                            alt={item.product.name}
                            width={50}
                            className="max-h-[50px] object-cover"
                          />
                          <p>
                            {item.product.name} <br /> ${item.price}
                          </p>
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${item.price * item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-zinc-200">
                      <TableCell colSpan={2} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold">
                        ${order.total}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ))}
      </div>
    </div>
  );
}
