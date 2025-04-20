import { createCookieSessionStorage, redirect } from "react-router";

// Asegúrate de definir SESSION_SECRET en tus variables de entorno
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error(
    "SESSION_SECRET no está definido en las variables de entorno"
  );
}

const MAX_SESSION_AGE = 60 * 60 * 24 * 5; // 7 días en segundos

// Configuración de la cookie de sesión
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session", // Nombre de la cookie
    httpOnly: true, // Solo accesible desde el servidor
    path: "/", // Disponible en toda la app
    sameSite: "lax", // Protección CSRF básica
    secure: process.env.NODE_ENV === "production", // Sólo HTTPS en producción
    secrets: [sessionSecret],
    maxAge: MAX_SESSION_AGE, // 7 días en segundos
  },
});

// Helpers básicos sobre sesiones
export const { getSession, commitSession, destroySession } = sessionStorage;

export interface SessionUserdata {
  idToken: string;
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
}

/**
 * Crea una sesión de usuario guardando el idToken y datos de cuenta
 * @param userData Objeto con idToken, uid, email y opcional displayName
 * @param redirectTo Ruta a la que se redirige tras crear la sesión
 */
export async function createUserSession(
  userData: SessionUserdata,
  redirectTo: string
) {
  const session = await getSession();
  session.set("idToken", userData.idToken);
  session.set("user", {
    uid: userData.uid,
    email: userData.email,
    displayName: userData.displayName || null,
    photoURL: userData.photoURL || null,
  });
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

/**
 * Obtiene y valida el idToken de la sesión, redirige a /login si no existe
 */
export async function requireSessionToken(request: Request): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("idToken");
  return token;
}

/**
 * Obtiene los datos de usuario almacenados en la sesión, redirige si no hay datos
 */
export async function requireUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  return user as SessionUserdata;
}

/**
 * Cierra la sesión destruyendo la cookie y redirige a la ruta indicada
 * @param request Request actual para leer la cookie
 * @param redirectTo Ruta a la que redirigir tras logout (por defecto "/")
 */
export async function logout(request: Request, redirectTo: string = "/") {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
