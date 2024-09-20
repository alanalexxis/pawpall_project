import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51Q07ifBmIm6Fjm2peSeuOf4pgUGOoKp2kLNo38ANAcVFFRV7zBJOCvOeaphobsLKLZb1X8W8d56fa8nk8DHLh6HG0013mJSWmO"
);

export async function POST(request) {
  const body = await request.text();
  console.log(body);
  return NextResponse.json("recibiendo webhook");
}
