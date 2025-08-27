"use client";

import { signUp } from "@/app/actions/actions";
import H1 from "@/components/h1";
import { GenericField } from "@/components/product-input-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TUserFormValues, validateUserSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignUp() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<TUserFormValues>({
    resolver: zodResolver(validateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="mx-auto w-full">
      <H1 className="text-3xl  font-bold ">Sign Up</H1>
      <p className="font-light mb-4 py-1">Let's start your journey with us.</p>

      <Form {...form}>
        <form
          action={async () => {
            startTransition(async () => {
              const validate = await form.trigger();
              if (!validate) return;
              const data = form.getValues();
              try {
                const res = await signUp(data);
                toast.success("Account created successfully");
                form.reset();
              } catch (error) {
                toast.error(error?.message || "Something went wrong");
              }
            });
          }}
          className="w-full flex flex-col gap-6"
        >
          <GenericField
            name="name"
            label="Name"
            control={form.control as any}
            placeholder="Name"
          />
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

          <Button type="submit" className="h-[40px]" disabled={isPending}>
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </Form>

      <p className="text-sm mt-4">
        Already have an account?{" "}
        <Link className="underline" href="/signin">
          Sign In
        </Link>
      </p>
    </div>
  );
}
