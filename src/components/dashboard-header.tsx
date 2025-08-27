"use client";

import H1 from "./h1";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductForm from "./product-form";
import { useProductContext } from "@/context/product-context";
import { useState } from "react";
import CategoryForm from "./category-form";

export default function DashbaordHeading({ type }: { type: string }) {
  if (type.toLowerCase() === "products") {
    const { total, open, setOpen, setSelectedProduct } = useProductContext();
    return (
      <div className="flex items-center w-full justify-between">
        <H1>
          {type} ({total}){" "}
        </H1>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedProduct(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {type}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription asChild>
                <div>
                  <ProductForm />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (type.toLowerCase() === "category") {
    const { open, setOpen } = useProductContext();

    return (
      <div className="flex items-center w-full justify-between">
        <H1>{type}</H1>{" "}
        <Button
          variant="outline"
          onClick={() => {
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add {type}
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription asChild>
                <div>
                  <CategoryForm />
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
