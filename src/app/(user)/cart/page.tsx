"use client";

import {
  checkoutSession,
  deleteCartItem,
  fetchCartItems,
  updateCartItems,
} from "@/app/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cart, Product } from "@/generated/prisma";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
type TCart = Cart & {
  product: Product;
};
export default function page() {
  const [carts, setCarts] = useState<TCart[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchCarts = async () => {
      const cartsFetched = await fetchCartItems();
      setCarts(cartsFetched.cartItems);

      if (!cartsFetched.success) {
        toast.error(cartsFetched.message);
      } else {
        //console.log("cartsFetched", cartsFetched);
      }
    };
    fetchCarts();
  }, []);

  const deleteCart = async (productId: number) => {
    setCarts(carts.filter((c) => c.productId != productId));
    const deleteProduct = await deleteCartItem(productId);
    if (deleteProduct.success) {
      toast.success(deleteProduct.message);
    } else {
      toast.error(deleteProduct.message);
    }
  };

  const handleCheckOut = async () => {
    if (carts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    await updateCartItems(carts);
    await checkoutSession(carts);
    //router.push("cart/checkout");
  };

  return (
    <div>
      <H1>Cart Page ({carts.length})</H1>
      {carts.length === 0 ? (
        <div>Your cart is empty</div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.map((cart: any) => (
                <TableRow key={cart.productId}>
                  <TableCell className="flex gap-4 ">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_GATEWAY}/${cart.product.image}`}
                      alt={cart.product.name}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                    />
                    <div>
                      <p className="text-md">{cart.product.name}</p>
                      <p className="">Stock : {cart.product.stock}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={cart.quantity}
                      min={1}
                      max={cart.product.stock}
                      className="max-w-[100px]"
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setCarts(
                          carts.map((c: TCart) =>
                            c.productId === cart.productId
                              ? {
                                  ...c,
                                  quantity: Math.min(value, c.product.stock),
                                }
                              : c
                          )
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell>${cart.product.price}</TableCell>
                  <TableCell>${cart.product.price * cart.quantity}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => deleteCart(cart.productId)}
                      className="rounded-full w-10 h-10"
                    >
                      <TrashIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow className="bg-gray-100">
                <TableCell colSpan={3}></TableCell>
                <TableCell colSpan={2} className="text-md font-semibold">
                  $
                  {carts.reduce(
                    (total: number, c: TCart) =>
                      total + c.product.price * c.quantity,
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button onClick={handleCheckOut} className="mt-4 float-right">
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
