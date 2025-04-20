// app/routes/sessions.ts

import { createUserSession } from "@/lib/session.server";
import type { ActionFunction } from "react-router";

export const action: ActionFunction = async ({ request }) => {
  const { idToken, uid, email, displayName } = await request.json();

  // Puedes validar aquí que idToken y uid existan, lanzar error si no.
  if (!idToken || !uid || !email) {
    return Response.json(
      { error: "Datos de sesión incompletos" },
      { status: 400 }
    );
  }

  // Crea la cookie de sesión y redirige a /admin
  return createUserSession({ idToken, uid, email, displayName }, "/admin");
};
