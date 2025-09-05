import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/signin",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const res = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // console.log(res);
        if (!res) {
          return null;
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          res.password
        );

        if (isPasswordValid) {
          return res;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      return token;
    },

    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.role = token.role;

      return session;
    },

    authorized({ request, auth }) {
      const pathname = request.nextUrl.pathname;

      if (
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/api/") ||
        pathname.startsWith("/favicon.ico")
      ) {
        return true;
      }

      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }
      if (
        (pathname.startsWith("/signup") && auth?.user) ||
        (pathname.startsWith("/signin") && auth?.user)
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (pathname.startsWith("/checkout") || pathname.startsWith("/cart")) {
        return auth?.user;
      }
      return true;
    },

    redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
});
