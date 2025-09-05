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
import { setDate } from "date-fns";

type TProductContext = {
  products: Product[];
  handleAddProduct: (newProduct: TProductFormValues) => void;
  total: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  handleUpdateProduct: (id: number, newProduct: TProductFormValues) => void;
  handleDeleteProduct: (id: number, currentPage: number) => void;
  handleFetchProduct: (
    skip: number,
    take: number
  ) => Promise<Product[] | null> | [];
  categories: Category[];
  selectedCategory: Category | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  handleDeleteCategory: (id: number) => Promise<void>;
  allProducts: Product[];
  setAllProducts: React.Dispatch<React.SetStateAction<Product[]>>;
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

  const [allProducts, setAllProducts] = useState(data);

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
    // console.log("Adding new product:", validateProduct.data);

    try {
      const newProd = await createProduct(validateProduct.data);
      setAllProducts((prev) => [newProd, ...prev]);
      total = total + 1;
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
    //  console.log("Updating product:", validateProduct.data);

    try {
      await updateProduct(id, validateProduct.data);
      setAllProducts((prev) =>
        prev.map((prod) => (prod.id === id ? { ...prod, ...newProduct } : prod))
      );
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
  const handleDeleteProduct = async (id: number, currentPage: number) => {
    try {
      await deleteProduct(id);
      setAllProducts((prev) => prev.filter((prod) => prod.id !== id));
      const data = await handleFetchProduct(currentPage - 1, 2);
      total--;
      setAllProducts(data || []);
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
        allProducts,
        setAllProducts,
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
