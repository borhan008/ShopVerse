"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { useUserProductContext } from "@/context/user-product-context";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pagination } from "./ui/pagination";
import PaginationGeneric from "./pagination-genetic";
import { useForm } from "react-hook-form";
import { GenericField } from "./product-input-field";
import { Form } from "./ui/form";
import H1 from "./h1";

type SearchForm = {
  search: string;
};

export default function ProductCard() {
  const {
    products,
    selectedCategory,
    setSearch,
    perPage,
    total,
    skip,
    setSkip,
  } = useUserProductContext();

  const form = useForm<SearchForm>({});

  return (
    <>
      <div className="flex justify-between flex-col md:flex-row gap-8 mb-8">
        <div>
          <H1>Products</H1>
          <p className="text-muted-foreground">
            Browse our collection of products. Find the perfect item for you!
          </p>
          <p className="text-zinc-800">
            {selectedCategory && (
              <>
                Filtering by category:{" "}
                <span className="font-medium">{selectedCategory.name}</span>
              </>
            )}
          </p>
        </div>

        <Form {...form}>
          <form
            action={(data) => {
              setSearch(data.get("search")?.toString() || "");
              setSkip(0);
            }}
            className="flex gap-2 mb-5 items-end justify-center"
          >
            <GenericField
              label="Search Products"
              type="text"
              name="search"
              placeholder="Search by name or description"
              control={form.control as any}
            />
            <Button type="submit">Search</Button>
          </form>
        </Form>
      </div>

      <div className="w-full gap-5  flex flex-wrap">
        {products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product.slug}
              className="flex-1 max-w-[400px] min-w-[280px] pt-0 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative  w-full bg-gradient-to-r from-blue-500 to-indigo-900 text-white rounded-t-2xl">
                <Image
                  src={`${process.env.NEXT_PUBLIC_GATEWAY}/${product.image}`}
                  alt="Product"
                  width={100}
                  height={100}
                  className="object-contain max-h-[250px] w-full p-10 transition-transform duration-300 hover:scale-110 "
                />
                <span className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-md px-2 py-1 text-xl font-bold rounded-full shadow">
                  {product.price} $
                </span>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock}
                </p>
              </CardHeader>
              <CardContent>
                <CardDescription>{product.description}</CardDescription>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button className="w-full" asChild>
                  <Link href={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-2xl text-center my-16 w-full">
            No products named{" "}
            {form.getValues("search") && `"${form.getValues("search")}"`}{" "}
            {selectedCategory && `in category "${selectedCategory.name}" `}
            are not found
          </div>
        )}
      </div>

      <PaginationGeneric
        total={total}
        skip={skip}
        setSkip={setSkip}
        perPage={perPage}
      />
    </>
  );
}
