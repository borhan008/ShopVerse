"use client";

import { useUserProductContext } from "@/context/user-product-context";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProductCategories({
  parentId,
  name,
}: {
  parentId: number;
  name: string;
}) {
  const { unsortedCategory } = useUserProductContext();
  const [categoryLists, setCategoryLists] = useState<string[] | []>([]);

  useEffect(() => {
    const func = () => {
      while (parentId && parentId != 0) {
        const cat = unsortedCategory.find((s) => s.id === parentId);
        if (!cat) return;
        // console.log(cat.name);
        setCategoryLists((prev) => [cat.name, ...prev]);
        parentId = cat?.parentId;
      }
    };
    func();
  }, []);
  return (
    <div className="text-xs">
      {categoryLists.length > 0 &&
        categoryLists.map((category) => (
          <span key={category}>
            {category} <ArrowRight className="inline" size="12px" />{" "}
          </span>
        ))}
      <span>{name}</span>
    </div>
  );
}
