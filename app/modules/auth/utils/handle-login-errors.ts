import { toast } from "sonner";

export function handleLoginError(error: any) {
  // Handle Firebase auth errors
  if (
    error.code === "auth/user-not-found" ||
    error.code === "auth/wrong-password" ||
    error.code === "auth/invalid-credential"
  ) {
    toast.error("Invalid email or password", {
      richColors: true,
      position: "bottom-center",
    });
  } else if (error.code === "auth/too-many-requests") {
    toast.error(
      "Demasiados intentos de inicio de sesión fallidos. Por favor, inténntalo de nuevo más tarde",
      {
        richColors: true,
        position: "bottom-center",
      }
    );
  } else {
    toast.error(
      "El inicio de sesión ha fallado, por favor inténtelo mas tarde.",
      {
        richColors: true,
        position: "bottom-center",
      }
    );
  }
}
