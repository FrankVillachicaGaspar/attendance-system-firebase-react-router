import type { ToastConfig } from "../types/toast-config";
import executeToast from "./execute-toast.util";

export default function executeToastList(toastList: ToastConfig[]) {
  toastList.forEach((toastConfig) => {
    executeToast(toastConfig);
  });
}
