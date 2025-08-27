"use server";

import prisma from "@/lib/db";
import {
  TCategoryFormValues,
  TProductFormValues,
  TUserFormValues,
  TUserLoginFormValues,
  validateCategorySchema,
  validateProductSchema,
  validateUserLoginSchema,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Login

// Categirues
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
// Products

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

// Users
export const login = async (userData: TUserLoginFormValues) => {
  try {
    const validateUserData = validateUserLoginSchema.safeParse(userData);
    if (!validateUserData.success) {
      console.error("Validation error:", validateUserData.error);
      throw new Error("Validation failed: " + validateUserData.error.message);
    }

    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!user) {
      throw new Error("User email not found");
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const res = await signIn("credentials", {
      redirect: false,
      email: userData.email,
      password: userData.password,
    });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Login error:", error);
    throw new Error("Login failed: " + error?.message);
  }
};

export const signUp = async (userData: TUserFormValues) => {
  try {
    const validateUserData = validateUserLoginSchema.safeParse(userData);
    if (!validateUserData.success) {
      console.error("Validation error:", validateUserData.error);
      throw new Error("Validation failed: " + validateUserData.error.message);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: "USER",
      },
    });

    const res = await signIn("credentials", {
      redirect: false,
      email: userData.email,
      password: userData.password,
    });
    if (res)
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    else throw new Error("Something went wrong during signin");
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error(
      "Signup failed: " + (error?.message || "Something went wrong")
    );
  }
};
