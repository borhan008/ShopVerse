import { UserProductContextProvider } from "@/context/user-product-context";
import {
  fetchCategories,
  fetchCategoriesSorted,
  fetchProducts,
} from "../actions/actions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const PRODUCT_PER_PAGE = 10;

  const categories = await fetchCategoriesSorted();
  const products = await fetchProducts(0, PRODUCT_PER_PAGE);
  //console.log("products in layout", products);
  const initialProducts = products.products;
  const total = products.total;

  return (
    <UserProductContextProvider
      category={categories.sortedCategories}
      initialProducts={initialProducts}
      totalProducts={total}
      unsortedCategory={categories.categories}
    >
      <div className="">{children}</div>
    </UserProductContextProvider>
  );
}
