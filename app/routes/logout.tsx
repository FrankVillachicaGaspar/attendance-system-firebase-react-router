import { clientAuth } from "@/lib/firebase.client";
import { signOut } from "firebase/auth";
import { redirect } from "react-router";

export async function clientAction() {
  await signOut(clientAuth);
  const _ = await fetch("/logout-server", {
    method: "POST",
  });
  return redirect("/");
}

export function clientLoader() {
  return redirect("/");
}
