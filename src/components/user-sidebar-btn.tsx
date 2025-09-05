"use client";

import { useUserProductContext } from "@/context/user-product-context";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type TUserSidebarBtnProps = {
  slug: string;
  children: React.ReactNode;
};

export default function UserSidebarBtn({
  slug,
  children,
}: TUserSidebarBtnProps) {
  const { setSelectedCategory, selectedCategory } = useUserProductContext();
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={() => {
        setSelectedCategory({
          name: children?.toString() || "",
          slug,
        });
        router.push("/products");
      }}
      className={`w-full justify-start  ${
        selectedCategory.slug === slug && "bg-gray-200"
      }`}
    >
      {children}
    </Button>
  );
}
