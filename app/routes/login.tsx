import { LoginForm } from "@/modules/auth/components/login-form";
import type { Route } from "./+types/login";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { clientAuth } from "@/lib/firebase.client";
import { redirect } from "react-router";
import { requireUser } from "@/lib/session.server";
import { handleLoginError } from "@/modules/auth/utils/handle-login-errors";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const form = await request.formData();

  const email = form.get("email") as string;
  const password = form.get("password") as string;

  try {
    setPersistence(clientAuth, browserLocalPersistence);
    const { user } = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const idToken = await user.getIdToken();

    const res = await fetch("/login-server", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken,
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }),
    });

    if (!res.ok) throw new Error("No se pudo guardar la sesión en el servidor");
  } catch (error: any) {
    handleLoginError(error);
  }
  return redirect("/admin");
}

export async function loader({ request }: Route.LoaderArgs) {
  const user = await requireUser(request);
  if (user) return redirect("/admin");
  return null;
}

export default function Login() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <img src="/logos/with-text.webp" className="w-40 mx-auto" alt="logo" />
        <LoginForm />
      </div>
    </div>
  );
}
