"use client";

import H1 from "@/components/h1";
import { GenericField } from "@/components/product-input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  validateUserLoginSchema,
  TUserLoginFormValues,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/app/actions/actions";
import { toast } from "sonner";
import { useTransition } from "react";

export default function SignIn() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<TUserLoginFormValues>({
    resolver: zodResolver(validateUserLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className="mx-auto w-full">
      <H1 className="text-3xl  font-bold ">Sign In</H1>
      <p className="font-light mb-4 py-1">Let's start your journey with us.</p>

      <Form {...form}>
        <form
          action={async () => {
            startTransition(async () => {
              const validate = await form.trigger();
              if (!validate) return;
              const data = form.getValues();
              try {
                const res = await login(data);
                if (!res) {
                  toast.error("Invalid credentials");
                  return;
                }
                form.reset();
                toast.success("Logged in successfully");
              } catch (error) {
                toast.error(error?.message || "Invalid credentials");
              }
            });
          }}
          className="w-full flex flex-col gap-6"
        >
          <GenericField
            name="email"
            label="Email"
            control={form.control as any}
            placeholder="Email"
          />
          <GenericField
            name="password"
            label="Password"
            control={form.control as any}
            placeholder="Password"
          />

          <Button type="submit" disabled={isPending} className="h-[40px]">
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <p className="text-sm mt-4">
        Don't have an account?{" "}
        <Link className="underline" href="/signup">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
