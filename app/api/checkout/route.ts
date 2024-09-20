import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51Q07ifBmIm6Fjm2peSeuOf4pgUGOoKp2kLNo38ANAcVFFRV7zBJOCvOeaphobsLKLZb1X8W8d56fa8nk8DHLh6HG0013mJSWmO"
);
export async function POST(request) {
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
    mode: "payment",
  });

  return NextResponse.json(session);
}
