"use client";

import { fetchProducts } from "@/app/actions/actions";
import { Category, Product } from "@/generated/prisma";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type TUserProductContext = {
  categories: Category[];
  products: Product[];
  selectedProduct: Product | null;
  search: string;
  selectedCategory: {
    name: string;
    slug: string;
  };
  unsortedCategory: Category[];
  setSelectedCategory: Dispatch<
    SetStateAction<{
      name: string;
      slug: string;
    }>
  >;
  setSearch: Dispatch<SetStateAction<string>>;
  total: number;
  skip: number;
  setSkip: Dispatch<SetStateAction<number>>;
  perPage: number;
};

const UserProductContext = createContext<TUserProductContext | null>(null);

type TUserProductContextProps = {
  children: React.ReactNode;
  category: Category[];
  initialProducts: Product[];
  unsortedCategory: Category[];
  totalProducts: number;
};

export const UserProductContextProvider = ({
  children,
  category,
  initialProducts,
  totalProducts,
  unsortedCategory,
}: TUserProductContextProps) => {
  const [categories, setCategories] = useState(category);
  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(totalProducts);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    name: "",
    slug: "",
  });
  const [perPage, setPerPage] = useState(1);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const fetchingProduct = async () => {
      setSkip(0);
      const newProducts = await fetchProducts(
        0,
        perPage,
        selectedCategory.slug,
        search
      );
      setTotal(newProducts.total);
      setProducts(newProducts.products);
    };

    fetchingProduct();
  }, [selectedCategory.slug, search]);

  useEffect(() => {
    const fetchingProduct = async () => {
      const newProducts = await fetchProducts(
        skip,
        perPage,
        selectedCategory.slug,
        search
      );
      console.log(skip, perPage, newProducts);
      setTotal(newProducts.total);
      setProducts(newProducts.products);
    };

    fetchingProduct();
  }, [perPage, skip]);

  return (
    <UserProductContext.Provider
      value={{
        categories,
        products,
        selectedProduct,
        search,
        selectedCategory,
        setSelectedCategory,
        setSearch,
        unsortedCategory,
        total,
        skip,
        perPage,
        setSkip,
      }}
    >
      {children}
    </UserProductContext.Provider>
  );
};

export const useUserProductContext = () => {
  const context = useContext(UserProductContext);
  if (!context) {
    throw new Error(
      "useUserProductContext must be used within a UserProductContextProvider"
    );
  }
  return context;
};
