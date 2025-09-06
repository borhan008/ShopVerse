"use server";

import prisma from "@/lib/db";
import {
  TCategoryFormValues,
  TProductFormValues,
  TUserFormValues,
  TUserLoginFormValues,
  validateCategorySchema,
  validateOrderStatus,
  validateProductSchema,
  validateUserLoginSchema,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth, signIn } from "@/lib/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Category, Product } from "@/generated/prisma";
import { checkUser } from "@/lib/utils-server";
import { TCart } from "@/types/types";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

// Login

// Categories
export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
// Products

export const createProduct = async (newProduct: TProductFormValues) => {
  try {
    const validatedData = validateProductSchema.safeParse(newProduct);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newProduct.name.toLowerCase().replace(/\s+/g, "-");
    while (await prisma.product.findUnique({ where: { slug: slug } })) {
      slug += `-${Math.floor(Math.random() * 1000)}`;
    }
    const product = await prisma.product.create({
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });

    revalidatePath("/admin/products");
    console.error("data:", product);

    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: number,
  newProduct: TProductFormValues
) => {
  try {
    const validatedData = validateProductSchema.safeParse(newProduct);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newProduct.name.toLowerCase().replace(/\s+/g, "-");
    while (await prisma.product.findUnique({ where: { slug: slug } })) {
      //console.log(slug);
      slug += `-${Math.floor(Math.random() * 1000)}`;
    }
    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });
    revalidatePath("/admin/products");

    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const product = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin/products");
    return product;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

export const fetchProducts = async (
  skip: number,
  perPage: number,
  category?: string,
  search?: string
) => {
  try {
    let where = {
      AND: [] as {}[],
    };

    if (category) {
      where.AND.push({
        category: {
          OR: [] as { id: number }[],
        },
      });
      let cat = await prisma.category.findUnique({
        where: { slug: category },
        select: {
          id: true,
          parentId: true,
        },
      });
      if (!cat) {
        return {
          products: [],
          total: 0,
        };
      }
      let q = [] as Number[];
      q.push(cat?.id);

      while (q.length) {
        const x = q.pop();

        if (!x) break;
        where.AND.at(0)?.category?.OR.push({ id: x });

        const res = await prisma.category.findMany({
          select: {
            id: true,
          },
          where: {
            parentId: Number(x),
          },
        });

        res.forEach((r) => q.push(r.id));
      }
    }
    if (search) {
      where.AND.push({
        OR: [
          { description: { contains: search || "" } },
          { name: { contains: search || "" } },
        ],
      });
    }

    console.log(where);
    const products = await prisma.product.findMany({
      skip: skip * perPage,
      take: perPage,
      where,
      orderBy: {
        id: "desc",
      },
    });

    const total = await prisma.product.count({
      where,
    });
    return { products: products, total: total };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
    });

    return {
      product: product,
    };
  } catch (error) {
    throw new Error("Can't find this.");
  }
};

// Categories
export const fetchCategories = async () => {
  try {
    const data = await prisma.category.findMany({});
    return {
      categories: data,
    };
  } catch (error) {
    console.error("Error fetching categories", error);
    throw error;
  }
};

export const createCategory = async (newCategory: TCategoryFormValues) => {
  try {
    const validatedData = validateCategorySchema.safeParse(newCategory);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newCategory.name.toLowerCase().replace(/\s+/g, "-");

    const isAvaialble = await prisma.category.findUnique({
      where: { slug: slug },
    });
    if (isAvaialble) {
      throw new Error("Category with this name already exists");
    }

    const category = await prisma.category.create({
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("Error creating category", error);
    throw error;
  }
};

export const updateCategory = async (
  id: number,
  newCategory: TCategoryFormValues
) => {
  try {
    const validatedData = validateCategorySchema.safeParse(newCategory);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Validation failed: " + validatedData.error.message);
    }
    let slug = newCategory.name.toLowerCase().replace(/\s+/g, "-");

    const isAvaialble = await prisma.category.findUnique({
      where: { slug: slug },
    });
    if (isAvaialble) {
      throw new Error("Category with this name already exists");
    }

    const category = await prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...validatedData.data,
        slug: slug,
      },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("Error updating category", error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const category = await prisma.category.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin/categories");
    return category;
  } catch (error) {
    console.error("Error deleting category", error);
    throw error;
  }
};

export const fetchCategoriesSorted = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const mp = new Map();
    const adj = new Map();
    for (let i = 0; i < categories.length; i++) {
      mp.set(categories[i].id, i);
      if (!adj.has(categories[i].id)) adj.set(categories[i].id, []);
      if (categories[i].parentId != 0) {
        adj.get(categories[i].parentId).push(categories[i].id);
      }
    }
    let visited = new Array(categories.length + 2).fill(false);

    console.log(mp, adj);
    let sortedCategories = [];

    const dfs = (i: number, parent: any) => {
      if (visited[mp.get(i)]) return;
      visited[mp.get(i)] = true;

      if (!parent?.hasOwnProperty("child")) {
        parent.child = [];
      }
      for (let child of adj.get(i)) {
        if (!visited[mp.get(child)]) {
          console.log(child, i);
          parent.child.push(categories[mp.get(child)]);
          const parent2 = parent.child[parent.child.length - 1];
          dfs(child, parent2);
        }
      }
    };
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].parentId == 0) {
        sortedCategories.push(categories[i]);
        const parent = sortedCategories.find(
          (cat: Category) => cat.id === categories[i].id
        );
        dfs(categories[i].id, parent);
      }
    }

    console.log(sortedCategories);
    return { sortedCategories, categories };
  } catch (error) {
    console.error("Error fetching sorted categories", error);
    throw error;
  }
};

