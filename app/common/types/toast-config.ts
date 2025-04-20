export type ToastConfig = {
  type: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
  duration?: number;
  closeButton: boolean;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  richColors?: boolean;
};
