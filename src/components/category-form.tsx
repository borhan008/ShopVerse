"use client";

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
import { GenericField } from "./product-input-field";
import { useForm } from "react-hook-form";
import { TCategoryFormValues, validateCategorySchema } from "@/lib/validation";
import { useProductContext } from "@/context/product-context";
import { createCategory, updateCategory } from "@/app/actions/actions";
import { useTransition } from "react";

export default function CategoryForm() {
  const { categories, selectedCategory, setOpen } = useProductContext();
  const [isPending, startTransition] = useTransition();
  const form = useForm<TCategoryFormValues>({
    resolver: zodResolver(validateCategorySchema),
    defaultValues: {
      name: selectedCategory?.name || "",
      parentId: selectedCategory?.parentId || 0,
    },
  });
  return (
    <Form {...form}>
      <form
        action={async () => {
          startTransition(async () => {
            const isValid = await form.trigger();
            if (!isValid) {
              toast.error("Please fix the errors in the form");
              return;
            }
            const formData = form.getValues();
            try {
              const res = selectedCategory
                ? await updateCategory(selectedCategory.id, formData)
                : await createCategory(formData);
              toast.success(
                `Category ${
                  selectedCategory ? "updated" : "created"
                } successfully`
              );
              form.reset();
              setOpen(false);
            } catch (error) {
              toast.error(
                error?.message || "There was an error creating the category"
              );
              return;
            }
          });
        }}
        className="space-y-4"
      >
        <GenericField
          name="name"
          label="Category name"
          control={form.control as any}
          placeholder="Category Name"
        />

        <FormField
          control={form.control as any}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Parent Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">No parent</SelectItem>
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Add Category"}
        </Button>
      </form>
    </Form>
  );
}