// Users
export const login = async (userData: TUserLoginFormValues) => {
  try {
    const validateUserData = validateUserLoginSchema.safeParse(userData);
    if (!validateUserData.success) {
      console.error("Validation error:", validateUserData.error);
      throw new Error("Validation failed: " + validateUserData.error.message);
    }

    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!user) {
      throw new Error("User email not found");
    }

    const isPasswordValid = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const res = await signIn("credentials", {
      redirect: false,
      email: userData.email,
      password: userData.password,
    });
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Login error:", error);
    throw new Error("Login failed: " + error?.message);
  }
};

export const signUp = async (userData: TUserFormValues) => {
  try {
    const validateUserData = validateUserLoginSchema.safeParse(userData);
    if (!validateUserData.success) {
      console.error("Validation error:", validateUserData.error);
      throw new Error("Validation failed: " + validateUserData.error.message);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: "USER",
      },
    });

    const res = await signIn("credentials", {
      redirect: false,
      email: userData.email,
      password: userData.password,
    });
    if (res)
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    else throw new Error("Something went wrong during signin");
  } catch (error) {
    console.error("Signup error:", error);
    throw new Error(
      "Signup failed: " + (error?.message || "Something went wrong")
    );
  }
};

export const fetchUsersAdmin = async (
  skip: number,
  perPage: number,
  search?: string
) => {
  const session = await checkUser();
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "You're unauthorized.",
      data: [],
    };
  }

  try {
    let where = {};
    if (search) {
      where = {
        OR: [
          { name: { contains: search || "" } },
          { email: { contains: search || "" } },
          { address: { contains: search || "" } },
        ],
      };
    }
    const users = await prisma.user.findMany({
      skip: skip * perPage,
      take: perPage,
      where: where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        address: true,
        orders: {
          select: { total: true },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const total = await prisma.user.count({
      where,
    });

    return {
      success: true,
      data: users || [],
      message: "Users fetched succesfully.",
      total: total,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const deleteUserAdmin = async (id: string) => {
  const session = await checkUser();
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "You're unauthorized.",
      data: null,
    };
  }

  try {
    await prisma.user.delete({
      where: { id },
    });

    return {
      success: true,
      message: "User deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

// Add to Cart
export const addToCart = async (productId: number, quantity: number) => {
  const session = await checkUser();
  if (!session) {
    return {
      message: "You must be logged in to add to cart",
      success: false,
    };
  }
  try {
    const checkProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });
    if (!checkProduct) {
      return {
        message: "Product not found",
        success: false,
      };
    }
    if (checkProduct.stock < quantity) {
      return {
        message: "Not enough stock",
        success: false,
      };
    }

    const cartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });
    if (cartItem) {
      if (checkProduct.stock < cartItem.quantity + quantity) {
        //  console.log(cartItem.quantity, quantity);

        return {
          message: "Not enough stock. You might already have some in cart",
          success: false,
        };
      }
      await prisma.cart.update({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: productId,
          },
        },
        data: { quantity: cartItem.quantity + quantity },
      });
    } else {
      await prisma.cart.create({
        data: {
          userId: session.user.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return {
      message: "Product added to cart",
      success: true,
    };
  } catch (error) {
    console.error("Error adding to cart", error);
    return {
      message: "Something went wrong",
      success: false,
    };
  }
};

export const fetchCartItems = async () => {
  const session = await checkUser();
  if (!session) {
    return {
      cartItems: [],
      total: 0,
      message: "You must be logged in to view cart",
      success: false,
    };
  }
  try {
    const cartItems = await prisma.cart.findMany({
      where: { userId: session.user.id },
      include: { product: true },
    });

    return {
      cartItems,
      message: "Cart items fetched",
      success: true,
    };
  } catch (error) {
    console.error("Error fetching cart items", error);
    return {
      cartItems: [],
      total: 0,
      message: "Something went wrong",
      success: false,
    };
  }
};

export const deleteCartItem = async (productId: number) => {
  const session = await checkUser();
  if (!session) {
    return {
      cartItems: [],
      total: 0,
      message: "You must be logged in to view cart",
      success: false,
    };
  }

  try {
    const findCart = await prisma.cart.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: productId,
        },
      },
    });
    return {
      success: true,
      message: "Deleted successfully",
    };
  } catch (error) {
    return {
      success: true,
      message: "Something went wrong.",
    };
  }
};

