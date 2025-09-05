"use client";
import React, { useEffect, useState } from "react";

import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { TProductFormValues, validateProductSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { pinata } from "@/lib/pinata";
import Image from "next/image";
import { GenericField } from "./product-input-field";
import { useProductContext } from "@/context/product-context";
export default function ProductForm() {
  const [fileUploading, setFileUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { handleAddProduct, selectedProduct, handleUpdateProduct, setOpen } =
    useProductContext();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);
  const form = useForm<TProductFormValues>({
    resolver: zodResolver(validateProductSchema),
    defaultValues: selectedProduct
      ? {
          name: selectedProduct?.name,
          description: selectedProduct?.description,
          stock: selectedProduct?.stock,
          price: selectedProduct?.price,
          image: selectedProduct?.image,
          categoryId: selectedProduct?.categoryId.toString(),
        }
      : {
          name: "",
          description: "",
          stock: 0,
          price: 0,
          image: "",
          categoryId: "",
        },
  });

  return (
    <Form {...form}>
      <form
        action={async () => {
          const result = await form.trigger();
          if (!result) {
            //   console.log("Form is invalid", form.formState.errors);
            return;
          }

          const newProduct = form.getValues();
          setOpen(false);

          if (!selectedProduct) await handleAddProduct(newProduct);
          else {
            await handleUpdateProduct(selectedProduct.id, newProduct);
          }
          form.reset();

          return;
        }}
        className="space-y-4"
      >
        <GenericField
          name="name"
          label="Product name"
          control={form.control as any}
          placeholder="Product Name"
        />

        <GenericField
          name="description"
          label="Product description"
          control={form.control as any}
          placeholder="Product Description"
        />
        <GenericField
          name="stock"
          label="Stock"
          control={form.control as any}
          placeholder="100"
          type="number"
        />
        <GenericField
          name="price"
          label="Price"
          control={form.control as any}
          placeholder="100"
          type="number"
        />

        <FormField
          control={form.control as any}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="Image URL"
                  onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    try {
                      setFileUploading(true);
                      const urlRequest = await fetch("/api/image");
                      const urlResponse = await urlRequest.json();
                      const upload = await pinata.upload.public
                        .file(file)
                        .name(`${Date.now()}-${file.name}`)
                        .url(urlResponse.url);
                      //  console.log(upload);
                      field.onChange(upload.cid);
                      setFileUploading(false);
                    } catch (e) {
                      //console.log(e);
                      setFileUploading(false);
                    }
                  }}
                />
              </FormControl>
              {form.getValues("image") && (
                <div className="mt-2">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_GATEWAY}/${form.getValues(
                      "image"
                    )}`}
                    alt="Product Image"
                    width={100}
                    height={100}
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: { id: Number; name: string }) => (
                    <SelectItem
                      key={category.id.toString()}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={fileUploading || form.formState.isSubmitting}
        >
          {fileUploading
            ? "Uploading..."
            : selectedProduct
            ? "Update Product"
            : "Add Product"}
        </Button>
      </form>
    </Form>
  );
}
