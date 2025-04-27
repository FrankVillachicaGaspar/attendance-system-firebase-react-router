import { Outlet, redirect, useLocation, useNavigation } from "react-router";
import type { Route } from "./+types/admin-layout";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import DashboardSidebar from "@/common/components/sidebar/dashboard-sidebar";
import { getCurrentEmployee } from "@/common/firestore/get-current-employee";
import { requireUser } from "@/lib/session.server";
import type { FirebaseAdminUser } from "@/common/types/firebase/FIrebaseAdminUser";
import type { FirebaseEmployee } from "@/common/types/firebase/FirebaseEmployee.type";
import { LoadingScreen } from "@/common/components/loading-screen";

export default function AdminLayout({ loaderData }: Route.ComponentProps) {
  const { user, employee } = loaderData;
  const navigation = useNavigation();

  const currentPath = useLocation().pathname;

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} employee={employee} />
      <div className="grid grid-cols-1 grid-rows-[auto_1fr] w-full">
        <header className="flex items-center gap-2 px-4 py-3">
          <SidebarTrigger />
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      {navigation.state === "loading" &&
        currentPath !== navigation.location?.pathname && <LoadingScreen />}
    </SidebarProvider>
  );
}

/**
 * La función loader se encarga de autenticar al usuario y obtener la información del mismo y de su empleado asociado.
 * Primero, se utiliza la función `requireUser` para verificar la identidad del usuario en Firebase. Si no se ha proporcionado un token de sesión válido,
 * se redirige al usuario a la página de inicio de sesión.
 * Luego, se utiliza la función `getCurrentEmployee` para obtener el objeto `employee` con la información del empleado asociado al usuario.
 * Si el empleado no tiene el rol de administrador, se borra la sesión y se redirige al usuario a la página de inicio de sesión.
 *
 * @param {Route.LoaderArgs} props - Los argumentos de la función loader.
 * @returns {Promise<Response | {user: FirebaseAdminUser;employee: FirebaseEmployee;}>} - Un objeto con la información del usuario y del empleado asociado.
 */
export async function loader({ request }: Route.LoaderArgs): Promise<
  | Response
  | {
      user: FirebaseAdminUser;
      employee: FirebaseEmployee;
    }
> {
  const user = await requireUser(request);
  if (!user) return redirect("/");

  const employee = await getCurrentEmployee(user.uid);

  if (employee && employee.role.name !== "admin") {
    const _ = await fetch("/logout", {
      method: "POST",
    });
    return redirect("/");
  }

  return {
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL || null,
    } as FirebaseAdminUser,
    employee,
  };
}
