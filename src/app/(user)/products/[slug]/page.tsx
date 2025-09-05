import { fetchProductBySlug } from "@/app/actions/actions";
import H1 from "@/components/h1";
import ProductCategories from "@/components/product-categories";
import ProductDetailsBtn from "@/components/product-details-btn";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const { product } = await fetchProductBySlug(slug as string);
  if (!product) {
    return (
      <div className="w-full gap-4 flex-col text-center flex items-center justify-center min-h-screen">
        <Image
          src="/shop-login.png"
          alt="Image"
          className="min-w-[200px]"
          width={100}
          height={100}
        />
        <H1>There is no such product.</H1>
        <Button asChild>
          <Link href="/products">Products</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex w-full md:flex-row flex-col gap-8 justify-between max-w-5xl mx-auto">
        <div className="w-full  flex-1 min-w-sm sm:w-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_GATEWAY}/${product?.image}`}
            alt={product?.name || "Product"}
            width={100}
            height={100}
            className="w-full mt-5 max-h-[300px] object-contain "
          />
        </div>
        <div className="mt-5 max-w-[50%] flex-1">
          <H1 className="">{product?.name}</H1>
          <ProductCategories
            parentId={product.categoryId}
            name={product.name}
          />
          <p className="text-3xl font-bold mt-4">${product?.price}</p>
          <p>
            <strong>Stock : </strong> {product?.stock}
          </p>
          <ProductDetailsBtn stock={product?.stock} productId={product?.id} />
        </div>
      </div>
      <div className="my-10">
        <H1 className="mb-4">Description</H1>
        <p className="text-muted-foreground">{product?.description}</p>
      </div>
    </div>
  );
}
