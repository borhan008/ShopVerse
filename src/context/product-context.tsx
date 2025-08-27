"use client";
import { Category, Product } from "@/generated/prisma";
import { TProductFormValues, validateProductSchema } from "@/lib/validation";
import React, {
  createContext,
  startTransition,
  useContext,
  useOptimistic,
  useState,
} from "react";
import { toast } from "sonner";
import {
  createProduct,
  deleteCategory,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../app/actions/actions";

type TProductContext = {
  products: Product[];
  handleAddProduct: (newProduct: TProductFormValues) => void;
  total: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  handleUpdateProduct: (id: number, newProduct: TProductFormValues) => void;
  handleDeleteProduct: (id: number) => void;
  handleFetchProduct: (
    skip: number,
    take: number
  ) => Promise<Product[] | null> | [];
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  handleDeleteCategory: (id: number) => Promise<void>;
};

type ProductProviderProps = {
  children: React.ReactNode;
  data: Product[];
  total: number;
  category: Category[];
};

export const ProductContext = createContext<TProductContext | null>(null);

export default function ProductProvider({
  children,
  data,
  total,
  category,
}: ProductProviderProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [payload as Product, ...state];
        case "update":
          return state.map((product) =>
            product.id === (payload as Product).id
              ? (payload as Product)
              : product
          );

        case "delete":
          return state.filter((product) => product.id !== payload.id);

        case "set":
          return [...state, ...(payload as Product[])];

        default:
          return state;
          break;
      }
    }
  );

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [categories, setCategories] = useOptimistic(category);

  const handleAddProduct = async (newProduct: TProductFormValues) => {
    const validateProduct = validateProductSchema.safeParse(newProduct);

    if (!validateProduct.success) {
      toast.error("Please fill all the fields correctly.");
      return;
    }
    console.log("Adding new product:", validateProduct.data);
    const newProd = {
      ...validateProduct.data,
      id: products[0].id + 1 || Math.floor(Math.random() * 1000000),
      slug: "random",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts({
      action: "add",
      payload: newProd,
    });
    try {
      await createProduct(validateProduct.data);
      toast.success("Product created successfully!");
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleUpdateProduct = async (
    id: number,
    newProduct: TProductFormValues
  ) => {
    const validateProduct = validateProductSchema.safeParse(newProduct);

    if (!validateProduct.success) {
      toast.error("Please fill all the fields correctly.");
      return;
    }
    console.log("Updating product:", validateProduct.data);
    const updatedProd = {
      ...validateProduct.data,
      id: id,
      slug: "random",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts({
      action: "update",
      payload: updatedProd,
    });
    try {
      await updateProduct(id, validateProduct.data);
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleFetchProduct = async (skip: number, take: number) => {
    try {
      const data = await fetchProducts(skip, take);
      return data.products;
    } catch (error) {
      toast.error("Failed to fetch products");
      return [];
    }
  };
  const handleDeleteProduct = async (id: number) => {
    try {
      setProducts({
        action: "delete",
        payload: { id },
      });
      await deleteProduct(id);
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Categories
  const handleDeleteCategory = async (id: number) => {
    try {
      const res = await deleteCategory(id);
      toast.success("Category deleted");
    } catch (error) {
      toast.error("Something went wrong");
    }
    return;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        handleAddProduct,
        total,
        open,
        setOpen,
        selectedProduct,
        setSelectedProduct,
        handleUpdateProduct,
        handleDeleteProduct,
        handleFetchProduct,
        categories,
        selectedCategory,
        setSelectedCategory,
        handleDeleteCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
