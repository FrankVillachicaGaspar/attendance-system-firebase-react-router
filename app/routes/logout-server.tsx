import { logout } from "@/lib/session.server";
import type { Route } from "./+types/logout-server";

export async function action({ request }: Route.ActionArgs) {
  return await logout(request);
}
