"use client";

import { fetchOrdersAdmin } from "@/app/actions/actions";
import { Order, OrderItem, Product, User } from "@/generated/prisma";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { TOrder } from "@/types/types";

type TOrderProviderProps = {
  children: React.ReactNode;
};

type TOrderContext = {
  orders: TOrder[] | null;
  perPage: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  skip: number;
  setSkip: React.Dispatch<React.SetStateAction<number>>;
  totalOrders: number;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedOrder: TOrder | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<TOrder | null>>;
  setOrders: React.Dispatch<React.SetStateAction<TOrder[] | null>>;
};

export const OrderContext = createContext<TOrderContext | null>(null);

export default function OrderProvider({ children }: TOrderProviderProps) {
  const [perPage, setPerPage] = useState(1);
  const [skip, setSkip] = useState(0);
  const [orders, setOrders] = useState<TOrder[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchOrdersAdmin(skip, perPage);
        console.log(res);

        if (res.data && res.total !== undefined) {
          setOrders(res.data);
          setTotalOrders(res.total);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, [skip, perPage]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        perPage,
        setPerPage,
        skip,
        setSkip,
        totalOrders,
        selectedCategory,
        setSelectedCategory,
        search,
        setSearch,
        selectedOrder,
        setSelectedOrder,
        setOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
