"use server";

import { Product } from "@/generated/prisma";
import prisma from "@/lib/db";
import {
  TCategoryFormValues,
  TProductFormValues,
  validateCategorySchema,
  validateProductSchema,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createProduct = async (newProduct: TProductFormValues) => {
  try {
    const validatedData = validateProductSchema.safeParse(newProduct);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newProduct.name.toLowerCase().replace(/\s+/g, "-");
    while (await prisma.product.findUnique({ where: { slug: slug } })) {
      slug += `-${Math.floor(Math.random() * 1000)}`;
    }
    const product = await prisma.product.create({
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });
    // revalidatePath("/admin/products");
    console.error("data:", product);

    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  newProduct: TProductFormValues
) => {
  try {
    const validatedData = validateProductSchema.safeParse(newProduct);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newProduct.name.toLowerCase().replace(/\s+/g, "-");
    while (await prisma.product.findUnique({ where: { slug: slug } })) {
      console.log(slug);
      slug += `-${Math.floor(Math.random() * 1000)}`;
    }
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });
    revalidatePath("/admin/products");

    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const product = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin/products");
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchProducts = async (skip: number, perPage: number) => {
  try {
    const products = await prisma.product.findMany({
      skip: skip * perPage,
      take: perPage,

      orderBy: {
        id: "desc",
      },
    });
    const total = await prisma.product.count();
    return { products: products, total: total };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Categories
export const fetchCategories = async () => {
  try {
    const data = await prisma.category.findMany({});
    return {
      categories: data,
    };
  } catch (error) {
    console.error("Error fetching categories", error);
    throw error;
  }
};

export const createCategory = async (newCategory: TCategoryFormValues) => {
  try {
    const validatedData = validateCategorySchema.safeParse(newCategory);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newCategory.name.toLowerCase().replace(/\s+/g, "-");

    const isAvaialble = await prisma.category.findUnique({
      where: { slug: slug },
    });
    if (isAvaialble) {
      throw new Error("Category with this name already exists");
    }

    const category = await prisma.category.create({
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("Error creating category", error);
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  newCategory: TCategoryFormValues
) => {
  try {
    const validatedData = validateCategorySchema.safeParse(newCategory);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newCategory.name.toLowerCase().replace(/\s+/g, "-");

    const isAvaialble = await prisma.category.findUnique({
      where: { slug: slug },
    });
    if (isAvaialble) {
      throw new Error("Category with this name already exists");
    }

    const category = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("Error updating category", error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const category = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("Error deleting category", error);
    throw error;
  }
};
