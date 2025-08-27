import { fetchCategories, fetchProducts } from "@/app/actions/actions";
import ProductProvider from "@/context/product-context";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchProducts(0, 2);
  const categories = await fetchCategories();
  return (
    <ProductProvider
      data={data.products}
      total={data.total}
      category={categories.categories}
    >
      <div className="container mx-auto">{children}</div>
    </ProductProvider>
  );
}
