"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { addToCart, buyNowCheckout } from "@/app/actions/actions";
import { toast } from "sonner";
import { auth } from "@/lib/auth";

export default function ProductDetailsBtn({
  stock,
  productId,
}: {
  stock: number;
  productId: number;
}) {
  const [quantity, setQuantity] = useState(1);
  const handleProductQuantity = (type: "plus" | "minus") => () => {
    if (type === "plus") {
      setQuantity((prev) => Math.min(stock, prev + 1));
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const handleAddToCart = async () => {
    const res = await addToCart(productId, quantity);
    if (res.success) {
      toast.success(res.message);
      setQuantity(1);
    } else {
      toast.error(res.message);
    }
  };
  return (
    <div>
      <div className="flex gap-4 text-center mt-4">
        <Button
          onClick={handleProductQuantity("minus")}
          className="w-10 h-10 rounded-full p-0 "
          variant="outline"
        >
          -
        </Button>
        <Input
          type="number"
          value={quantity}
          max={stock}
          min={1}
          onChange={(e) => {
            const value = Math.max(1, Math.min(stock, Number(e.target.value)));
            setQuantity(value);
          }}
          className="w-20"
        />
        <Button
          onClick={handleProductQuantity("plus")}
          className="w-10 h-10 rounded-full p-0"
        >
          +
        </Button>
      </div>

      <Button className="my-4" onClick={handleAddToCart}>
        Add to Cart
      </Button>
      <Button
        className="my-4 ml-4"
        variant="outline"
        onClick={async () => {
          await buyNowCheckout(productId, quantity);
        }}
      >
        Buy Now
      </Button>
    </div>
  );
}
