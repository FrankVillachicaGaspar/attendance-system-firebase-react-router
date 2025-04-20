import { toast } from "sonner";
import type { ToastConfig } from "../types/toast-config";

export default function executeToast(config: ToastConfig) {
  if (config.type === "error") {
    toast.error(config.title, {
      description: config.description,
      duration: config.duration,
      closeButton: config.closeButton,
      position: config.position ?? "bottom-right",
      richColors: config.richColors ?? false,
    });
  } else if (config.type === "success") {
    toast.success(config.title, {
      description: config.description,
      duration: config.duration,
      closeButton: config.closeButton,
      position: config.position ?? "bottom-right",
      richColors: config.richColors ?? false,
    });
  } else if (config.type === "warning") {
    toast.warning(config.title, {
      description: config.description,
      duration: config.duration,
      closeButton: config.closeButton,
      position: config.position ?? "bottom-right",
      richColors: config.richColors ?? false,
    });
  } else if (config.type === "info") {
    toast.info(config.title, {
      description: config.description,
      duration: config.duration,
      closeButton: config.closeButton,
      position: config.position ?? "bottom-right",
      richColors: config.richColors ?? false,
    });
  }
}
