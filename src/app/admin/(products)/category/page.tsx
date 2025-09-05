"use client";

import DashbaordHeading from "@/components/dashboard-header";
import { DeleteProductAlert } from "@/components/product-delete-alert";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProductContext } from "@/context/product-context";
import { Pen, Trash2Icon } from "lucide-react";
import { useState } from "react";
export default function Page() {
  const { categories, setOpen, setSelectedCategory, handleDeleteCategory } =
    useProductContext();

  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <div>
      <DashbaordHeading type="Category"></DashbaordHeading>
      <DeleteProductAlert
        type="category"
        setOpen={setDeleteOpen}
        open={deleteOpen}
        currentPage={0}
      />

      <Table className="border">
        <TableHeader className="bg-zinc-100/40">
          <TableRow>
            <TableHead className="">Category ID</TableHead>
            <TableHead className="">Category Name</TableHead>
            <TableHead className=""></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories &&
            categories?.map((category) => (
              <TableRow key={category.slug}>
                <TableCell className="font-medium w-[100px]">
                  {category.id}
                </TableCell>
                <TableCell className="font-medium ">
                  {category.name}
                  <br />
                  <span className="font-light text-xs">{category.slug}</span>
                </TableCell>
                <TableCell className="font-medium">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(category);
                      setOpen(true);
                    }}
                  >
                    <Pen className="inline" />
                  </Button>
                  <Button
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      setSelectedCategory(category);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2Icon className="inline" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