export const updateCartItems = async (carts: TCart[]) => {
  const session = await checkUser();
  if (!session) {
    return {
      cartItems: [],
      total: 0,
      message: "You must be logged in to view cart",
      success: false,
    };
  }

  try {
    carts.forEach(async (cart) => {
      await prisma.cart.update({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId: cart.productId,
          },
        },
        data: { quantity: cart.quantity },
      });
    });
    return {
      success: true,
      message: "Updated carts.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

// Strip Payment

export const checkoutSession = async (cartItems: TCart[]) => {
  const session = await checkUser();
  if (!session) {
    return {
      message: "You must be logged in to checkout",
      success: false,
    };
  }
  const stripeCheckout = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    metadata: {
      type: "cart",
      productsId: cartItems.map((item) => item.productId).join(","),
    },
    line_items: cartItems.map((item) => ({
      price_data: {
        currency: "usd",

        product_data: {
          name: item.product.slug,
          description: item.product.name,
          images: [`${process.env.NEXT_PUBLIC_GATEWAY}/${item.product.image}`],
        },

        unit_amount: item.product.price * 100,
      },

      quantity: item.quantity,
    })),

    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=false`,
    shipping_address_collection: { allowed_countries: ["BD", "CA", "GB"] },
  });
  if (stripeCheckout.url) redirect(stripeCheckout.url);
};

export const buyNowCheckout = async (productId: number, quantity: number) => {
  const session = await checkUser();
  if (!session) {
    return {
      message: "You must be logged in to checkout",
      success: false,
    };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) {
    return {
      message: "Product not found",
      success: false,
    };
  }
  const stripeCheckout = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    metadata: {
      type: "buynow",
    },
    line_items: [
      {
        price_data: {
          currency: "usd",

          product_data: {
            name: product.slug,
            description: product.name,
            images: [`${process.env.NEXT_PUBLIC_GATEWAY}/${product.image}`],
          },

          unit_amount: product.price * 100,
        },

        quantity: quantity,
      },
    ],

    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=false`,
    shipping_address_collection: { allowed_countries: ["BD", "CA", "GB"] },
  });
  if (stripeCheckout.url) redirect(stripeCheckout.url);
};

// Orders

export const fetchOrders = async () => {
  const session = await checkUser();
  if (!session) {
    return {
      success: false,
      message: "You're unauthorized.",
      data: [],
    };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      success: true,
      data: orders || [],
      message: "Orders fetched succesfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const fetchOrdersAdmin = async (skip: number, perPage: number) => {
  const session = await checkUser();
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "You're unauthorized.",
      data: [],
    };
  }

  try {
    const orders = await prisma.order.findMany({
      skip: skip * perPage,
      take: perPage,

      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    const total = await prisma.order.count();

    return {
      success: true,
      data: orders || [],
      message: "Orders fetched succesfully.",
      total: total,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const updateOrderStatus = async (id: number, status: string) => {
  const session = await checkUser();
  if (!session || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "You're unauthorized.",
      data: null,
    };
  }

  const validateStatus = validateOrderStatus.safeParse({ status: status });
  if (!validateStatus.success) {
    return {
      success: false,
      message: status + " Validation failed: " + validateStatus.error.message,
      data: null,
    };
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status: validateStatus.data.status },
    });

    return {
      success: true,
      message: "Order status updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
};

export const fetchUserOrderAdmin = async (id: string) => {
  const session = await checkUser();
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const res = await prisma.order.findMany({
      where: {
        userId: id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    return {
      success: true,
      message: "User order fetched successfully",
      data: res,
    };
  } catch (error) {
    return {
      success: true,
      message: "Something went wrong",
      data: [],
    };
  }
};
