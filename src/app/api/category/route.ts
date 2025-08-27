import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return NextResponse.json({ data: categories, ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        data: [],
        ok: false,
        message: message || "Something went wrong",
      },
      { status: 500 }
    );
  }
};
