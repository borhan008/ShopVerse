"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Pen, Trash2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashbaordHeading from "@/components/dashboard-header";
import { useProductContext } from "@/context/product-context";
import { DeleteProductAlert } from "@/components/product-delete-alert";
import { useState } from "react";
import { Product } from "@/generated/prisma";

export default function Page() {
  const { products, total, setOpen, setSelectedProduct, handleFetchProduct } =
    useProductContext();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [allProducts, setAllProducts] = useState(products);

  return (
    <>
      <DashbaordHeading type="Products" />
      <DeleteProductAlert
        type="product"
        setOpen={setDeleteOpen}
        open={deleteOpen}
      />
      <Table className="border">
        <TableHeader className="bg-zinc-100/40">
          <TableRow>
            <TableHead className="">Product ID</TableHead>
            <TableHead className="">Product Name</TableHead>
            <TableHead className="">Category</TableHead>
            <TableHead className="">Price</TableHead>
            <TableHead className="">Stock</TableHead>
            <TableHead className="">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allProducts &&
            allProducts
              ?.slice((currentPage - 1) * 2, currentPage * 2)
              ?.map((product) => (
                <TableRow key={product?.id || product?.slug}>
                  <TableCell className="font-medium w-[100px]">
                    {product.id}
                  </TableCell>
                  <TableCell className="font-medium flex gap-2 items-start ">
                    <img
                      src={`https://${process.env.NEXT_PUBLIC_GATEWAY}/ipfs/${product.image}`}
                      alt={product.name}
                      width={50}
                      className=""
                    />
                    <p>{product.name}</p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product.categoryId}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${product.price}
                  </TableCell>
                  <TableCell className="font-medium">{product.stock}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpen(true);
                      }}
                    >
                      <Pen className="inline" />
                    </Button>
                    <Button
                      variant="outline"
                      className="ml-2"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpen(true);
                      }}
                    >
                      <Trash2Icon className="inline" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <p className="text-sm  py-1 text-muted-foreground">
        Page {currentPage} of {Math.floor((total + 2 - 1) / 2)}
      </p>

      <div className="w-full flex justify-center items-center">
        <Button
          className="mt-4"
          variant="link"
          disabled={currentPage == 1}
          onClick={async () => {
            setCurrentPage((prev) => prev - 1);
          }}
        >
          <ArrowLeft className="inline" /> Previous
        </Button>
        <Button
          className="mt-4 ml-2"
          variant="link"
          disabled={currentPage == Math.floor((total + 2 - 1) / 2)}
          onClick={async () => {
            const data = await handleFetchProduct(currentPage, 2);
            if (!data || data.length === 0) return;
            setAllProducts((prev) => [...prev, ...data]);

            setCurrentPage((prev) => prev + 1);
          }}
        >
          Next
          <ArrowRight className="inline" />
        </Button>
      </div>
    </>
  );
}
