"use client";

import { Category } from "@/generated/prisma";
import { createContext, useOptimistic } from "react";

type TCateagoryContext = {
  categories: Category[];
};

const CategoryContext = createContext<TCateagoryContext | null>(null);

type TCategoryContextProps = {
  children: React.ReactNode;
  category: Category[];
};

export const CategoryContextProvide = ({
  children,
  category,
}: TCategoryContextProps) => {
  const [categories, setCategories] = useOptimistic(category);

  return (
    <CategoryContext.Provider value={{ categories }}>
      {children}
    </CategoryContext.Provider>
  );
};
