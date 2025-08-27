import { Role } from "@/generated/prisma";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    email: string;
    name: string;
  }
  interface Session {
    user: User;
  }
}

import { JWT } from "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    email: string;
    name: string;
  }
}
