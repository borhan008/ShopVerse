"use client";

import H1 from "@/components/h1";
import { GenericField } from "@/components/product-input-field";
import { Button } from "@/components/ui/button";
import { TCheckoutFormValues, validateCheckoutSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";

export default function Page() {
  const form = useForm<TCheckoutFormValues>({
    resolver: zodResolver(validateCheckoutSchema),
    defaultValues: {
      fullName: "",
    },
  });

  return (
    <div>
      <H1>Checkout</H1>
      <Form {...form}>
        <form
          action={async () => {
            const validate = await form.trigger();
            if (!validate) return;

            return;
          }}
          className="max-w-lg mt-8 space-y-4"
        >
          <GenericField
            name="fullName"
            label="Full Name"
            type="text"
            control={form.control as any}
            placeholder="John Doe"
          />
          <GenericField
            name="address"
            label="Address"
            type="text"
            control={form.control as any}
            placeholder="123 Main St, City, Country"
          />
          <GenericField
            name="phone"
            label="Phone Number"
            type="text"
            control={form.control as any}
            placeholder="+1 234 567 890"
          />

          <Button type="submit" className="mt-4">
            Order Now
          </Button>
        </form>
      </Form>
    </div>
  );
}
