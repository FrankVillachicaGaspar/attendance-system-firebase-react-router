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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden lg:grid grid-cols-1 grid-rows-[auto_1fr] max-h-screen my-auto px-7 gap-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-black z-10 text-center text-2xl font-medium">
            Bienvenido al portal de Asistencias de R&S
          </h2>
          <p className="text-gray-500 z-10 text-center text-md">
            Liderando la eficiencia en el monitoreo de personal, con soluciones
            adaptadas a tus operaciones
          </p>
        </div>
        <img
          src="/img/login-side-image.webp"
          alt="Image"
          className="object-cover w-full"
        />
      </div>
      <div className="flex flex-col gap-4md:p-10 bg-red-500 py-6">
        <div className="flex flex-col gap-10 flex-1 items-center justify-center">
          <h1 className="text-6xl font-light text-center text-white">R&S</h1>
          <div className="w-ful">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
