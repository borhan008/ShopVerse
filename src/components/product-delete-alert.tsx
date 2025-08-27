"use client";

import { useProductContext } from "@/context/product-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

type TDeleteProductAlertProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "category" | "product";
};

export function DeleteProductAlert({
  open,
  setOpen,
  type,
}: TDeleteProductAlertProps) {
  const {
    handleDeleteProduct,
    selectedProduct,
    selectedCategory,
    handleDeleteCategory,
  } = useProductContext();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this{" "}
            {type === "product"
              ? `product ${selectedProduct?.name}`
              : `category ${selectedCategory?.name}`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The product will be permanently
            removed.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              type === "product"
                ? handleDeleteProduct(selectedProduct?.id || 0)
                : handleDeleteCategory(selectedCategory?.id || 0)
            }
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
