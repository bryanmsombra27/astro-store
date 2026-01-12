import type { APIRoute } from "astro";
import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  console.log(body, "BODY DE LA REQUEST");

  const productsToPay = body.map((product: any) => ({
    price_data: {
      currency: "mxn",
      product_data: {
        name: product.title,
      },

      unit_amount: product.quantity * product.price * 100, // centavos
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    // line_items: [
    //   {
    //     price_data: {
    //       currency: "mxn",
    //       product_data: {
    //         name: "Producto de ejemplo",
    //       },
    //       unit_amount: 10000, // centavos
    //     },
    //     quantity: 1,
    //   },
    // ],
    line_items: productsToPay,
    success_url: `${import.meta.env.PUBLIC_URL}/success`,
    cancel_url: `${import.meta.env.PUBLIC_URL}/cancel`,
  });

  return new Response(JSON.stringify({ url: session.url }), { status: 200 });
};
