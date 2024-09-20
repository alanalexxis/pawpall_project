import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const headersList = headers();
  const sig = headersList.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      const supabase = createClient();

      const userId = checkoutSessionCompleted.metadata.userId; // Obtener userId
      console.log("Consultando usuario con id:", userId);

      // Actualizar en la base de datos
      const { data, error } = await supabase
        .from("profiles")
        .update({ premium: "yes" })
        .eq("id", userId); // Asegúrate de que el campo 'id' sea el correcto

      if (error) {
        console.error("Error actualizando el usuario:", error);
        return NextResponse.json(
          { error: "Error actualizando el usuario" },
          { status: 500 }
        );
      }

      console.log("Usuario actualizado:", data);
      break;

    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
