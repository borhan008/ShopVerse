import prisma from "@/lib/db";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();

  const signature = request.headers.get("stripe-signature");
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Error constructing Stripe event:", error);
    return Response.json(null, {
      status: 400,
    });
  }

  const session = event.data.object;
  if (!session) return Response.json(null, { status: 400 });
  switch (event.type) {
    case "checkout.session.completed":
      if (!session.customer_details?.email) {
        console.error("No email found in session customer details");
        return Response.json(null, {
          status: 400,
        });
      }
      const findUser = await prisma.user.findUnique({
        where: { email: session.customer_details.email },
      });

      const userId = findUser?.id;
      if (!userId) {
        console.error("User not found for email:");
        return Response.json(null, {
          status: 400,
        });
      }

      if (!session?.shipping) return Response.json(null, { status: 400 });
      const addressParts = [
        session?.shipping?.address?.postal_code,
        session?.shipping?.address?.line1,
        session?.shipping?.address?.line2,
        session?.shipping?.address?.city,
        session?.shipping?.address?.state,
        session?.shipping?.address?.country,
      ];
      const order = await prisma.order.create({
        data: {
          userId: userId,
          total: session.amount_total ? session.amount_total / 100 : 0,
          address: addressParts.filter(Boolean).join(", "),
        },
      });
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      for (const item of lineItems.data) {
        const price = item.price?.unit_amount
          ? item.price.unit_amount / 100
          : 0;
        const quantity = item.quantity ? item.quantity : 1;
        const description = item.description;
        const findProduct = await prisma.product.findUnique({
          where: { slug: description },
        });
        if (!findProduct) return Response.json(null, { status: 400 });
        await prisma.product.update({
          where: { id: findProduct?.id },
          data: { stock: { decrement: quantity } },
        });
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: findProduct.id,
            quantity: quantity,
            price: price,
          },
        });

        if (session?.metadata?.type === "cart") {
          await prisma.cart.deleteMany({
            where: { userId: userId },
          });
        }
      }
      break;
    default:
      break;
  }

  //console.log(event);
  return Response.json(null, {
    status: 200,
  });
}
