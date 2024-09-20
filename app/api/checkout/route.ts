import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function POST(request) {
  const { userId } = await request.json();

  const session = await stripe.checkout.sessions.create({
    success_url: "http://localhost:3000/success",
    line_items: [
      {
        price_data: {
          currency: "mxn",
          product_data: {
            name: "Plan premium Pawpal",
          },
          unit_amount: 3900,
        },
        quantity: 1,
      },
    ],
    metadata: { userId },
    mode: "payment",
  });

  return NextResponse.json(session);
}
